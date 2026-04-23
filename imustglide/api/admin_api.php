<?php
/**
 * Admin API Endpoint
 * /api/admin_api.php
 */

require_once '../config/database.php';

header('Content-Type: application/json');

// Admin ellenőrzés
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Role ellenőrzés
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$admin = $stmt->fetch();

if (!$admin || $admin['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit;
}

$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($action) {

        // ── Dashboard stats ──────────────────────────────
        case 'dashboard':
            $totalUsers   = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $totalOrders  = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
            $totalRevenue = $pdo->query("SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE status='completed'")->fetchColumn();
            $bannedUsers  = $pdo->query("SELECT COUNT(*) FROM users WHERE is_active=0")->fetchColumn();

            // Son 5 rendelés
            $recentOrders = $pdo->query("
                SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol, o.created_at,
                       o.customer_email, o.notes,
                       u.first_name, u.email,
                       COALESCE(u.first_name, 'Guest') as display_name,
                       COALESCE(u.email, o.customer_email) as display_email,
                       GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                GROUP BY o.id
                ORDER BY o.created_at DESC
                LIMIT 5
            ")->fetchAll();

            // Son 5 user
            $recentUsers = $pdo->query("
                SELECT id, first_name, email, role, avatar_initial, is_active, created_at, total_orders, total_spent
                FROM users
                ORDER BY created_at DESC
                LIMIT 5
            ")->fetchAll();

            echo json_encode([
                'success'       => true,
                'total_users'   => (int)$totalUsers,
                'total_orders'  => (int)$totalOrders,
                'total_revenue' => (float)$totalRevenue,
                'banned_users'  => (int)$bannedUsers,
                'recent_orders' => $recentOrders,
                'recent_users'  => $recentUsers,
            ]);
            break;

        // ── Users list ───────────────────────────────────
        case 'get_users':
            $role   = $_GET['role'] ?? 'all';
            $search = $_GET['search'] ?? '';

            $where = [];
            $params = [];

            if ($role === 'banned') {
                $where[] = 'is_active = 0';
            } elseif ($role !== 'all') {
                $where[] = 'role = ?';
                $params[] = $role;
            }

            if ($search) {
                $where[] = '(first_name LIKE ? OR email LIKE ?)';
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            $sql = "SELECT id, first_name, last_name, email, role, avatar_initial, is_active,
                           store_credits_balance, loot_points, total_orders, total_spent, created_at, last_login
                    FROM users";
            if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
            $sql .= ' ORDER BY created_at DESC';

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $users = $stmt->fetchAll();

            echo json_encode(['success' => true, 'users' => $users]);
            break;

        // ── Single user ──────────────────────────────────
        case 'get_user':
            $userId = (int)($_GET['id'] ?? 0);
            $stmt = $pdo->prepare("
                SELECT id, first_name, last_name, email, role, avatar_initial, is_active,
                       store_credits_balance, loot_points, phone, country, discord_username,
                       preferred_language, preferred_currency, total_orders, total_spent, created_at, last_login
                FROM users WHERE id = ?
            ");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            // User orders
            $ordersStmt = $pdo->prepare("
                SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol, o.created_at,
                       o.payment_method, o.loot_points_earned, o.payment_intent_id, o.customer_email,
                       u.first_name, u.last_name, u.email,
                       GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name,
                       GROUP_CONCAT(oi.options_json SEPARATOR '||') as items_detail
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.user_id = ?
                GROUP BY o.id
                ORDER BY o.created_at DESC
            ");
            $ordersStmt->execute([$userId]);
            $rawOrders = $ordersStmt->fetchAll();

            // Parse detail from options_json
            $orders = array_map(function($o) {
                $detail = '';
                if (!empty($o['items_detail'])) {
                    $parts = explode('||', $o['items_detail']);
                    $details = [];
                    foreach ($parts as $part) {
                        $json = json_decode($part, true);
                        if ($json && isset($json['detail']) && $json['detail']) {
                            $details[] = $json['detail'];
                        }
                    }
                    $detail = implode(', ', $details);
                }
                $o['detail'] = $detail;
                return $o;
            }, $rawOrders);

            echo json_encode(['success' => true, 'user' => $user, 'orders' => $orders]);
            break;

        // ── Update user ──────────────────────────────────
        case 'update_user':
            $userId = (int)($input['id'] ?? 0);
            $currencySymbols = ['EUR'=>'€','USD'=>'$','GBP'=>'£','CAD'=>'$','AUD'=>'$','PLN'=>'zł','CHF'=>'Fr'];
            $currency = $input['preferred_currency'] ?? 'EUR';

            $stmt = $pdo->prepare("
                UPDATE users SET
                    first_name = ?, last_name = ?, email = ?, role = ?,
                    store_credits_balance = ?, loot_points = ?,
                    discord_username = ?, country = ?,
                    avatar_initial = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $input['first_name'] ?? '',
                $input['last_name']  ?? '',
                $input['email']      ?? '',
                $input['role']       ?? 'customer',
                (float)($input['store_credits_balance'] ?? 0),
                (int)($input['loot_points'] ?? 0),
                $input['discord_username'] ?? '',
                $input['country']          ?? '',
                strtoupper(substr($input['first_name'] ?? 'U', 0, 1)),
                $userId
            ]);

            echo json_encode(['success' => true, 'message' => 'User updated']);
            break;

        // ── Ban user ─────────────────────────────────────
        case 'ban_user':
            $userId = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE users SET is_active = 0 WHERE id = ?")->execute([$userId]);
            echo json_encode(['success' => true, 'message' => 'User banned']);
            break;

        // ── Activate user ────────────────────────────────
        case 'activate_user':
            $userId = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE users SET is_active = 1 WHERE id = ?")->execute([$userId]);
            echo json_encode(['success' => true, 'message' => 'User activated']);
            break;

        // ── Reset password ───────────────────────────────
        case 'reset_password':
            $userId      = (int)($input['id'] ?? 0);
            $newPassword = $input['password'] ?? '';

            if (strlen($newPassword) < 6) {
                echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
                exit;
            }

            $hash = password_hash($newPassword, PASSWORD_BCRYPT);
            $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$hash, $userId]);
            echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
            break;

        // ── Add credits ──────────────────────────────────
        case 'add_credits':
            $userId = (int)($input['id'] ?? 0);
            $amount = (float)($input['amount'] ?? 0);

            if ($amount <= 0) {
                echo json_encode(['success' => false, 'message' => 'Invalid amount']);
                exit;
            }

            $pdo->prepare("UPDATE users SET store_credits_balance = store_credits_balance + ? WHERE id = ?")->execute([$amount, $userId]);
            $pdo->prepare("INSERT INTO transactions (user_id, transaction_type, amount, description) VALUES (?, 'credit_add', ?, 'Admin credit addition')")->execute([$userId, $amount]);
            echo json_encode(['success' => true, 'message' => "€{$amount} credits added"]);
            break;

        // ── Orders list ──────────────────────────────────
        case 'get_orders':
            $status = $_GET['status'] ?? 'all';
            $search = $_GET['search'] ?? '';

            $where  = [];
            $params = [];

            if ($status !== 'all') {
                $where[] = 'o.status = ?';
                $params[] = $status;
            }
            if ($search) {
                $where[] = '(o.order_number LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR o.customer_email LIKE ?)';
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            $sql = "SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol, o.created_at,
                           o.payment_method, o.loot_points_earned, o.payment_intent_id, o.customer_email, o.notes,
                           u.first_name, u.last_name, u.email,
                           COALESCE(u.first_name, 'Guest') as display_name,
                           COALESCE(u.email, o.customer_email) as display_email,
                           GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name,
                           GROUP_CONCAT(oi.options_json SEPARATOR '||') as items_detail
                    FROM orders o
                    LEFT JOIN users u ON o.user_id = u.id
                    LEFT JOIN order_items oi ON o.id = oi.order_id";
            if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
            $sql .= ' GROUP BY o.id ORDER BY o.created_at DESC';

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            echo json_encode(['success' => true, 'orders' => $orders]);
            break;

        // ── Update order status ──────────────────────────
        case 'update_order':
            $orderId = (int)($input['id'] ?? 0);
            $status  = $input['status'] ?? '';
            $allowed = ['pending','processing','completed','cancelled','refunded'];

            if (!in_array($status, $allowed)) {
                echo json_encode(['success' => false, 'message' => 'Invalid status']);
                exit;
            }

            $completed = $status === 'completed' ? 'NOW()' : 'NULL';
            $pdo->prepare("UPDATE orders SET status = ?, completed_at = $completed WHERE id = ?")->execute([$status, $orderId]);
            echo json_encode(['success' => true, 'message' => 'Order updated']);
            break;

        // ── Delete order ─────────────────────────────────
        case 'delete_order':
            $orderId = (int)($input['id'] ?? 0);
            $pdo->prepare("DELETE FROM orders WHERE id = ?")->execute([$orderId]);
            echo json_encode(['success' => true, 'message' => 'Order deleted']);
            break;

        // ── Discount codes ───────────────────────────────
        case 'get_discount_codes':
            $codes = $pdo->query("SELECT * FROM discount_codes ORDER BY created_at DESC")->fetchAll();
            echo json_encode(['success' => true, 'codes' => $codes]);
            break;

        case 'create_discount_code':
            $code      = strtoupper(trim($input['code'] ?? ''));
            $type      = $input['type'] ?? 'percentage';
            $value     = (float)($input['value'] ?? 0);
            $maxUses   = (int)($input['max_uses'] ?? 0);
            $validUntil = $input['valid_until'] ?? null;
            $desc      = $input['description'] ?? '';

            if (empty($code) || $value <= 0) {
                echo json_encode(['success' => false, 'message' => 'Code and value are required']);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO discount_codes (code, type, value, max_uses, valid_until, description, is_active, source)
                VALUES (?, ?, ?, ?, ?, ?, 1, 'manual')
            ");
            $stmt->execute([$code, $type, $value, $maxUses, $validUntil ?: null, $desc]);
            echo json_encode(['success' => true, 'message' => "Code '$code' created"]);
            break;

        case 'toggle_discount_code':
            $codeId    = (int)($input['id'] ?? 0);
            $isActive  = (int)($input['is_active'] ?? 0);
            $pdo->prepare("UPDATE discount_codes SET is_active = ? WHERE id = ?")->execute([$isActive, $codeId]);
            echo json_encode(['success' => true, 'message' => 'Code updated']);
            break;

        case 'delete_discount_code':
            $codeId = (int)($input['id'] ?? 0);
            $pdo->prepare("DELETE FROM discount_codes WHERE id = ?")->execute([$codeId]);
            echo json_encode(['success' => true, 'message' => 'Code deleted']);
            break;

        // ============================
        // GAMES
        // ============================
        case 'get_games':
            $stmt = $pdo->query("SELECT * FROM games ORDER BY display_order ASC");
            echo json_encode(['success' => true, 'games' => $stmt->fetchAll()]);
            break;

        case 'update_game':
            $id = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE games SET game_name=?, slug=?, is_active=?, display_order=?, has_discount=?, discount_percentage=? WHERE id=?")
                ->execute([$input['game_name'], $input['slug'], (int)($input['is_active']??1), (int)($input['display_order']??0), (int)($input['has_discount']??0), (int)($input['discount_percentage']??0), $id]);
            echo json_encode(['success' => true, 'message' => 'Game updated']);
            break;

        case 'add_game':
            $pdo->prepare("INSERT INTO games (game_name,slug,icon_path,is_active,display_order) VALUES (?,?,?,?,?)")
                ->execute([$input['game_name'], $input['slug'], $input['icon_path']??'', (int)($input['is_active']??1), (int)($input['display_order']??99)]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'delete_game':
            $pdo->prepare("DELETE FROM games WHERE id=?")->execute([(int)($input['id']??0)]);
            echo json_encode(['success' => true]);
            break;

        // ============================
        // ACCOUNT TYPES
        // ============================
        case 'get_account_types':
            $server = $_GET['server'] ?? '';
            $sql    = "SELECT at.*, (SELECT COUNT(*) FROM account_inventory ai WHERE ai.type_id = at.id AND ai.status='available') as stock FROM account_types at WHERE at.game_id=1";
            $params = [];
            if ($server) { $sql .= " AND at.server=?"; $params[] = $server; }
            $sql .= " ORDER BY at.server, at.display_order ASC";
            $stmt = $pdo->prepare($sql); $stmt->execute($params);
            echo json_encode(['success' => true, 'types' => $stmt->fetchAll()]);
            break;

        case 'add_account_type':
            $pdo->prepare("INSERT INTO account_types (game_id,server,title,description,price,discounted_price,blue_essence,icon_path,features_json,is_skin_account,display_order) VALUES (1,?,?,?,?,?,?,?,?,?,?)")
                ->execute([$input['server'], $input['title'], $input['description']??'', (float)($input['price']??0), $input['discounted_price']??null, (int)($input['blue_essence']??40000), $input['icon_path']??'pics/handleveled.png', $input['features_json']??'[]', (int)($input['is_skin_account']??0), (int)($input['display_order']??99)]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'update_account_type':
            $id = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE account_types SET title=?, description=?, price=?, discounted_price=?, blue_essence=?, icon_path=?, is_active=?, display_order=? WHERE id=?")
                ->execute([$input['title'], $input['description']??'', (float)($input['price']??0), $input['discounted_price']??null, (int)($input['blue_essence']??40000), $input['icon_path']??'', (int)($input['is_active']??1), (int)($input['display_order']??0), $id]);
            echo json_encode(['success' => true]);
            break;

        case 'delete_account_type':
            $pdo->prepare("DELETE FROM account_types WHERE id=?")->execute([(int)($input['id']??0)]);
            echo json_encode(['success' => true]);
            break;

        // ============================
        // ACCOUNT INVENTORY
        // ============================
        case 'get_account_inventory':
            $typeId = (int)($_GET['type_id'] ?? 0);
            $stmt   = $pdo->prepare("SELECT * FROM account_inventory WHERE type_id=? ORDER BY status, created_at DESC");
            $stmt->execute([$typeId]);
            echo json_encode(['success' => true, 'inventory' => $stmt->fetchAll()]);
            break;

        case 'add_account_inventory':
            $pdo->prepare("INSERT INTO account_inventory (type_id, username, password, email, email_password, notes) VALUES (?,?,?,?,?,?)")
                ->execute([(int)($input['type_id']??0), $input['username']??'', $input['password']??'', $input['email']??'', $input['email_password']??'', $input['notes']??'']);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'delete_account_inventory':
            $pdo->prepare("DELETE FROM account_inventory WHERE id=?")->execute([(int)($input['id']??0)]);
            echo json_encode(['success' => true]);
            break;

        case 'update_inventory_status':
            $pdo->prepare("UPDATE account_inventory SET status=? WHERE id=?")->execute([$input['status']??'available', (int)($input['id']??0)]);
            echo json_encode(['success' => true]);
            break;

        // ============================
        // ACCOUNTS (legacy - kept for compatibility)
        // ============================
        case 'get_accounts':
            $region = $_GET['region'] ?? '';
            $sql    = "SELECT * FROM accounts WHERE game_id=1";
            $params = [];
            if ($region) { $sql .= " AND server=?"; $params[] = $region; }
            $sql .= " ORDER BY server, base_price ASC";
            $stmt = $pdo->prepare($sql); $stmt->execute($params);
            echo json_encode(['success' => true, 'accounts' => $stmt->fetchAll()]);
            break;

        case 'update_account':
            $id = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE accounts SET title=?, base_price=?, discounted_price=?, server=?, leveling_type=?, status=?, has_lifetime_warranty=?, has_unverified_email=? WHERE id=?")
                ->execute([$input['title'], (float)($input['base_price']??0), $input['discounted_price']??(null), $input['server'], $input['leveling_type']??'handleveled', $input['status']??'available', (int)($input['has_lifetime_warranty']??0), (int)($input['has_unverified_email']??0), $id]);
            echo json_encode(['success' => true, 'message' => 'Account updated']);
            break;

        case 'add_account':
            $features = json_encode($input['features'] ?? []);
            $pdo->prepare("INSERT INTO accounts (game_id,title,description,base_price,discounted_price,server,leveling_type,blue_essence,rank_image_path,features_json,status,has_lifetime_warranty,has_unverified_email,instant_delivery) VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,1)")
                ->execute([$input['title'], $input['description']??'', (float)($input['base_price']??0), $input['discounted_price']??null, $input['server'], $input['leveling_type']??'handleveled', (int)($input['blue_essence']??40000), $input['rank_image_path']??'', $features, $input['status']??'available', (int)($input['has_lifetime_warranty']??1), (int)($input['has_unverified_email']??1)]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'delete_account':
            $pdo->prepare("DELETE FROM accounts WHERE id=?")->execute([(int)($input['id']??0)]);
            echo json_encode(['success' => true]);
            break;

        // ============================
        // BOOSTING SERVICES
        // ============================
        case 'get_boosting_services':
            $stmt = $pdo->query("SELECT * FROM boosting_services WHERE game_id=1 ORDER BY id ASC");
            echo json_encode(['success' => true, 'services' => $stmt->fetchAll()]);
            break;

        case 'update_boosting_service':
            $id = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE boosting_services SET base_price=?, is_active=? WHERE id=?")
                ->execute([(float)($input['base_price']??0), (int)($input['is_active']??1), $id]);
            echo json_encode(['success' => true, 'message' => 'Price updated']);
            break;

        // ============================
        // COACHING SERVICES
        // ============================
        case 'get_coaching_services':
            $stmt = $pdo->query("SELECT * FROM coaching_services WHERE game_id=1 ORDER BY id ASC");
            echo json_encode(['success' => true, 'services' => $stmt->fetchAll()]);
            break;

        case 'update_coaching_service':
            $id = (int)($input['id'] ?? 0);
            $pdo->prepare("UPDATE coaching_services SET hourly_rate=?, is_active=? WHERE id=?")
                ->execute([(float)($input['hourly_rate']??0), (int)($input['is_active']??1), $id]);
            echo json_encode(['success' => true, 'message' => 'Service updated']);
            break;

        // ============================
        // WORKERS (Boosters & Coaches)
        // ============================

        case 'get_workers':
            $workerRole = $_GET['worker_role'] ?? 'booster';

            // Ellenőrzöm claimed_by oszlop létezik-e
            $hasClaimedBy = false;
            try { $pdo->query("SELECT claimed_by FROM orders LIMIT 1"); $hasClaimedBy = true; } catch(Exception $e) {}

            if ($hasClaimedBy) {
                $stmt = $pdo->prepare("
                    SELECT u.id, u.first_name, u.last_name, u.email, u.avatar_initial,
                           u.is_active, u.created_at,
                           COUNT(DISTINCT o_all.id) AS total_claimed,
                           COUNT(DISTINCT CASE WHEN o_all.status='completed' THEN o_all.id END) AS total_completed,
                           COUNT(DISTINCT CASE WHEN o_all.status='processing' THEN o_all.id END) AS in_progress,
                           COALESCE(SUM(CASE WHEN o_all.status='completed' THEN o_all.total_amount END),0) AS total_earnings
                    FROM users u
                    LEFT JOIN orders o_all ON o_all.claimed_by = u.id
                    WHERE u.role = ?
                    GROUP BY u.id
                    ORDER BY total_completed DESC
                ");
            } else {
                // Fallback ha nincs claimed_by oszlop
                $stmt = $pdo->prepare("
                    SELECT id, first_name, last_name, email, avatar_initial, is_active, created_at,
                           0 AS total_claimed, 0 AS total_completed, 0 AS in_progress, 0 AS total_earnings
                    FROM users WHERE role = ? ORDER BY created_at DESC
                ");
            }
            $stmt->execute([$workerRole]);
            $workers = $stmt->fetchAll();

            $orderType = $workerRole === 'coach' ? 'coaching' : 'boosting';
            $availableCount = 0;
            try {
                $available = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE order_type=? AND status='pending' AND claimed_by IS NULL");
                $available->execute([$orderType]);
                $availableCount = (int)$available->fetchColumn();
            } catch(Exception $e) {}

            echo json_encode(['success'=>true, 'workers'=>$workers, 'available_count'=>$availableCount]);
            break;

        case 'get_worker_orders':
            $workerId = (int)($_GET['worker_id'] ?? 0);
            $filter   = $_GET['filter'] ?? 'processing'; // processing | completed | all

            $where  = ['o.claimed_by = ?'];
            $params = [$workerId];
            if ($filter === 'processing') $where[] = "o.status = 'processing'";
            elseif ($filter === 'completed') $where[] = "o.status = 'completed'";

            $stmt = $pdo->prepare("
                SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol,
                       o.created_at, o.claimed_at, o.order_type, o.customer_email,
                       COALESCE(u.first_name, 'Guest') as customer_name,
                       COALESCE(u.email, o.customer_email) as customer_email_display,
                       GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE " . implode(' AND ', $where) . "
                GROUP BY o.id
                ORDER BY o.created_at DESC
            ");
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            echo json_encode(['success'=>true, 'orders'=>$orders]);
            break;

        case 'get_available_orders':
            $orderType = $_GET['order_type'] ?? 'boosting';
            try {
                $stmt = $pdo->prepare("
                    SELECT o.id, o.order_number, o.total_amount, o.status, o.currency_symbol,
                           o.created_at, o.customer_email, o.order_type,
                           COALESCE(u.first_name, 'Guest') as customer_name,
                           COALESCE(u.email, o.customer_email) as customer_email_display,
                           GROUP_CONCAT(oi.item_name SEPARATOR ', ') as product_name
                    FROM orders o
                    LEFT JOIN users u ON o.user_id = u.id
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    WHERE o.order_type = ? AND o.status = 'pending' AND o.claimed_by IS NULL
                    GROUP BY o.id
                    ORDER BY o.created_at ASC
                ");
                $stmt->execute([$orderType]);
                $orders = $stmt->fetchAll();
            } catch(Exception $e) { $orders = []; }
            echo json_encode(['success'=>true, 'orders'=>$orders]);
            break;

        case 'admin_assign_order':
            $orderId  = (int)($input['order_id'] ?? 0);
            $workerId = (int)($input['worker_id'] ?? 0);

            $stmt = $pdo->prepare("SELECT id, status, claimed_by FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            if (!$order) { echo json_encode(['success'=>false,'message'=>'Order not found']); exit; }
            if ($order['claimed_by']) { echo json_encode(['success'=>false,'message'=>'Already claimed']); exit; }

            $pdo->prepare("UPDATE orders SET claimed_by=?, claimed_at=NOW(), status='processing' WHERE id=?")
                ->execute([$workerId, $orderId]);
            echo json_encode(['success'=>true,'message'=>'Order assigned successfully']);
            break;

        case 'admin_unassign_order':
            $orderId = (int)($input['order_id'] ?? 0);
            $pdo->prepare("UPDATE orders SET claimed_by=NULL, claimed_at=NULL, status='pending' WHERE id=?")
                ->execute([$orderId]);
            echo json_encode(['success'=>true,'message'=>'Order unassigned']);
            break;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
    }

} catch (PDOException $e) {
    error_log('Admin API error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>