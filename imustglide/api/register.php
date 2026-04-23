<?php
/**
 * MINIMAL REGISTER - Debug verzió
 * Csak 1 válasz, semmi más!
 */

// Disable output buffering
ob_end_clean();

require_once '../config/database.php';

// Clear any previous output
ob_clean();
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

// Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    die();
}

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Validate
if (empty($email) || empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    die();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    die();
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    die();
}

if (strlen($username) < 3 || strlen($username) > 50) {
    echo json_encode(['success' => false, 'message' => 'Username must be between 3-50 characters']);
    die();
}

// Check email exists
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        // Email exists - RETURN AND STOP
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        die();
    }
    
    // Insert user
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $avatarInitial = strtoupper(substr($username, 0, 1));
    
    $stmt = $pdo->prepare("
        INSERT INTO users (
            email, password_hash, first_name, role, avatar_initial,
            preferred_language, preferred_currency, currency_symbol,
            store_credits_balance, is_active
        ) VALUES (?, ?, ?, 'customer', ?, 'EN', 'EUR', '€', 0.00, 1)
    ");
    
    $stmt->execute([$email, $passwordHash, $username, $avatarInitial]);
    
    // Success - RETURN AND STOP
    echo json_encode(['success' => true, 'message' => 'Registration successful! You can now login.']);
    die();
    
} catch(PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        die();
    }
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
    die();
}

// This should NEVER execute
die();
?>