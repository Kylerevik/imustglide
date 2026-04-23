<?php
/**
 * Logout API Endpoint
 * POST /api/logout.php
 */

session_start();

header('Content-Type: application/json');

// Clear all session variables
$_SESSION = array();

// Delete session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Destroy session
session_destroy();

// JSON response
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);

// If not AJAX request, redirect to index
if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
    header('Location: ../index.html');
    exit;
}
?>
