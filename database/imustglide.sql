-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 23, 2026 at 01:43 PM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imustglide`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) NOT NULL,
  `level` int DEFAULT NULL,
  `region` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leveling_type` enum('botted','handleveled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rank_tier` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blue_essence` int DEFAULT NULL,
  `orange_essence` int DEFAULT NULL,
  `skin_count` int DEFAULT '0',
  `champion_count` int DEFAULT '0',
  `server` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_percentage` int DEFAULT '0',
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `rank_image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('available','sold','reserved') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `has_unverified_email` tinyint(1) DEFAULT '0',
  `has_lifetime_warranty` tinyint(1) DEFAULT '0',
  `instant_delivery` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `game_id`, `title`, `description`, `base_price`, `level`, `region`, `leveling_type`, `rank_tier`, `blue_essence`, `orange_essence`, `skin_count`, `champion_count`, `server`, `discount_percentage`, `discounted_price`, `rank_image_path`, `features_json`, `status`, `has_unverified_email`, `has_lifetime_warranty`, `instant_delivery`, `created_at`, `updated_at`) VALUES
(1, 1, 'Handleveled', 'Fresh MMR, perfect for ranked', 37.49, 30, 'EUW', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUW', 0, NULL, 'pics/handleveled.png', '[\"40.000+ BE\",\"Fresh MMR\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(2, 1, 'Premium', '2.300 MMR Fresh account', 46.99, 30, 'EUW', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUW', 0, NULL, 'pics/handleveledpremium.png', '[\"40.000+ BE\",\"2.300 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(3, 1, 'Pro', '2.400 MMR Fresh account', 65.99, 30, 'EUW', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUW', 0, NULL, 'pics/handleveledpro.png', '[\"40.000+ BE\",\"2.400 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(4, 1, 'Ultra', '2.600 MMR Fresh account', 87.50, 30, 'EUW', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUW', 0, NULL, 'pics/handleveledultra.png', '[\"40.000+ BE\",\"2.600 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(5, 1, 'Botted', 'Fresh Unranked, budget option', 7.99, 30, 'EUW', 'botted', 'Unranked', 50000, NULL, 0, 0, 'EUW', 0, NULL, 'pics/botted.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"EUW\",\"14 Days Warranty\"]', 'available', 1, 0, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(6, 1, 'Handleveled', 'Fresh MMR, perfect for ranked', 37.49, 30, 'EUNE', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUNE', 0, NULL, 'pics/handleveled.png', '[\"40.000+ BE\",\"Fresh MMR\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(7, 1, 'Premium', '2.300 MMR Fresh account', 46.99, 30, 'EUNE', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUNE', 0, NULL, 'pics/handleveledpremium.png', '[\"40.000+ BE\",\"2.300 MMR Fresh\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(8, 1, 'Ultra', '2.600 MMR Fresh account', 87.50, 30, 'EUNE', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'EUNE', 0, NULL, 'pics/handleveledultra.png', '[\"40.000+ BE\",\"2.600 MMR Fresh\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(9, 1, 'Botted', 'Fresh Unranked, budget option', 7.99, 30, 'EUNE', 'botted', 'Unranked', 50000, NULL, 0, 0, 'EUNE', 0, NULL, 'pics/botted.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"EUNE\",\"14 Days Warranty\"]', 'available', 1, 0, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(10, 1, 'Handleveled', 'Fresh MMR, perfect for ranked', 37.49, 30, 'NA', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'NA', 0, NULL, 'pics/handleveled.png', '[\"40.000+ BE\",\"Fresh MMR\",\"NA\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(11, 1, 'Premium', '2.300 MMR Fresh account', 46.99, 30, 'NA', 'handleveled', 'Unranked', 40000, NULL, 0, 0, 'NA', 0, NULL, 'pics/handleveledpremium.png', '[\"40.000+ BE\",\"2.300 MMR Fresh\",\"NA\",\"Lifetime Warranty\",\"Unverified\"]', 'available', 1, 1, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53'),
(12, 1, 'Botted', 'Fresh Unranked, budget option', 7.99, 30, 'NA', 'botted', 'Unranked', 50000, NULL, 0, 0, 'NA', 0, NULL, 'pics/botted.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"NA\",\"14 Days Warranty\"]', 'available', 1, 0, 1, '2026-04-22 14:39:53', '2026-04-22 14:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `account_inventory`
--

CREATE TABLE `account_inventory` (
  `id` int NOT NULL,
  `type_id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('available','sold','reserved') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sold_at` timestamp NULL DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_types`
--

CREATE TABLE `account_types` (
  `id` int NOT NULL,
  `game_id` int NOT NULL DEFAULT '1',
  `server` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `blue_essence` int DEFAULT '40000',
  `icon_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pics/handleveled.png',
  `features_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_skin_account` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_types`
--

INSERT INTO `account_types` (`id`, `game_id`, `server`, `title`, `description`, `price`, `discounted_price`, `blue_essence`, `icon_path`, `features_json`, `is_skin_account`, `is_active`, `display_order`, `created_at`) VALUES
(1, 1, 'EUW', 'Handleveled', 'Fresh MMR, perfect for ranked', 37.49, NULL, 40000, 'pics/handleveled.png', '[\"40.000+ BE\",\"Fresh Unranked\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(2, 1, 'EUW', 'Handleveled Premium', '2.300 MMR Fresh account', 46.99, NULL, 40000, 'pics/handleveledpremium.png', '[\"40.000+ BE\",\"2.300 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(3, 1, 'EUW', 'Handleveled Pro', '2.400 MMR Fresh account', 65.99, NULL, 40000, 'pics/handleveledpro.png', '[\"40.000+ BE\",\"2.400 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(4, 1, 'EUW', 'Handleveled Ultra', '2.600 MMR Fresh account', 87.50, NULL, 40000, 'pics/handleveledultra.png', '[\"40.000+ BE\",\"2.600 MMR Fresh\",\"EUW\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 4, '2026-04-22 14:50:35'),
(5, 1, 'EUW', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"EUW\",\"14 Days Warranty\"]', 1, 1, 5, '2026-04-22 14:50:35'),
(6, 1, 'EUNE', 'Handleveled', 'Fresh MMR, perfect for ranked', 37.49, NULL, 40000, 'pics/handleveled.png', '[\"40.000+ BE\",\"Fresh Unranked\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(7, 1, 'EUNE', 'Handleveled Premium', '2.300 MMR Fresh account', 46.99, NULL, 40000, 'pics/handleveledpremium.png', '[\"40.000+ BE\",\"2.300 MMR Fresh\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(8, 1, 'EUNE', 'Handleveled Ultra', '2.600 MMR Fresh account', 87.50, NULL, 40000, 'pics/handleveledultra.png', '[\"40.000+ BE\",\"2.600 MMR Fresh\",\"EUNE\",\"Lifetime Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(9, 1, 'EUNE', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"EUNE\",\"14 Days Warranty\"]', 1, 1, 4, '2026-04-22 14:50:35'),
(10, 1, 'NA', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"NA\",\"14 Days Warranty\"]', 1, 1, 1, '2026-04-22 14:50:35'),
(11, 1, 'OCE', 'Standard', 'Fresh Unranked account', 9.99, NULL, 50000, 'pics/standard.png', '[\"50.000+ BE\",\"Fresh Unranked\",\"OCE\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(12, 1, 'OCE', 'Advanced', 'More BE, better value', 11.45, NULL, 60000, 'pics/advanced.png', '[\"60.000+ BE\",\"Fresh Unranked\",\"OCE\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(13, 1, 'OCE', 'Iron IV', 'Ranked Iron IV account', 41.99, NULL, 40000, 'pics/iron4.png', '[\"40.000+ BE\",\"Iron IV\",\"OCE\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(14, 1, 'OCE', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"OCE\",\"14 Days Warranty\"]', 1, 1, 4, '2026-04-22 14:50:35'),
(15, 1, 'LAN', 'Standard', 'Fresh Unranked account', 7.95, NULL, 50000, 'pics/standard.png', '[\"50.000+ BE\",\"Fresh Unranked\",\"LAN\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(16, 1, 'LAN', 'Advanced', 'More BE, better value', 9.45, NULL, 60000, 'pics/advanced.png', '[\"60.000+ BE\",\"Fresh Unranked\",\"LAN\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(17, 1, 'LAN', 'Premium', '2.300 MMR Fresh account', 14.99, NULL, 70000, 'pics/handleveledpremium.png', '[\"70.000+ BE\",\"Fresh Unranked\",\"LAN\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(18, 1, 'LAN', 'Ultimate', 'Max BE account', 22.49, NULL, 100000, 'pics/ultimate.png', '[\"100.000+ BE\",\"Fresh Unranked\",\"LAN\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 4, '2026-04-22 14:50:35'),
(19, 1, 'LAN', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"LAN\",\"14 Days Warranty\"]', 1, 1, 5, '2026-04-22 14:50:35'),
(20, 1, 'LAS', 'Standard', 'Fresh Unranked account', 7.95, NULL, 50000, 'pics/standard.png', '[\"50.000+ BE\",\"Fresh Unranked\",\"LAS\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(21, 1, 'LAS', 'Advanced', 'More BE, better value', 9.45, NULL, 60000, 'pics/advanced.png', '[\"60.000+ BE\",\"Fresh Unranked\",\"LAS\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(22, 1, 'LAS', 'Premium', '2.300 MMR Fresh account', 14.99, NULL, 70000, 'pics/handleveledpremium.png', '[\"70.000+ BE\",\"Fresh Unranked\",\"LAS\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(23, 1, 'LAS', 'Pro', '2.400 MMR Fresh account', 22.49, NULL, 100000, 'pics/handleveledpro.png', '[\"100.000+ BE\",\"Fresh Unranked\",\"LAS\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 4, '2026-04-22 14:50:35'),
(24, 1, 'LAS', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"LAS\",\"14 Days Warranty\"]', 1, 1, 5, '2026-04-22 14:50:35'),
(25, 1, 'BR', 'Premium', '2.300 MMR Fresh account', 14.99, NULL, 70000, 'pics/handleveledpremium.png', '[\"70.000+ BE\",\"Fresh Unranked\",\"BR\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(26, 1, 'BR', 'Pro', '2.400 MMR Fresh account', 19.49, NULL, 100000, 'pics/handleveledpro.png', '[\"100.000+ BE\",\"Fresh Unranked\",\"BR\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(27, 1, 'BR', 'VIP', 'Max BE VIP account', 27.49, NULL, 50000, 'pics/VIP.png', '[\"150.000+ BE\",\"Fresh Unranked\",\"BR\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(28, 1, 'BR', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"BR\",\"14 Days Warranty\"]', 1, 1, 4, '2026-04-22 14:50:35'),
(29, 1, 'TR', 'Ultimate', 'Max BE account', 19.45, NULL, 100000, 'pics/ultimate.png', '[\"100.000+ BE\",\"Fresh Unranked\",\"TR\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(30, 1, 'TR', 'VIP', 'Max BE VIP account', 27.49, NULL, 50000, 'pics/VIP.png', '[\"150.000+ BE\",\"Fresh Unranked\",\"TR\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(31, 1, 'TR', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"TR\",\"14 Days Warranty\"]', 1, 1, 3, '2026-04-22 14:50:35'),
(32, 1, 'RU', 'Standard', 'Fresh Unranked account', 7.95, NULL, 50000, 'pics/standard.png', '[\"50.000+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 1, '2026-04-22 14:50:35'),
(33, 1, 'RU', 'Advanced', 'More BE, better value', 9.45, NULL, 60000, 'pics/advanced.png', '[\"60.000+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 2, '2026-04-22 14:50:35'),
(34, 1, 'RU', 'Premium', '2.300 MMR Fresh account', 14.99, NULL, 70000, 'pics/handleveledpremium.png', '[\"70.000+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 3, '2026-04-22 14:50:35'),
(35, 1, 'RU', 'Ultimate', 'Max BE account', 22.49, NULL, 100000, 'pics/ultimate.png', '[\"100.000+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 4, '2026-04-22 14:50:35'),
(36, 1, 'RU', 'VIP', 'Max BE VIP account', 27.49, NULL, 50000, 'pics/VIP.png', '[\"150.000+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\",\"Unverified\"]', 0, 1, 5, '2026-04-22 14:50:35'),
(37, 1, 'RU', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"RU\",\"14 Days Warranty\"]', 1, 1, 6, '2026-04-22 14:50:35'),
(38, 1, 'MENA', 'Skin Account', 'Fresh Unranked with skins', 7.99, NULL, 50000, 'pics/lolskinaccounts.png', '[\"30-200k+ BE\",\"Fresh Unranked\",\"MENA\",\"14 Days Warranty\"]', 1, 1, 1, '2026-04-22 14:50:35');

-- --------------------------------------------------------

--
-- Table structure for table `boosting_services`
--

CREATE TABLE `boosting_services` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `service_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) NOT NULL,
  `options_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `boosting_services`
--

INSERT INTO `boosting_services` (`id`, `game_id`, `service_name`, `description`, `base_price`, `options_json`, `is_active`, `created_at`) VALUES
(1, 1, 'rank_boost_iron_div', 'Iron division price per division', 5.95, '{\"rank\":\"iron\",     \"type\":\"division_prices\",\"div_prices\":[5.95,5.95,5.95,7.46]}', 1, '2026-04-22 14:39:53'),
(2, 1, 'rank_boost_bronze_div', 'Bronze division price per division', 7.46, '{\"rank\":\"bronze\",   \"type\":\"division_prices\",\"div_prices\":[7.46,7.46,7.46,7.72]}', 1, '2026-04-22 14:39:53'),
(3, 1, 'rank_boost_silver_div', 'Silver division price per division', 7.72, '{\"rank\":\"silver\",   \"type\":\"division_prices\",\"div_prices\":[7.72,7.72,7.72,12.96]}', 1, '2026-04-22 14:39:53'),
(4, 1, 'rank_boost_gold_div', 'Gold division price per division', 9.83, '{\"rank\":\"gold\",     \"type\":\"division_prices\",\"div_prices\":[12.96,9.83,16.18,22.64]}', 1, '2026-04-22 14:39:53'),
(5, 1, 'rank_boost_platinum_div', 'Platinum division price per division', 17.78, '{\"rank\":\"platinum\", \"type\":\"division_prices\",\"div_prices\":[17.78,17.78,17.78,35.00]}', 1, '2026-04-22 14:39:53'),
(6, 1, 'rank_boost_emerald_div', 'Emerald division price per division', 35.00, '{\"rank\":\"emerald\",  \"type\":\"division_prices\",\"div_prices\":[35.00,35.00,35.00,78.06]}', 1, '2026-04-22 14:39:53'),
(7, 1, 'rank_boost_diamond_div', 'Diamond division price per division', 78.06, '{\"rank\":\"diamond\",  \"type\":\"division_prices\",\"div_prices\":[78.06,78.06,78.06,0]}', 1, '2026-04-22 14:39:53'),
(8, 1, 'win_boost_iron', 'Iron win boost price per win', 2.36, '{\"rank\":\"iron\",        \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(9, 1, 'win_boost_bronze', 'Bronze win boost price per win', 2.50, '{\"rank\":\"bronze\",      \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(10, 1, 'win_boost_silver', 'Silver win boost price per win', 2.63, '{\"rank\":\"silver\",      \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(11, 1, 'win_boost_gold', 'Gold win boost price per win', 3.68, '{\"rank\":\"gold\",        \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(12, 1, 'win_boost_platinum', 'Platinum win boost price per win', 6.46, '{\"rank\":\"platinum\",    \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(13, 1, 'win_boost_emerald', 'Emerald win boost price per win', 7.91, '{\"rank\":\"emerald\",     \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(14, 1, 'win_boost_diamond', 'Diamond win boost price per win', 8.96, '{\"rank\":\"diamond\",     \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(15, 1, 'win_boost_master', 'Master win boost price per win', 38.87, '{\"rank\":\"master\",      \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(16, 1, 'win_boost_grandmaster', 'Grandmaster win boost price per win', 48.23, '{\"rank\":\"grandmaster\", \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(17, 1, 'win_boost_challenger', 'Challenger win boost price per win', 58.16, '{\"rank\":\"challenger\",  \"type\":\"win_boost\"}', 1, '2026-04-22 14:39:53'),
(18, 1, 'placement_iron', 'Iron placement price per game', 1.91, '{\"rank\":\"iron\",        \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(19, 1, 'placement_bronze', 'Bronze placement price per game', 2.10, '{\"rank\":\"bronze\",      \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(20, 1, 'placement_silver', 'Silver placement price per game', 2.39, '{\"rank\":\"silver\",      \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(21, 1, 'placement_gold', 'Gold placement price per game', 3.54, '{\"rank\":\"gold\",        \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(22, 1, 'placement_platinum', 'Platinum placement price per game', 4.79, '{\"rank\":\"platinum\",    \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(23, 1, 'placement_emerald', 'Emerald placement price per game', 5.27, '{\"rank\":\"emerald\",     \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(24, 1, 'placement_diamond', 'Diamond placement price per game', 7.67, '{\"rank\":\"diamond\",     \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(25, 1, 'placement_master', 'Master placement price per game', 9.59, '{\"rank\":\"master\",      \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(26, 1, 'placement_grandmaster', 'Grandmaster placement price per game', 9.59, '{\"rank\":\"grandmaster\", \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(27, 1, 'placement_challenger', 'Challenger placement price per game', 12.47, '{\"rank\":\"challenger\",  \"type\":\"placement\"}', 1, '2026-04-22 14:39:53'),
(28, 1, 'arena_wood', 'Arena wood price per win', 2.99, '{\"rank\":\"wood\",      \"type\":\"arena\",\"lp_min\":0,   \"lp_max\":1399}', 1, '2026-04-22 14:39:53'),
(29, 1, 'arena_bronze', 'Arena bronze price per win', 3.99, '{\"rank\":\"bronze\",    \"type\":\"arena\",\"lp_min\":1400,\"lp_max\":2599}', 1, '2026-04-22 14:39:53'),
(30, 1, 'arena_silver', 'Arena silver price per win', 5.99, '{\"rank\":\"silver\",    \"type\":\"arena\",\"lp_min\":2600,\"lp_max\":3199}', 1, '2026-04-22 14:39:53'),
(31, 1, 'arena_gold', 'Arena gold price per win', 9.99, '{\"rank\":\"gold\",      \"type\":\"arena\",\"lp_min\":3200,\"lp_max\":3799}', 1, '2026-04-22 14:39:53'),
(32, 1, 'arena_gladiator', 'Arena gladiator price per win', 15.99, '{\"rank\":\"gladiator\", \"type\":\"arena\",\"lp_min\":3800,\"lp_max\":4400}', 1, '2026-04-22 14:39:53'),
(33, 1, 'mastery_1_to_2', 'Mastery 1→2 price', 8.22, '{\"from\":1,\"to\":2,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(34, 1, 'mastery_2_to_3', 'Mastery 2→3 price', 13.08, '{\"from\":2,\"to\":3,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(35, 1, 'mastery_3_to_4', 'Mastery 3→4 price', 15.09, '{\"from\":3,\"to\":4,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(36, 1, 'mastery_4_to_5', 'Mastery 4→5 price', 15.73, '{\"from\":4,\"to\":5,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(37, 1, 'mastery_5_to_6', 'Mastery 5→6 price', 18.04, '{\"from\":5,\"to\":6,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(38, 1, 'mastery_6_to_7', 'Mastery 6→7 price', 20.52, '{\"from\":6,\"to\":7,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(39, 1, 'mastery_7_to_8', 'Mastery 7→8 price', 22.85, '{\"from\":7,\"to\":8,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(40, 1, 'mastery_8_to_9', 'Mastery 8→9 price', 25.21, '{\"from\":8,\"to\":9,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(41, 1, 'mastery_9_to_10', 'Mastery 9→10 price', 26.43, '{\"from\":9,\"to\":10,\"type\":\"mastery\"}', 1, '2026-04-22 14:39:53'),
(42, 1, 'restriction_removal', 'Normal game restriction removal price per game', 1.99, '{\"type\":\"restriction_removal\"}', 1, '2026-04-22 14:39:53'),
(43, 1, 'battle_pass', 'Battle pass boost price per level', 1.50, '{\"type\":\"battle_pass\"}', 1, '2026-04-22 14:39:53'),
(44, 1, 'option_priority', 'Priority queue extra %', 20.00, '{\"type\":\"option\",\"key\":\"priority\"}', 1, '2026-04-22 14:39:53'),
(45, 1, 'option_solo_only', 'Solo only queue extra %', 10.00, '{\"type\":\"option\",\"key\":\"soloQueue\"}', 1, '2026-04-22 14:39:53'),
(46, 1, 'option_stream', 'Stream games extra %', 15.00, '{\"type\":\"option\",\"key\":\"stream\"}', 1, '2026-04-22 14:39:53'),
(47, 1, 'option_with_booster', 'Play with booster extra %', 20.00, '{\"type\":\"option\",\"key\":\"booster\"}', 1, '2026-04-22 14:39:53'),
(48, 1, 'lp_gain_high', 'High LP gain discount %', 10.00, '{\"type\":\"lp_gain\",\"key\":\"high\"}', 1, '2026-04-22 14:39:53'),
(49, 1, 'lp_gain_normal', 'Normal LP gain (no change)', 0.00, '{\"type\":\"lp_gain\",\"key\":\"normal\"}', 1, '2026-04-22 14:39:53'),
(50, 1, 'lp_gain_low', 'Low LP gain extra %', 15.00, '{\"type\":\"lp_gain\",\"key\":\"low\"}', 1, '2026-04-22 14:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `coaching_services`
--

CREATE TABLE `coaching_services` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `coach_id` int NOT NULL,
  `service_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `hourly_rate` decimal(10,2) NOT NULL,
  `specializations_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount_codes`
--

CREATE TABLE `discount_codes` (
  `id` int NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('percentage','fixed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `valid_from` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_until` timestamp NULL DEFAULT NULL,
  `max_uses` int DEFAULT '0',
  `times_used` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `source` enum('promotion','manual') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'manual',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discount_codes`
--

INSERT INTO `discount_codes` (`id`, `code`, `type`, `value`, `valid_from`, `valid_until`, `max_uses`, `times_used`, `is_active`, `source`, `description`, `created_at`) VALUES
(1, 'GLIDE20', 'percentage', 20.00, '2026-04-21 22:29:23', '2026-12-31 23:00:00', 1000, 1, 1, 'promotion', '20% discount for GLIDERS', '2026-04-21 22:29:23'),
(2, 'WELCOME10', 'percentage', 10.00, '2026-04-21 22:29:23', '2026-12-31 23:00:00', 1000, 1, 1, 'promotion', '10% welcome discount', '2026-04-21 22:29:23'),
(3, 'VIP15', 'percentage', 15.00, '2026-04-21 22:29:23', '2026-12-31 23:00:00', 500, 0, 1, 'manual', '15% VIP discount', '2026-04-21 22:29:23');

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int NOT NULL,
  `game_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_discount` tinyint(1) DEFAULT '0',
  `discount_percentage` int DEFAULT '0',
  `is_new` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `game_name`, `slug`, `icon_path`, `banner_path`, `has_discount`, `discount_percentage`, `is_new`, `is_active`, `display_order`, `created_at`) VALUES
(1, 'League of Legends', 'league-of-legends', 'pics/league-of-legends.png', 'pics/lol-banner.jpg', 0, 0, 0, 1, 1, '2026-04-22 14:39:53'),
(2, 'Rocket League', 'rocket-league', 'pics/rocket-league.png', 'pics/rl-banner.jpg', 0, 0, 0, 0, 2, '2026-04-22 14:39:53'),
(3, 'Clash Royale', 'clash-royale', 'pics/clash-royale.png', 'pics/cr-banner.jpg', 0, 0, 0, 0, 3, '2026-04-22 14:39:53'),
(4, 'Rainbow Six Siege', 'rainbow-six-siege', 'pics/rainbow-six-siege.png', 'pics/r6-banner.jpg', 0, 0, 0, 0, 4, '2026-04-22 14:39:53'),
(5, 'Fortnite', 'fortnite', 'pics/fortnite.png', 'pics/fn-banner.jpg', 0, 0, 0, 0, 5, '2026-04-22 14:39:53'),
(6, 'Valorant', 'valorant', 'pics/valorant.png', 'pics/val-banner.jpg', 0, 0, 0, 0, 6, '2026-04-22 14:39:53'),
(7, 'Counter-Strike 2', 'counter-strike-2', 'pics/counter-strike-2.png', 'pics/cs2-banner.jpg', 0, 0, 0, 0, 7, '2026-04-22 14:39:53'),
(8, 'Dota 2', 'dota-2', 'pics/dota-2.png', 'pics/dota2-banner.jpg', 0, 0, 0, 0, 8, '2026-04-22 14:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('order_update','credit_added','loot_points','discount_code','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `related_order_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency_symbol` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','paid','processing','completed','cancelled','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('stripe','paypal','store_credits') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'stripe',
  `payment_intent_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loot_points_earned` int NOT NULL DEFAULT '0',
  `processing_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `customer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_code_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `order_type` enum('account','boosting','coaching') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'account',
  `claimed_by` int DEFAULT NULL,
  `claimed_at` timestamp NULL DEFAULT NULL,
  `completed_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `subtotal`, `discount_amount`, `total_amount`, `currency`, `currency_symbol`, `status`, `payment_method`, `payment_intent_id`, `loot_points_earned`, `processing_fee`, `notes`, `customer_email`, `discount_code_id`, `created_at`, `completed_at`, `order_type`, `claimed_by`, `claimed_at`, `completed_by`) VALUES
(1, 25, 'ORD-2026-78D2C9', 37.49, 3.75, 34.72, 'EUR', '€', 'completed', 'stripe', 'pi_3TPMPpFUWwbZNdt210hGxko2', 3471, 0.98, NULL, 'nemtudom@gmail.com', 2, '2026-04-23 12:31:35', NULL, 'account', NULL, NULL, NULL),
(2, 25, 'ORD-2026-82F0DD', 992.89, 0.00, 1021.68, 'EUR', '€', 'completed', 'stripe', 'pi_3TPMQsFUWwbZNdt22DXSH5Eo', 102168, 28.79, NULL, 'nemtudom@gmail.com', NULL, '2026-04-23 12:32:40', '2026-04-23 12:36:16', 'boosting', 8, '2026-04-23 12:36:11', 8),
(3, 25, 'ORD-2026-44C959', 29.99, 0.00, 30.86, 'EUR', '€', 'processing', 'store_credits', 'credits_1776947604523', 3085, 0.87, NULL, 'nemtudom@gmail.com', NULL, '2026-04-23 12:33:24', NULL, 'coaching', 7, '2026-04-23 12:39:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `item_type` enum('account','boosting','coaching','item','currency','top_up') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` int NOT NULL,
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int DEFAULT '1',
  `options_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_type`, `item_id`, `item_name`, `price`, `quantity`, `options_json`, `created_at`) VALUES
(1, 1, 'account', 0, 'Handleveled LoL Smurf Account EUW', 37.49, 1, NULL, '2026-04-23 12:31:35'),
(2, 2, 'boosting', 0, 'LoL Rank Boost', 992.89, 1, '{\"detail\":\"Iron III \\u2192 Master 0 LP\"}', '2026-04-23 12:32:40'),
(3, 3, 'coaching', 0, 'Pro Coaching', 29.99, 1, '{\"detail\":\"asd#euw \\u00b7 EUW \\u00b7 1 hour \\u00b7 Roles: Adc\"}', '2026-04-23 12:33:24');

-- --------------------------------------------------------

--
-- Table structure for table `service_availability`
--

CREATE TABLE `service_availability` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `service_type` enum('accounts','boosting','items','pro_teammate','coaching','currencies','top_up') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `transaction_type` enum('purchase','refund','credit_add','credit_use') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `order_id`, `transaction_type`, `amount`, `description`, `created_at`) VALUES
(1, 25, 1, 'purchase', 34.72, 'Order ORD-2026-78D2C9', '2026-04-23 12:31:35'),
(2, 25, 2, 'purchase', 1021.68, 'Order ORD-2026-82F0DD', '2026-04-23 12:32:40'),
(3, 25, 3, 'credit_use', 30.86, 'Order ORD-2026-44C959', '2026-04-23 12:33:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('customer','booster','coach','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_language` enum('HU','EN','DE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'EN',
  `preferred_currency` enum('EUR','USD','GBP','CAD','AUD','PLN','CHF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `currency_symbol` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '€',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `avatar_initial` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_credits_balance` decimal(10,2) DEFAULT '0.00',
  `loot_points` int NOT NULL DEFAULT '0',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discord_username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_orders` int NOT NULL DEFAULT '0',
  `total_spent` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `first_name`, `last_name`, `preferred_language`, `preferred_currency`, `currency_symbol`, `created_at`, `last_login`, `is_active`, `avatar_initial`, `store_credits_balance`, `loot_points`, `phone`, `country`, `discord_username`, `total_orders`, `total_spent`) VALUES
(6, 'admin@gmail.com', '$2y$10$a8amcl6KRe4Hjlb8bI.iRe.t5snzu3bLhuOetXpZ4mxQLuDX1w1v.', 'admin', 'admin', '', 'EN', 'EUR', '€', '2026-02-02 10:14:12', '2026-04-23 12:37:31', 1, 'A', 106.73, 637557, '', 'csadsad', '', 21, 6353.30),
(7, 'coach@gmail.com', '$2y$10$6CjC2TT.uoca.VTK7DdCpelaX09XKqJ3lCVVcoXeSMfgliTlXYH9.', 'coach', 'coach', NULL, 'EN', 'EUR', '€', '2026-02-02 10:20:42', '2026-04-23 12:36:36', 1, 'C', 0.00, 16637, NULL, NULL, NULL, 6, 166.38),
(8, 'booster@gmail.com', '$2y$10$JlH.3Gzik3rPwTVH4L.FdOEJSdeVhB9bnANMkFb7eZuxwm.JAXAEG', 'booster', 'booster', NULL, 'EN', 'EUR', '€', '2026-02-02 10:22:41', '2026-04-23 12:35:09', 1, 'B', 0.00, 3642, NULL, NULL, NULL, 3, 36.42),
(25, 'nemtudom@gmail.com', '$2y$10$c5bpjxAmxjE9mb9Q6/3V5e8HpEy/gp0wWFNRhyFj/Tu60oFhLwhcm', 'booster', 'uhmuhm', '', 'EN', 'EUR', '€', '2026-04-22 15:05:16', '2026-04-23 12:30:54', 1, 'U', 1069.28, 110709, NULL, '', '', 6, 1243.09);

-- --------------------------------------------------------

--
-- Table structure for table `user_discount_codes`
--

CREATE TABLE `user_discount_codes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `discount_code_id` int NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `used_at` timestamp NULL DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `received_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_status` (`game_id`,`status`),
  ADD KEY `idx_price` (`base_price`),
  ADD KEY `idx_level` (`level`);

--
-- Indexes for table `account_inventory`
--
ALTER TABLE `account_inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `account_types`
--
ALTER TABLE `account_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `boosting_services`
--
ALTER TABLE `boosting_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_active` (`game_id`,`is_active`);

--
-- Indexes for table `coaching_services`
--
ALTER TABLE `coaching_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_active` (`game_id`,`is_active`),
  ADD KEY `idx_coach` (`coach_id`);

--
-- Indexes for table `discount_codes`
--
ALTER TABLE `discount_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `game_name` (`game_name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `notifications_ibfk_2` (`related_order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `discount_code_id` (`discount_code_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_order_number` (`order_number`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_item` (`item_type`,`item_id`);

--
-- Indexes for table `service_availability`
--
ALTER TABLE `service_availability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_service` (`game_id`,`service_type`),
  ADD KEY `idx_availability` (`is_available`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_type` (`transaction_type`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `user_discount_codes`
--
ALTER TABLE `user_discount_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discount_code_id` (`discount_code_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_user_code` (`user_id`,`discount_code_id`),
  ADD KEY `idx_used` (`is_used`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_token` (`session_token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `account_inventory`
--
ALTER TABLE `account_inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `account_types`
--
ALTER TABLE `account_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `boosting_services`
--
ALTER TABLE `boosting_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `coaching_services`
--
ALTER TABLE `coaching_services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `discount_codes`
--
ALTER TABLE `discount_codes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `service_availability`
--
ALTER TABLE `service_availability`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user_discount_codes`
--
ALTER TABLE `user_discount_codes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `account_inventory`
--
ALTER TABLE `account_inventory`
  ADD CONSTRAINT `ai_type_fk` FOREIGN KEY (`type_id`) REFERENCES `account_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `boosting_services`
--
ALTER TABLE `boosting_services`
  ADD CONSTRAINT `boosting_services_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coaching_services`
--
ALTER TABLE `coaching_services`
  ADD CONSTRAINT `coaching_services_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coaching_services_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`related_order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_availability`
--
ALTER TABLE `service_availability`
  ADD CONSTRAINT `service_availability_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_discount_codes`
--
ALTER TABLE `user_discount_codes`
  ADD CONSTRAINT `user_discount_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discount_codes_ibfk_2` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_discount_codes_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
