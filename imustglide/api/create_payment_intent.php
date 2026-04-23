<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

define('STRIPE_SECRET_KEY', 'sk_test_51TOpkAFUWwbZNdt2bTNTMAGLmXkrpbPl2RhvqXfWbNqs3OEdQi79eKrLBuMf1lZDM68dAyscEfNd7Jpd39jljw2K00BtMNYS0a');

$input    = json_decode(file_get_contents('php://input'), true);
$amount   = isset($input['amount']) ? (int)round((float)$input['amount'] * 100) : 0;
$currency = strtolower($input['currency'] ?? 'eur');
$email    = $input['email'] ?? '';

if ($amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid amount: ' . $amount]);
    exit;
}

if (!function_exists('curl_init')) {
    echo json_encode(['success' => false, 'message' => 'cURL not available']);
    exit;
}

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_USERPWD        => STRIPE_SECRET_KEY . ':',
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_POSTFIELDS     => http_build_query([
        'amount'   => $amount,
        'currency' => $currency,
        'automatic_payment_methods[enabled]' => 'true',
        'receipt_email' => $email,
    ]),
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_TIMEOUT        => 30,
]);

$response   = curl_exec($ch);
$curlError  = curl_error($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $curlError) {
    echo json_encode(['success' => false, 'message' => 'cURL error: ' . $curlError]);
    exit;
}

$stripe = json_decode($response, true);

if ($httpStatus !== 200 || empty($stripe['client_secret'])) {
    $msg = $stripe['error']['message'] ?? 'Stripe error (HTTP ' . $httpStatus . ')';
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}

echo json_encode([
    'success'            => true,
    'client_secret'      => $stripe['client_secret'],
    'payment_intent_id'  => $stripe['id'],
]);