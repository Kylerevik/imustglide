<?php
/**
 * Database Connection Configuration
 * iMUSTGLIDE Gaming Platform
 */

// Database credentials (MAMP)
$host = 'localhost';
$dbname = 'imustglide';
$username = 'root';
$password = 'root';

try {
    // Create PDO connection
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch(PDOException $e) {
    // Log error
    error_log("Database connection error: " . $e->getMessage());
    
    // Return JSON error response
    header('Content-Type: application/json');
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]));
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
