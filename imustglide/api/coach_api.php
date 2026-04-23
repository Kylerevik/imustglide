<?php
/**
 * Coach Panel API
 */
header('Content-Type: application/json');
@error_reporting(0);
@ini_set('display_errors', 0);

// Session indítása ELŐSZÖR
if (session_status() === PHP_SESSION_NONE) session_start();

// DB kapcsolat
$possible_paths = ['../config/database.php','../database.php','config/database.php','database.php'];
$db_included = false;
foreach ($possible_paths as $p) {
    if (file_exists($p)) { require_once $p; $db_included = true; break; }
}
if (!$db_included || !isset($pdo)) {
    echo json_encode(['success'=>false,'message'=>'DB connection failed']); exit;
}

// Auth ellenőrzés
if (empty($_SESSION['user_id'])) {
    echo json_encode(['success'=>false,'message'=>'Not authenticated']); exit;
}

$userId = (int)$_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT LOWER(role) as role, first_name FROM users WHERE id = ? AND is_active = 1");
$stmt->execute([$userId]);
$me = $stmt->fetch();

if (!$me || !$me['role'] === 'coach') {
    echo json_encode(['success'=>false,'message'=>'Access denied - coach role required']); exit;
}

$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($action) {

        case 'get_orders':
            $filter = $_GET['filter'] ?? 'available';

            $hasOrderType = false;
            $hasClaimedBy = false;
            try { $pdo->query("SELECT order_type FROM orders LIMIT 1"); $hasOrderType = true; } catch(Exception $e) {}
            try { $pdo->query("SELECT claimed_by FROM orders LIMIT 1"); $hasClaimedBy = true; } catch(Exception $e) {}

            $where  = [];
            $params = [];

            if ($hasOrderType) {
                $where[] = "o.order_type = 'coaching'";
            } else {
                $where[] = "oi.item_type = 'coaching'";
            }

            if ($filter === 'available') {
                $where[] = "o.status = 'pending'";
                if ($hasClaimedBy) $where[] = "o.claimed_by IS NULL";
            } elseif ($filter === 'mine') {
                if ($hasClaimedBy) { $where[] = "o.claimed_by = ?"; $params[] = $userId; }
                else { $where[] = "1=0"; }
            }

            $claimedSelect = $hasClaimedBy ? "o.claimed_at," : "NULL as claimed_at,";

            $sql = "SELECT o.id, o.order_number, o.total_amount, o.status,
                           o.currency_symbol, o.created_at, {$claimedSelect}
                           o.customer_email, o.notes,
                           COALESCE(u.first_name, 'Guest') as customer_name,
                           COALESCE(u.email, o.customer_email) as customer_email_display,
                           GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name,
                           MAX(oi.options_json) as coaching_detail
                    FROM orders o
                    LEFT JOIN users u ON o.user_id = u.id
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    WHERE " . implode(' AND ', $where) . "
                    GROUP BY o.id
                    ORDER BY o.created_at DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            echo json_encode(['success'=>true,'orders'=>$orders]);
            break;

        case 'claim_order':
            $orderId = (int)($input['order_id'] ?? 0);

            try { $pdo->query("SELECT claimed_by FROM orders LIMIT 1"); }
            catch (Exception $e) {
                echo json_encode(['success'=>false,'message'=>'Database migration needed: claimed_by column missing']); exit;
            }

            $stmt = $pdo->prepare("SELECT id, claimed_by, status FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();

            if (!$order) { echo json_encode(['success'=>false,'message'=>'Order not found']); exit; }
            if (!empty($order['claimed_by'])) { echo json_encode(['success'=>false,'message'=>'Already claimed']); exit; }
            if ($order['status'] !== 'pending') { echo json_encode(['success'=>false,'message'=>'Order not available']); exit; }

            $affected = $pdo->prepare("UPDATE orders SET claimed_by = ?, claimed_at = NOW(), status = 'processing' WHERE id = ? AND claimed_by IS NULL");
            $affected->execute([$userId, $orderId]);

            if ($affected->rowCount() === 0) {
                echo json_encode(['success'=>false,'message'=>'Order was just claimed by someone else']); exit;
            }

            echo json_encode(['success'=>true,'message'=>'Session claimed! 🎓']);
            break;

        case 'unclaim_order':
            $orderId = (int)($input['order_id'] ?? 0);

            $stmt = $pdo->prepare("SELECT claimed_by, status FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();

            if (!$order) { echo json_encode(['success'=>false,'message'=>'Order not found']); exit; }
            if ($order['claimed_by'] != $userId) {
                echo json_encode(['success'=>false,'message'=>'Not your session']); exit;
            }
            if ($order['status'] !== 'processing') {
                echo json_encode(['success'=>false,'message'=>'Can only return sessions in processing state']); exit;
            }

            $pdo->prepare("UPDATE orders SET claimed_by = NULL, claimed_at = NULL, status = 'pending' WHERE id = ?")
                ->execute([$orderId]);

            echo json_encode(['success'=>true,'message'=>'Session returned to available pool']);
            break;

        case 'complete_order':
            $orderId = (int)($input['order_id'] ?? 0);

            $stmt = $pdo->prepare("SELECT claimed_by, status FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();

            if (!$order) { echo json_encode(['success'=>false,'message'=>'Order not found']); exit; }
            if ($order['claimed_by'] != $userId) {
                echo json_encode(['success'=>false,'message'=>'Not your session']); exit;
            }
            if ($order['status'] !== 'processing') {
                echo json_encode(['success'=>false,'message'=>'Session not in processing state']); exit;
            }

            $pdo->prepare("UPDATE orders SET status = 'completed', completed_by = ?, completed_at = NOW() WHERE id = ?")
                ->execute([$userId, $orderId]);

            echo json_encode(['success'=>true,'message'=>'Session marked as completed! ✅']);
            break;

        case 'get_stats':
            try {
                $claimed   = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE claimed_by = ?");
                $claimed->execute([$userId]); $claimedCount = $claimed->fetchColumn();

                $completed = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE claimed_by = ? AND status = 'completed'");
                $completed->execute([$userId]); $completedCount = $completed->fetchColumn();

                $earnings  = $pdo->prepare("SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE claimed_by = ? AND status = 'completed'");
                $earnings->execute([$userId]); $earningsTotal = $earnings->fetchColumn();

                try {
                    $available = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_type='coaching' AND status='pending' AND claimed_by IS NULL")->fetchColumn();
                } catch (Exception $e) {
                    $available = $pdo->query("SELECT COUNT(DISTINCT o.id) FROM orders o JOIN order_items oi ON o.id=oi.order_id WHERE oi.item_type='coaching' AND o.status='pending' AND o.claimed_by IS NULL")->fetchColumn();
                }
            } catch (Exception $e) {
                $claimedCount = 0; $completedCount = 0; $earningsTotal = 0; $available = 0;
            }

            echo json_encode([
                'success'   => true,
                'claimed'   => (int)$claimedCount,
                'completed' => (int)$completedCount,
                'earnings'  => (float)$earningsTotal,
                'available' => (int)$available,
            ]);
            break;

        default:
            echo json_encode(['success'=>false,'message'=>'Unknown action: '.$action]);
    }
} catch (Throwable $e) {
    error_log('coach_api error: ' . $e->getMessage());
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
