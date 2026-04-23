<?php
/**
 * Get Profile API Endpoint
 * GET /api/get_profile.php
 */

require_once '../config/database.php';

header('Content-Type: application/json');

// Bejelentkezés ellenőrzése
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // User adatok lekérése
    $stmt = $pdo->prepare("
        SELECT id, email, first_name, last_name, role, avatar_initial,
               preferred_language, preferred_currency, currency_symbol,
               store_credits_balance, loot_points, phone, country,
               discord_username, total_orders, total_spent, created_at
        FROM users
        WHERE id = ? AND is_active = 1
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Rendelések lekérése
    $ordersStmt = $pdo->prepare("
        SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol,
               o.created_at, o.loot_points_earned, o.payment_method,
               GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name,
               GROUP_CONCAT(oi.options_json SEPARATOR '||') as items_detail,
               SUM(oi.price * oi.quantity) as price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 20
    ");
    $ordersStmt->execute([$userId]);
    $orders = $ordersStmt->fetchAll();

    // Formázzuk az orders adatokat
    $formattedOrders = array_map(function($order) {
        // Parse detail from options_json
        $detail = '';
        if (!empty($order['items_detail'])) {
            $parts = explode('||', $order['items_detail']);
            $details = [];
            foreach ($parts as $part) {
                $json = json_decode($part, true);
                if ($json && isset($json['detail']) && $json['detail']) {
                    $details[] = $json['detail'];
                }
            }
            $detail = implode(', ', $details);
        }
        return [
            'id'              => $order['id'],
            'order_number'    => $order['order_number'],
            'product_name'    => $order['product_name'] ?? 'Order #' . $order['order_number'],
            'detail'          => $detail,
            'status'          => $order['status'],
            'price'           => (float)$order['total_amount'],
            'currency_symbol' => $order['currency_symbol'],
            'loot_points_earned' => (int)$order['loot_points_earned'],
            'payment_method'  => $order['payment_method'] ?? 'stripe',
            'created_at'      => $order['created_at'],
        ];
    }, $orders);

    // Transactions (store credits history)
    $creditsStmt = $pdo->prepare("
        SELECT amount, transaction_type, description, created_at
        FROM transactions
        WHERE user_id = ? AND transaction_type IN ('credit_add', 'credit_use')
        ORDER BY created_at DESC
        LIMIT 20
    ");
    $creditsStmt->execute([$userId]);
    $creditsHistory = $creditsStmt->fetchAll();

    // Loot points history (purchase tranzakciókból)
    $pointsStmt = $pdo->prepare("
        SELECT o.loot_points_earned as points_change, o.created_at
        FROM orders o
        WHERE o.user_id = ? AND o.loot_points_earned > 0
        ORDER BY o.created_at DESC
        LIMIT 20
    ");
    $pointsStmt->execute([$userId]);
    $pointsHistory = $pointsStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'user'    => [
            'id'               => $user['id'],
            'email'            => $user['email'],
            'first_name'       => $user['first_name'],
            'last_name'        => $user['last_name'],
            'avatar_initial'   => $user['avatar_initial'],
            'role'             => $user['role'],
            'phone'            => $user['phone'],
            'country'          => $user['country'],
            'discord_username' => $user['discord_username'],
            'preferred_language'  => $user['preferred_language'],
            'preferred_currency'  => $user['preferred_currency'],
            'currency_symbol'     => $user['currency_symbol'],
            'member_since'        => $user['created_at'],
            'loyalty_points'      => (int)$user['loot_points'],
        ],
        'stats'   => [
            'store_credits_balance' => (float)$user['store_credits_balance'],
            'loot_points'           => (int)$user['loot_points'],
            'total_orders'          => (int)$user['total_orders'],
            'total_spent'           => (float)$user['total_spent'],
        ],
        'orders'          => $formattedOrders,
        'credits_history' => $creditsHistory,
        'points_history'  => $pointsHistory,
    ]);

} catch (PDOException $e) {
    error_log('get_profile error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>