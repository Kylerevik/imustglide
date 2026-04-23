<?php
/**
 * Login API Endpoint
 * POST /api/login.php
 */

require_once '../config/database.php';

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validation
if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

try {
    // Find user by email
    $stmt = $pdo->prepare("
        SELECT id, email, password_hash, role, first_name, last_name,
               preferred_language, preferred_currency, currency_symbol, avatar_initial,
               store_credits_balance
        FROM users 
        WHERE email = ? AND is_active = 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Verify password
    if ($user && password_verify($password, $user['password_hash'])) {
        // Update last login
        $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];
        $_SESSION['preferred_language'] = $user['preferred_language'];
        $_SESSION['preferred_currency'] = $user['preferred_currency'];
        $_SESSION['currency_symbol'] = $user['currency_symbol'];
        $_SESSION['avatar_initial'] = $user['avatar_initial'];
        $_SESSION['store_credits_balance'] = $user['store_credits_balance'];
        $_SESSION['logged_in'] = true;
        
        // Success response
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'avatar_initial' => $user['avatar_initial'],
                'preferred_language' => $user['preferred_language'],
                'preferred_currency' => $user['preferred_currency'],
                'currency_symbol' => $user['currency_symbol'],
                'store_credits_balance' => (float)$user['store_credits_balance']
            ]
        ]);
        exit; // IMPORTANT: Stop execution after successful response
    } else {
        // Invalid credentials
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
        exit; // IMPORTANT: Stop execution after error response
    }
} catch(PDOException $e) {
    // Log error
    error_log("Login error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error'
    ]);
}
?>