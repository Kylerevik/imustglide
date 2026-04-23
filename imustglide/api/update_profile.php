<?php
/**
 * Update Profile API Endpoint
 * POST /api/update_profile.php
 */

require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$userId = $_SESSION['user_id'];
$input  = json_decode(file_get_contents('php://input'), true);

$type = $input['type'] ?? 'profile'; // 'profile' vagy 'password'

try {
    if ($type === 'password') {
        // Jelszó változtatás
        $currentPassword = $input['current_password'] ?? '';
        $newPassword     = $input['new_password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';

        if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
            echo json_encode(['success' => false, 'message' => 'All password fields are required']);
            exit;
        }

        if (strlen($newPassword) < 6) {
            echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
            exit;
        }

        if ($newPassword !== $confirmPassword) {
            echo json_encode(['success' => false, 'message' => 'New passwords do not match']);
            exit;
        }

        // Jelenlegi jelszó ellenőrzése
        $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit;
        }

        // Jelszó frissítése
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $updateStmt->execute([$newHash, $userId]);

        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);

    } else {
        // Profil adatok frissítése
        $firstName       = trim($input['first_name'] ?? '');
        $lastName        = trim($input['last_name'] ?? '');
        $phone           = trim($input['phone'] ?? '');
        $country         = trim($input['country'] ?? '');
        $discordUsername = trim($input['discord_username'] ?? '');
        $preferredLang   = $input['preferred_language'] ?? 'EN';
        $preferredCurr   = $input['preferred_currency'] ?? 'EUR';

        if (empty($firstName)) {
            echo json_encode(['success' => false, 'message' => 'First name is required']);
            exit;
        }

        // Currency symbol meghatározása
        $currencySymbols = [
            'EUR' => '€', 'USD' => '$', 'GBP' => '£',
            'CAD' => '$', 'AUD' => '$', 'PLN' => 'zł', 'CHF' => 'Fr'
        ];
        $currencySymbol = $currencySymbols[$preferredCurr] ?? '€';

        // Avatar initial frissítése
        $avatarInitial = strtoupper(substr($firstName, 0, 1));

        $updateStmt = $pdo->prepare("
            UPDATE users SET
                first_name         = ?,
                last_name          = ?,
                phone              = ?,
                country            = ?,
                discord_username   = ?,
                preferred_language = ?,
                preferred_currency = ?,
                currency_symbol    = ?,
                avatar_initial     = ?
            WHERE id = ?
        ");
        $updateStmt->execute([
            $firstName, $lastName, $phone, $country, $discordUsername,
            $preferredLang, $preferredCurr, $currencySymbol, $avatarInitial,
            $userId
        ]);

        // Session frissítése
        $_SESSION['first_name']         = $firstName;
        $_SESSION['last_name']          = $lastName;
        $_SESSION['avatar_initial']     = $avatarInitial;
        $_SESSION['preferred_language'] = $preferredLang;
        $_SESSION['preferred_currency'] = $preferredCurr;
        $_SESSION['currency_symbol']    = $currencySymbol;

        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user'    => [
                'first_name'       => $firstName,
                'last_name'        => $lastName,
                'avatar_initial'   => $avatarInitial,
                'preferred_language'  => $preferredLang,
                'preferred_currency'  => $preferredCurr,
                'currency_symbol'     => $currencySymbol,
            ]
        ]);
    }

} catch (PDOException $e) {
    error_log('update_profile error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>
