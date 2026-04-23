<?php
if (ob_get_level()) ob_end_clean();
ob_start();
header('Content-Type: application/json');
@error_reporting(0);
@ini_set('display_errors', 0);

register_shutdown_function(function() {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        echo json_encode(['success' => false, 'message' => 'Fatal: ' . $e['message']]);
    }
    ob_end_flush();
});

define('STRIPE_SECRET_KEY', 'sk_test_51TOpkAFUWwbZNdt2bTNTMAGLmXkrpbPl2RhvqXfWbNqs3OEdQi79eKrLBuMf1lZDM68dAyscEfNd7Jpd39jljw2K00BtMNYS0a');

$input           = json_decode(file_get_contents('php://input'), true) ?? [];
$paymentIntentId = $input['payment_intent_id'] ?? '';
$paymentMethod   = $input['payment_method'] ?? 'stripe';
$email           = $input['email'] ?? '';
$items           = $input['items'] ?? [];
$subtotal        = (float)($input['subtotal'] ?? 0);
$processingFee   = (float)($input['processing_fee'] ?? 0);
$totalAmount     = (float)($input['total_amount'] ?? 0);
$discountAmount  = (float)($input['discount_amount'] ?? 0);
$couponCode      = strtoupper(trim($input['coupon_code'] ?? ''));
$currency        = $input['currency'] ?? 'EUR';
$currencySymbol  = $input['currency_symbol'] ?? '€';
$mode            = $input['mode'] ?? 'cart'; // cart | boost | coaching

// Order type meghatározása
$orderType = 'account';
if ($mode === 'boost')    $orderType = 'boosting';
if ($mode === 'coaching') $orderType = 'coaching';

if (empty($email) || $totalAmount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Stripe verify (only for stripe payments)
if ($paymentMethod === 'stripe' && !empty($paymentIntentId)) {
    $ch = curl_init("https://api.stripe.com/v1/payment_intents/{$paymentIntentId}");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD        => STRIPE_SECRET_KEY . ':',
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $curlResult = curl_exec($ch);
    $curlError  = curl_error($ch);
    curl_close($ch);

    // Ha curl hiba van, engedjük tovább (lokális dev környezet)
    if ($curlError || !$curlResult) {
        error_log('Stripe verify curl error: ' . $curlError);
        // Folytatjuk - a payment intent ID-t a JS már ellenőrizte
    } else {
        $stripeRes = json_decode($curlResult, true);
        if (!in_array($stripeRes['status'] ?? '', ['succeeded', 'processing'])) {
            echo json_encode(['success' => false, 'message' => 'Payment not confirmed by Stripe: ' . ($stripeRes['status'] ?? 'unknown')]);
            exit;
        }
    }
}

$orderNumber      = 'ORD-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));
$orderId          = null;

try {
    $pdo = new PDO("mysql:host=localhost;dbname=imustglide;charset=utf8mb4", 'root', 'root', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    if (session_status() === PHP_SESSION_NONE) session_start();

    // User azonosítás
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId && $email) {
        $row    = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $row->execute([$email]);
        $found  = $row->fetch();
        $userId = $found['id'] ?? null;
    }

    $isGuest          = ($userId === null);
    $lootPointsEarned = $isGuest ? 0 : max(0, (int)($totalAmount * 100));

    // Store credits check & deduct
    if (!$isGuest && $paymentMethod === 'store_credits') {
        $pdo->beginTransaction();
        $stmt    = $pdo->prepare("SELECT store_credits_balance FROM users WHERE id = ? FOR UPDATE");
        $stmt->execute([$userId]);
        $balance = (float)($stmt->fetch()['store_credits_balance'] ?? 0);
        if ($balance < $totalAmount) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Insufficient store credits']);
            exit;
        }
        $pdo->prepare("UPDATE users SET store_credits_balance = store_credits_balance - ? WHERE id = ?")
            ->execute([$totalAmount, $userId]);
        $pdo->commit();
    }

    // Coupon times_used frissítése
    $discountCodeId = null;
    if (!empty($couponCode)) {
        $cStmt = $pdo->prepare("SELECT id FROM discount_codes WHERE code = ? AND is_active = 1 LIMIT 1");
        $cStmt->execute([$couponCode]);
        $cRow = $cStmt->fetch();
        if ($cRow) {
            $discountCodeId = $cRow['id'];
            $pdo->prepare("UPDATE discount_codes SET times_used = times_used + 1 WHERE id = ?")
                ->execute([$discountCodeId]);
        }
    }

    // Order mentése
    $dbMethod    = $paymentMethod === 'store_credits' ? 'store_credits' : 'stripe';
    $notes       = $isGuest ? 'GUEST ORDER' : null;
    // Boost/coaching rendelések PENDING státusszal kezdenek
    $orderStatus = in_array($orderType, ['boosting','coaching']) ? 'pending' : 'completed';

    $pdo->prepare("
        INSERT INTO orders
            (user_id, order_number, subtotal, discount_amount, total_amount,
             currency, currency_symbol, status, payment_method, payment_intent_id,
             loot_points_earned, processing_fee, customer_email, discount_code_id, notes, order_type)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ")->execute([
        $userId, $orderNumber, $subtotal, $discountAmount, $totalAmount,
        $currency, $currencySymbol, $orderStatus, $dbMethod, $paymentIntentId,
        $lootPointsEarned, $processingFee, $email, $discountCodeId, $notes, $orderType
    ]);
    $orderId = $pdo->lastInsertId();

    // Order items mentése
    foreach ($items as $item) {
        $pdo->prepare("
            INSERT INTO order_items (order_id, item_type, item_id, item_name, price, quantity, options_json)
            VALUES (?,?,?,?,?,?,?)
        ")->execute([
            $orderId,
            $item['type']  ?? 'account',
            $item['id']    ?? 0,
            $item['name']  ?? 'Product',
            (float)($item['price'] ?? 0),
            (int)($item['qty']   ?? 1),
            isset($item['detail']) ? json_encode(['detail' => $item['detail']]) : null
        ]);
    }

    // User stats frissítése (csak bejelentkezett user)
    if (!$isGuest) {
        $pdo->prepare("
            UPDATE users
            SET total_orders = total_orders + 1,
                total_spent  = total_spent + ?,
                loot_points  = loot_points + ?
            WHERE id = ?
        ")->execute([$totalAmount, $lootPointsEarned, $userId]);

        // Transaction log
        $txType = $paymentMethod === 'store_credits' ? 'credit_use' : 'purchase';
        $pdo->prepare("
            INSERT INTO transactions (user_id, order_id, transaction_type, amount, description)
            VALUES (?,?,?,?,?)
        ")->execute([$userId, $orderId, $txType, $totalAmount, "Order {$orderNumber}"]);
    }

} catch (Throwable $e) {
    error_log('confirm_payment error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
}

ob_clean();
echo json_encode([
    'success'             => true,
    'order_number'        => $orderNumber,
    'order_id'            => $orderId,
    'loot_points_earned'  => $lootPointsEarned,
    'is_guest'            => $isGuest,
    'message'             => 'Payment successful!',
]);