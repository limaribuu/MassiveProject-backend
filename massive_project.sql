-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2025 at 05:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `massive_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `place_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `place_id`, `created_at`) VALUES
(4, 6, 'ampera', '2025-11-20 03:34:11'),
(5, 7, 'museum-balaputra', '2025-11-20 03:42:24'),
(6, 5, 'ampera', '2025-11-27 15:44:58'),
(7, 2, '#', '2025-11-30 16:22:26'),
(20, 2, 'lorong-basah', '2025-12-01 06:24:56'),
(21, 2, 'bukit-siguntang', '2025-12-01 06:25:11'),
(22, 2, '#', '2025-12-01 11:26:28'),
(23, 2, 'benteng-kuto-besak', '2025-12-01 12:07:39'),
(24, 2, 'pulau-kemaro', '2025-12-01 12:07:46'),
(25, 2, 'ampera', '2025-12-01 12:14:17'),
(32, 8, 'bukit-siguntang', '2025-12-03 14:32:38'),
(34, 8, 'benteng-kuto-besak', '2025-12-03 15:43:30'),
(35, 9, 'museum-smb-ii', '2025-12-05 14:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `itinerary`
--

CREATE TABLE `itinerary` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `place_id` varchar(100) NOT NULL,
  `ticket_price` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `itinerary`
--

INSERT INTO `itinerary` (`id`, `user_id`, `place_id`, `ticket_price`, `created_at`, `updated_at`) VALUES
(1, 1, 'bukit-siguntang', 7000, '2025-11-28 21:13:39', '2025-11-28 21:13:39'),
(2, 1, 'museum-balaputra', 7000, '2025-11-28 21:13:39', '2025-11-28 21:13:39'),
(3, 1, 'museum-sultan-mahmud-badarrudin-ii', 7000, '2025-11-28 21:13:39', '2025-11-28 21:13:39'),
(13, 2, 'bukit-siguntang', 7000, '2025-11-28 21:37:37', '2025-11-28 21:37:37'),
(14, 2, 'bayt-quran', 7000, '2025-11-28 21:47:58', '2025-11-28 21:47:58'),
(15, 2, 'pulau-kemaro', 0, '2025-11-28 22:11:43', '2025-11-28 22:11:43'),
(16, 2, 'bkb', 0, '2025-11-28 22:11:49', '2025-11-28 22:11:49'),
(18, 8, 'ampera', 0, '2025-12-01 21:59:15', '2025-12-01 21:59:15'),
(23, 8, 'museum-smb-ii', 7000, '2025-12-01 22:07:53', '2025-12-01 22:07:53'),
(24, 8, 'bayt-quran', 7000, '2025-12-03 21:32:06', '2025-12-03 21:32:06'),
(27, 8, 'museum-balaputra', 7000, '2025-12-03 22:44:04', '2025-12-03 22:44:04'),
(28, 8, 'bkb', 0, '2025-12-03 22:44:11', '2025-12-03 22:44:11'),
(29, 8, 'jakabaring', 10000, '2025-12-03 22:44:12', '2025-12-03 22:44:12'),
(30, 8, 'pulau-kemaro', 0, '2025-12-03 22:44:14', '2025-12-03 22:44:14'),
(32, 8, 'monpera', 0, '2025-12-03 22:44:16', '2025-12-03 22:44:16'),
(33, 8, 'kampung-kapitan', 0, '2025-12-03 22:44:19', '2025-12-03 22:44:19'),
(34, 8, 'lorong-basah', 0, '2025-12-03 22:44:20', '2025-12-03 22:44:20'),
(35, 9, 'bukit-siguntang', 0, '2025-12-06 15:54:59', '2025-12-06 15:54:59');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `no_telpon` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `nama`, `email`, `password`, `gender`, `tanggal_lahir`, `no_telpon`, `foto`) VALUES
(1, 'User Test Update', 'test@example.com', '$2b$10$DXkgssgJaqF2BAprOgg0CuZRg0CS.BFvhq5ZLsFEl8Txa5.KWupV2', 'Laki-laki', '2000-01-01', '08123456789', '/uploads/avatar-1763523749632.png'),
(2, 'tegar', 'tegar@gmail.com', '$2b$10$GVtFHvpau.xmJvXuVNpDs.bg7Kyer7UotQdboghAMg0kxdEfQmULW', 'L', '2025-11-05', '081312341234', '/uploads/avatar-1763998975292.jpeg'),
(3, 'User Test', 'user@test.com', '$2b$10$F3OldmoeJmqqDYMtK4df2OjrkwTDXI37MgojmT2oW8tJtYZsG4OJS', '', NULL, NULL, NULL),
(4, 'ferdi', 'ferdi@gmail.com', '$2b$10$A4/wkKqJs51XFJakQzJh1ugETPbaeSY22zHviDU3TXXt8jLMu6vL.', '', NULL, NULL, NULL),
(5, 'reza', 'reza@gmail.com', '$2b$10$HuygYYuimRNJXYrGj.dGe.86EB88ZhllR3L5gEWeta7tCaazEAx4S', 'L', '2025-11-01', '08123123123', NULL),
(6, 'test2', 'test2@gmail.com', '$2b$10$D4juhngGPhe48TmDaKR5jeyfqa2aIB7rxsCVzCkzN6NgO7D4m.EFu', 'L', '2025-11-07', '081300000000', '/uploads/avatar-1763609645865.png'),
(7, 'test', 'test3@gmail.com', '$2b$10$eGNsMbaajU7ZYtxrQFIywOpYppuD2SRaQec2rX16gmOD.4oiqs5IO', 'L', '2025-11-06', '0813123123123', '/uploads/avatar-1763610134473.png'),
(8, 'tegar', 'tegar1@gmail.com', '$2b$10$WkpPDjU7VYvZE6ZnDJiSOOPtnbbCHRbvWf.scTimPi2COOTtNpDqu', '', NULL, NULL, '/uploads/avatar-1764598866343.png'),
(9, 'sekar', 'sekar@gmail.com', '$2b$10$fASgQY9Q8ExjqXcbD.Dbiuqn4eN38UmxrItLHMZ0ci78PDc0XxWOK', '', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `place_id` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `place_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 'museum-balaputra', 1, 5, 'Museumnya keren banget! Koleksinya lengkap dan informatif.', '2025-05-20 00:00:00', '2025-11-27 21:49:40'),
(2, 'museum-balaputra', 2, 4, 'Asik buat nambah wawasan sejarah Palembang.', '2025-05-20 00:00:00', '2025-11-27 21:49:40'),
(3, 'museum-balaputra', 3, 4, 'Tempatnya bersih, cuma parkir agak sempit.', '2025-05-20 00:00:00', '2025-11-27 21:49:40'),
(4, 'museum-balaputra', 4, 5, 'Penjelasan pemandu jelas, recommended.', '2025-05-20 00:00:00', '2025-11-27 21:49:40'),
(5, 'bayt-quran', 5, 5, 'TEMPAT NYA BAGUS', '2025-11-27 22:41:54', '2025-11-27 22:41:54'),
(6, 'bkb', 5, 2, 'Tempat banyak begal dan parkir liar', '2025-11-27 22:43:07', '2025-11-27 22:43:07'),
(7, 'bkb', 2, 5, 'asd', '2025-11-28 23:32:06', '2025-11-28 23:32:06'),
(8, 'bayt-quran', 2, 3, 'asd', '2025-11-28 23:39:43', '2025-11-28 23:39:43'),
(9, 'ampera', 2, 5, 'qweqweasd', '2025-11-29 00:05:12', '2025-11-29 00:05:12'),
(10, 'museum-balaputra', 2, 2, 'aasd', '2025-11-30 21:31:33', '2025-11-30 21:31:33'),
(11, 'bukit-siguntang', 2, 5, 'qwe', '2025-11-30 23:16:22', '2025-11-30 23:16:22'),
(12, 'taman-purbakala', 9, 5, '123', '2025-12-05 20:20:02', '2025-12-05 20:20:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_favorites_user` (`user_id`);

--
-- Indexes for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_place` (`user_id`,`place_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_place_id` (`place_id`),
  ADD KEY `idx_user_place` (`user_id`,`place_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `itinerary`
--
ALTER TABLE `itinerary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `itinerary`
--
ALTER TABLE `itinerary`
  ADD CONSTRAINT `fk_itinerary_user` FOREIGN KEY (`user_id`) REFERENCES `profile` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `profile` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
