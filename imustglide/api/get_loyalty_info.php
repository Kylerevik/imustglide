<?php
/**
 * Get Loyalty Info API Endpoint
 * GET /api/get_loyalty_info.php
 */

require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user_id'];

// Rank rendszer definíció
$rankSystem = [
    ['name' => 'Starter',     'min_xp' => 0,      'cashback' => 0,  'discount' => 0,  'perks' => ''],
    ['name' => 'Recruit',     'min_xp' => 200,     'cashback' => 1,  'discount' => 0,  'perks' => 'Priority Support'],
    ['name' => 'Guardian',    'min_xp' => 1000,    'cashback' => 2,  'discount' => 2,  'perks' => 'Priority Support, Early Access'],
    ['name' => 'Noble',       'min_xp' => 2500,    'cashback' => 3,  'discount' => 3,  'perks' => 'Priority Support, Early Access, Free Boost'],
    ['name' => 'Star Member', 'min_xp' => 5000,    'cashback' => 5,  'discount' => 5,  'perks' => 'VIP Support, Early Access, Free Boost'],
    ['name' => 'Diamond',     'min_xp' => 10000,   'cashback' => 7,  'discount' => 7,  'perks' => 'VIP Support, Early Access, Free Boost, Custom Badge'],
    ['name' => 'Champion',    'min_xp' => 20000,   'cashback' => 10, 'discount' => 10, 'perks' => 'VIP Support, Early Access, Free Boost, Custom Badge, Exclusive Items'],
    ['name' => 'Legend',      'min_xp' => 50000,   'cashback' => 12, 'discount' => 12, 'perks' => 'All Champion perks, Personal Manager'],
    ['name' => 'Eternal',     'min_xp' => 100000,  'cashback' => 15, 'discount' => 15, 'perks' => 'All Legend perks, Lifetime VIP'],
];

try {
    $stmt = $pdo->prepare("SELECT loot_points, total_spent FROM users WHERE id = ? AND is_active = 1");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // XP = total_spent * 100 (minden elköltött euro 100 XP)
    $xp = (int)($user['total_spent'] * 100);

    // Rank meghatározása
    $currentRank = $rankSystem[0];
    foreach ($rankSystem as $rank) {
        if ($xp >= $rank['min_xp']) {
            $currentRank = $rank;
        }
    }

    echo json_encode([
        'success'          => true,
        'rank'             => $currentRank['name'],
        'xp'               => $xp,
        'cashback_percent' => $currentRank['cashback'],
        'discount_percent' => $currentRank['discount'],
        'perks'            => $currentRank['perks'],
        'achievements'     => [], // Coming soon
    ]);

} catch (PDOException $e) {
    error_log('get_loyalty_info error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>
