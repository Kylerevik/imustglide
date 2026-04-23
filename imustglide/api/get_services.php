<?php
/**
 * GET /api/get_services.php?type=games|accounts|boosting|coaching
 * Returns service data from database
 */
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$possible_paths = [
    '../config/database.php',
    '../database.php',
    '../../config/database.php',
    '../../database.php',
    dirname(__DIR__) . '/config/database.php',
    dirname(__DIR__) . '/database.php',
    __DIR__ . '/database.php',
    __DIR__ . '/../database.php',
];
$db_included = false;
foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $db_included = true;
        break;
    }
}
if (!$db_included) {
    echo json_encode(['success' => false, 'message' => 'Database not found']);
    exit;
}

try {
    $type = $_GET['type'] ?? 'games';
    $game = $_GET['game'] ?? 'league-of-legends';

    switch ($type) {

        case 'games':
            $stmt = $pdo->query("SELECT * FROM games ORDER BY display_order ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'accounts':
            $region = $_GET['region'] ?? null;
            $gameRow = $pdo->prepare("SELECT id FROM games WHERE slug = ?");
            $gameRow->execute([$game]);
            $gameId = $gameRow->fetchColumn() ?: 1;

            // Use account_types if available, fallback to accounts table
            try {
                $sql = "SELECT at.*, (SELECT COUNT(*) FROM account_inventory ai WHERE ai.type_id = at.id AND ai.status='available') as stock FROM account_types at WHERE at.game_id = ? AND at.is_active = 1";
                $params = [$gameId];
                if ($region) { $sql .= " AND at.server = ?"; $params[] = strtoupper($region); }
                $sql .= " ORDER BY at.display_order ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $rows = $stmt->fetchAll();

                if (empty($rows)) throw new Exception('No account types found');

                $accounts = array_map(function($a) {
                    $a['features'] = json_decode($a['features_json'] ?? '[]', true) ?: [];
                    $a['base_price'] = $a['price'];
                    $a['title'] = $a['title'];
                    $a['rank_image_path'] = $a['icon_path'];
                    return $a;
                }, $rows);

            } catch(Exception $e) {
                // Fallback to old accounts table
                $sql = "SELECT * FROM accounts WHERE game_id = ? AND status = 'available'";
                $params = [$gameId];
                if ($region) { $sql .= " AND server = ?"; $params[] = strtoupper($region); }
                $sql .= " ORDER BY base_price ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $rows = $stmt->fetchAll();
                $accounts = array_map(function($a) {
                    $a['features'] = json_decode($a['features_json'] ?? '[]', true) ?: [];
                    return $a;
                }, $rows);
            }

            echo json_encode(['success' => true, 'data' => $accounts]);
            break;

        case 'boosting':
            $gameRow = $pdo->prepare("SELECT id FROM games WHERE slug = ?");
            $gameRow->execute([$game]);
            $gameId = $gameRow->fetchColumn() ?: 1;

            $stmt = $pdo->prepare("SELECT * FROM boosting_services WHERE game_id = ? AND is_active = 1");
            $stmt->execute([$gameId]);
            $rows = $stmt->fetchAll();

            // Build structured price objects
            $result = [
                'division_prices'  => [],
                'win_boost'        => [],
                'placement'        => [],
                'arena'            => [],
                'mastery'          => [],
                'arena_lp_config'  => [],
                'options'          => [],
                'lp_gain'          => [],
                'restriction_per_game' => 1.99,
                'battle_pass_per_level' => 1.50,
            ];

            foreach ($rows as $row) {
                $opts = json_decode($row['options_json'] ?? '{}', true) ?: [];
                $type_key = $opts['type'] ?? '';
                $rank = $opts['rank'] ?? '';

                if ($type_key === 'division_prices') {
                    $result['division_prices'][$rank] = $opts['div_prices'];
                } elseif ($type_key === 'win_boost') {
                    $result['win_boost'][$rank] = (float)$row['base_price'];
                } elseif ($type_key === 'placement') {
                    $result['placement'][$rank] = (float)$row['base_price'];
                } elseif ($type_key === 'arena') {
                    $result['arena'][$rank] = (float)$row['base_price'];
                    $result['arena_lp_config'][$rank] = [
                        'min' => (int)($opts['lp_min'] ?? 0),
                        'max' => (int)($opts['lp_max'] ?? 0),
                        'default' => (int)($opts['lp_min'] ?? 0),
                    ];
                } elseif ($type_key === 'mastery') {
                    $from = (int)($opts['from'] ?? 0);
                    $result['mastery'][$from] = (float)$row['base_price'];
                } elseif ($type_key === 'option') {
                    $result['options'][$opts['key'] ?? ''] = (float)$row['base_price'] / 100;
                } elseif ($type_key === 'lp_gain') {
                    $result['lp_gain'][$opts['key'] ?? ''] = (float)$row['base_price'] / 100;
                } elseif ($type_key === 'restriction_removal') {
                    $result['restriction_per_game'] = (float)$row['base_price'];
                } elseif ($type_key === 'battle_pass') {
                    $result['battle_pass_per_level'] = (float)$row['base_price'];
                }
            }
            echo json_encode(['success' => true, 'data' => $result]);
            break;

        case 'coaching':
            $gameRow = $pdo->prepare("SELECT id FROM games WHERE slug = ?");
            $gameRow->execute([$game]);
            $gameId = $gameRow->fetchColumn() ?: 1;

            $stmt = $pdo->prepare("SELECT * FROM coaching_services WHERE game_id = ? AND is_active = 1 ORDER BY id ASC");
            $stmt->execute([$gameId]);
            $rows = $stmt->fetchAll();

            $services = array_map(function($s) {
                $s['specializations'] = json_decode($s['specializations_json'] ?? '{}', true) ?: [];
                return $s;
            }, $rows);

            echo json_encode(['success' => true, 'data' => $services]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Unknown type']);
    }

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}