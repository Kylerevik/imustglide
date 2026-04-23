<?php
/**
 * Check Session API Endpoint
 * GET /api/check_session.php
 */

// Try to find database.php in different locations
$possible_paths = [
    '../config/database.php',
    '../database.php',
    '../../config/database.php',
    '../../database.php',
    dirname(__DIR__) . '/config/database.php',
    dirname(__DIR__) . '/database.php'
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
    header('Content-Type: application/json');
    http_response_code(500);
    die(json_encode([
        'logged_in' => false,
        'error' => 'Database connection file not found'
    ]));
}

header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_id'])) {
    try {
        // Get fresh data from database
        $stmt = $pdo->prepare("
            SELECT first_name, last_name, role, email,
                   preferred_language, preferred_currency, currency_symbol, 
                   avatar_initial, store_credits_balance
            FROM users 
            WHERE id = ? AND is_active = 1
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Update session with fresh data
            $_SESSION['first_name'] = $user['first_name'];
            $_SESSION['last_name'] = $user['last_name'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['store_credits_balance'] = $user['store_credits_balance'];
            
            // Return logged in status with user data
            echo json_encode([
                'logged_in' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'avatar_initial' => $user['avatar_initial'],
                    'preferred_language' => $user['preferred_language'] ?? 'EN',
                    'preferred_currency' => $user['preferred_currency'] ?? 'EUR',
                    'currency_symbol' => $user['currency_symbol'] ?? '€',
                    'store_credits_balance' => (float)($user['store_credits_balance'] ?? 0.00)
                ]
            ]);
        } else {
            // User not found or inactive - log out
            session_destroy();
            echo json_encode(['logged_in' => false]);
        }
    } catch(PDOException $e) {
        // Log error
        error_log("Check session error: " . $e->getMessage());
        
        // On error, use session data
        echo json_encode([
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'email' => $_SESSION['email'] ?? '',
                'role' => $_SESSION['role'] ?? 'customer',
                'first_name' => $_SESSION['first_name'] ?? '',
                'last_name' => $_SESSION['last_name'] ?? '',
                'avatar_initial' => $_SESSION['avatar_initial'] ?? '',
                'preferred_language' => $_SESSION['preferred_language'] ?? 'EN',
                'preferred_currency' => $_SESSION['preferred_currency'] ?? 'EUR',
                'currency_symbol' => $_SESSION['currency_symbol'] ?? '€',
                'store_credits_balance' => (float)($_SESSION['store_credits_balance'] ?? 0.00)
            ]
        ]);
    }
} else {
    // Not logged in
    echo json_encode(['logged_in' => false]);
}
?>
