-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 15, 2023 at 09:45 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `emuallim`
--

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `chapter_id` bigint(255) NOT NULL,
  `board_id` bigint(255) NOT NULL,
  `class_id` bigint(255) NOT NULL,
  `subject_id` bigint(255) NOT NULL,
  `language_code` varchar(5) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'ur',
  `chapter_title` text COLLATE utf8_unicode_ci NOT NULL,
  `chapter_description` text COLLATE utf8_unicode_ci NOT NULL,
  `chapter_thumbnail` text COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `chapters`
--

-- INSERT INTO `chapters` (`chapter_id`, `board_id`, `class_id`, `subject_id`, `language_code`, `chapter_title`, `chapter_description`, `chapter_thumbnail`, `created_by`, `created_date`) VALUES
-- (1, 1, 1, 1, 'ur', 'Modern History of India', 'Modern Indian History is considered the history 1850 onwards. A major part of Modern Indian History was occupied by the British Rule in India. In this chapter, we\'ll learn about Modern Indian History ', 'modern_history.jpg', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `language_id` bigint(255) NOT NULL,
  `language` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `language_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`language_id`, `language`, `language_code`) VALUES
(1, 'Urdu', 'ur'),
(2, 'English', 'en');

-- --------------------------------------------------------

--
-- Table structure for table `masters__boards`
--

CREATE TABLE `masters__boards` (
  `board_id` bigint(255) NOT NULL,
  `board_name` text COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `masters__boards`
--

INSERT INTO `masters__boards` (`board_id`, `board_name`, `created_by`, `created_date`) VALUES
(1, 'Maharashtra State Board', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `masters__classes`
--

CREATE TABLE `masters__classes` (
  `class_id` bigint(255) NOT NULL,
  `class_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `masters__classes`
--

INSERT INTO `masters__classes` (`class_id`, `class_name`, `created_by`, `created_date`) VALUES
(1, 'Class 1', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `masters__subjects`
--

CREATE TABLE `masters__subjects` (
  `subject_id` bigint(255) NOT NULL,
  `subject_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `masters__subjects`
--

INSERT INTO `masters__subjects` (`subject_id`, `subject_name`, `created_by`, `created_date`) VALUES
(1, 'History', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `school_id` bigint(255) NOT NULL,
  `school_name` text COLLATE utf8_unicode_ci NOT NULL,
  `school_email` text COLLATE utf8_unicode_ci NOT NULL,
  `school_contact_number` text COLLATE utf8_unicode_ci NOT NULL,
  `school_address` text COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`school_id`, `school_name`, `school_email`, `school_contact_number`, `school_address`, `created_by`, `created_date`) VALUES
(1, 'Sir Sayyed School', 'sirsayyedschool@gmail.com', '0240-2330033', 'Roshan Gate, Aurangabad 431001 - MS India', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `schools__teachers`
--

CREATE TABLE `schools__teachers` (
  `teacher_id` bigint(255) NOT NULL,
  `school_id` bigint(255) NOT NULL,
  `teacher_name` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `login_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `schools__teachers`
--

INSERT INTO `schools__teachers` (`teacher_id`, `school_id`, `teacher_name`, `login_id`, `login_password`, `created_by`, `created_date`) VALUES
(1, 1, 'adnan', 'adnan', '1234', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `schools__users`
--

CREATE TABLE `schools__users` (
  `school_user_id` bigint(255) NOT NULL,
  `school_id` bigint(255) NOT NULL,
  `login_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `schools__users`
--

INSERT INTO `schools__users` (`school_user_id`, `school_id`, `login_id`, `login_password`, `created_by`, `created_date`) VALUES
(1, 1, 'admin', '1234', '1', '16-01-2023');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `topic_id` bigint(255) NOT NULL,
  `chapter_id` bigint(255) NOT NULL,
  `language_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'ur',
  `topic_title` text COLLATE utf8_unicode_ci NOT NULL,
  `topic_description` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `topic_thumbnail` text COLLATE utf8_unicode_ci NOT NULL,
  `topic_video_url` text COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`topic_id`, `chapter_id`, `language_code`, `topic_title`, `topic_description`, `topic_thumbnail`, `topic_video_url`, `created_by`, `created_date`) VALUES
(1, 1, 'ur', 'Indian Freedom Movement', 'India’s independence from the British Raj can be said to be the most significant movement in its modern history. It is very important for us to know about this struggle and learn our lessons to what forms the basis of our country and even our constitution', 'Indian_Freedom_Movement.jpg', 'https://www.youtube.com/watch?v=AHCGkBx1mLA', '1', '16-10-2023');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(255) NOT NULL,
  `user_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `login_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `login_id`, `login_password`, `created_by`, `created_date`) VALUES
(1, 'Super Admin', 'admin', '1234', '1', '16-01-2023');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`chapter_id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`language_id`);

--
-- Indexes for table `masters__boards`
--
ALTER TABLE `masters__boards`
  ADD PRIMARY KEY (`board_id`);

--
-- Indexes for table `masters__classes`
--
ALTER TABLE `masters__classes`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `masters__subjects`
--
ALTER TABLE `masters__subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `schools__teachers`
--
ALTER TABLE `schools__teachers`
  ADD PRIMARY KEY (`teacher_id`);

--
-- Indexes for table `schools__users`
--
ALTER TABLE `schools__users`
  ADD PRIMARY KEY (`school_user_id`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`topic_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `chapter_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `language_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `masters__boards`
--
ALTER TABLE `masters__boards`
  MODIFY `board_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `masters__classes`
--
ALTER TABLE `masters__classes`
  MODIFY `class_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `masters__subjects`
--
ALTER TABLE `masters__subjects`
  MODIFY `subject_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `school_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schools__teachers`
--
ALTER TABLE `schools__teachers`
  MODIFY `teacher_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schools__users`
--
ALTER TABLE `schools__users`
  MODIFY `school_user_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `topic_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
