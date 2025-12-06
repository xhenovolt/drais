-- =========================================
-- Excel Islamic Nursery & Primary School
-- Database Schema (Tables Only)
-- Generated: December 1, 2025
-- =========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `excel_islamic_school`
--

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `drais_school` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `drais_school`;

-- Disable foreign key checks for clean table creation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables in reverse order of dependencies (if they exist)
DROP TABLE IF EXISTS `user_people`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `term_student_requirement_status`;
DROP TABLE IF EXISTS `term_student_reports`;
DROP TABLE IF EXISTS `term_requirement_items`;
DROP TABLE IF EXISTS `term_requirements`;
DROP TABLE IF EXISTS `term_progress_log`;
DROP TABLE IF EXISTS `tahfiz_migration_log`;
DROP TABLE IF EXISTS `tahfiz_group_members`;
DROP TABLE IF EXISTS `tahfiz_evaluations`;
DROP TABLE IF EXISTS `tahfiz_records`;
DROP TABLE IF EXISTS `tahfiz_attendance`;
DROP TABLE IF EXISTS `tahfiz_plans`;
DROP TABLE IF EXISTS `tahfiz_portions`;
DROP TABLE IF EXISTS `tahfiz_books`;
DROP TABLE IF EXISTS `tahfiz_groups`;
DROP TABLE IF EXISTS `student_hafz_progress_summary`;
DROP TABLE IF EXISTS `student_requirements`;
DROP TABLE IF EXISTS `student_profiles`;
DROP TABLE IF EXISTS `student_next_of_kin`;
DROP TABLE IF EXISTS `student_fee_items`;
DROP TABLE IF EXISTS `student_family_status`;
DROP TABLE IF EXISTS `student_education_levels`;
DROP TABLE IF EXISTS `student_curriculums`;
DROP TABLE IF EXISTS `student_contacts`;
DROP TABLE IF EXISTS `student_attendance`;
DROP TABLE IF EXISTS `staff_salaries`;
DROP TABLE IF EXISTS `staff_attendance`;
DROP TABLE IF EXISTS `salary_payments`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `report_card_subjects`;
DROP TABLE IF EXISTS `report_card_metrics`;
DROP TABLE IF EXISTS `report_cards`;
DROP TABLE IF EXISTS `results`;
DROP TABLE IF EXISTS `fee_payments`;
DROP TABLE IF EXISTS `workplans`;
DROP TABLE IF EXISTS `department_workplans`;
DROP TABLE IF EXISTS `class_subjects`;
DROP TABLE IF EXISTS `class_results`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `timetable`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `wallets`;
DROP TABLE IF EXISTS `ledger`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `people`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `streams`;
DROP TABLE IF EXISTS `terms`;
DROP TABLE IF EXISTS `academic_years`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `branches`;
DROP TABLE IF EXISTS `schools`;
DROP TABLE IF EXISTS `school_settings`;
DROP TABLE IF EXISTS `fee_structures`;
DROP TABLE IF EXISTS `finance_categories`;
DROP TABLE IF EXISTS `payroll_definitions`;
DROP TABLE IF EXISTS `result_types`;
DROP TABLE IF EXISTS `requirements_master`;
DROP TABLE IF EXISTS `document_types`;
DROP TABLE IF EXISTS `curriculums`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `villages`;
DROP TABLE IF EXISTS `parishes`;
DROP TABLE IF EXISTS `subcounties`;
DROP TABLE IF EXISTS `counties`;
DROP TABLE IF EXISTS `districts`;
DROP TABLE IF EXISTS `nationalities`;
DROP TABLE IF EXISTS `living_statuses`;
DROP TABLE IF EXISTS `orphan_statuses`;
DROP TABLE IF EXISTS `audit_log`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- TABLE STRUCTURES
-- =========================================
CREATE TABLE `academic_years` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `audit_log` (
  `id` bigint(20) NOT NULL,
  `actor_user_id` bigint(20) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` bigint(20) DEFAULT NULL,
  `changes_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes_json`)),
  `ip` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `branches` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `classes` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `class_level` int(11) DEFAULT NULL,
  `class_teacher_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `class_results` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  `result_type_id` bigint(20) NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `class_subjects` (
  `id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `contacts` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `person_id` bigint(20) NOT NULL,
  `contact_type` varchar(30) NOT NULL,
  `occupation` varchar(120) DEFAULT NULL,
  `alive_status` varchar(20) DEFAULT NULL,
  `date_of_death` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `counties` (
  `id` bigint(20) NOT NULL,
  `district_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `curriculums` (
  `id` tinyint(4) NOT NULL,
  `code` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `head_staff_id` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `department_workplans` (
  `id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_by` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `districts` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `owner_type` varchar(30) NOT NULL,
  `owner_id` bigint(20) NOT NULL,
  `document_type_id` bigint(20) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `issued_by` varchar(150) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `uploaded_by` bigint(20) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `document_types` (
  `id` bigint(20) NOT NULL,
  `code` varchar(60) NOT NULL,
  `label` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `class_id` bigint(20) DEFAULT NULL,
  `theology_class_id` bigint(20) DEFAULT NULL,
  `stream_id` bigint(20) DEFAULT NULL,
  `academic_year_id` bigint(20) DEFAULT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `events` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `location` varchar(120) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'upcoming',
  `created_by` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `exams` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `body` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `fee_payments` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `wallet_id` bigint(20) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `method` varchar(30) DEFAULT NULL,
  `paid_by` varchar(150) DEFAULT NULL,
  `payer_contact` varchar(50) DEFAULT NULL,
  `reference` varchar(120) DEFAULT NULL,
  `receipt_no` varchar(40) DEFAULT NULL,
  `ledger_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `fee_structures` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `item` varchar(120) NOT NULL,
  `amount` decimal(14,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `finance_categories` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `name` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `ledger` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `wallet_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `tx_type` varchar(10) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `reference` varchar(120) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `staff_id` bigint(20) DEFAULT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `living_statuses` (
  `id` tinyint(4) NOT NULL,
  `code` varchar(20) NOT NULL,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `nationalities` (
  `id` int(11) NOT NULL,
  `code` varchar(3) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `orphan_statuses` (
  `id` tinyint(4) NOT NULL,
  `code` varchar(20) NOT NULL,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `parishes` (
  `id` bigint(20) NOT NULL,
  `subcounty_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `payroll_definitions` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `people` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `other_name` varchar(100) DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `code` varchar(120) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `report_cards` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `overall_grade` varchar(10) DEFAULT NULL,
  `class_teacher_comment` text DEFAULT NULL,
  `headteacher_comment` text DEFAULT NULL,
  `dos_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `report_card_metrics` (
  `report_card_id` bigint(20) NOT NULL,
  `total_score` decimal(7,2) DEFAULT NULL,
  `average_score` decimal(5,2) DEFAULT NULL,
  `min_score` decimal(5,2) DEFAULT NULL,
  `max_score` decimal(5,2) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `promoted` tinyint(1) DEFAULT 0,
  `promotion_class_id` bigint(20) DEFAULT NULL,
  `computed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `report_card_subjects` (
  `id` bigint(20) NOT NULL,
  `report_card_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `total_score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `requirements_master` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `results` (
  `id` bigint(20) NOT NULL,
  `exam_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `result_types` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(60) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `deadline` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(80) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `salary_payments` (
  `id` bigint(20) NOT NULL,
  `staff_id` bigint(20) NOT NULL,
  `wallet_id` bigint(20) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `method` varchar(30) DEFAULT NULL,
  `reference` varchar(120) DEFAULT NULL,
  `ledger_id` bigint(20) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `schools` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `legal_name` varchar(200) DEFAULT NULL,
  `short_code` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'UGX',
  `address` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `school_settings` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `key_name` varchar(120) NOT NULL,
  `value_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `staff` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `person_id` bigint(20) NOT NULL,
  `staff_no` varchar(50) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `staff_attendance` (
  `id` bigint(20) NOT NULL,
  `staff_id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) DEFAULT 'present',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `staff_salaries` (
  `id` bigint(20) NOT NULL,
  `staff_id` bigint(20) NOT NULL,
  `month` year(4) DEFAULT NULL,
  `period_month` tinyint(4) DEFAULT NULL,
  `definition_id` bigint(20) NOT NULL,
  `amount` decimal(14,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `streams` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `students` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `person_id` bigint(20) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `theology_class_id` int(11) DEFAULT NULL,
  `admission_no` varchar(50) DEFAULT NULL,
  `village_id` bigint(20) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_attendance` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) DEFAULT 'present',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_contacts` (
  `student_id` bigint(20) NOT NULL,
  `contact_id` bigint(20) NOT NULL,
  `relationship` varchar(50) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_curriculums` (
  `student_id` bigint(20) NOT NULL,
  `curriculum_id` tinyint(4) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_education_levels` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `education_type` varchar(20) NOT NULL,
  `level_name` varchar(120) NOT NULL,
  `institution` varchar(150) DEFAULT NULL,
  `year_completed` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_family_status` (
  `student_id` bigint(20) NOT NULL,
  `orphan_status_id` tinyint(4) DEFAULT NULL,
  `primary_guardian_name` varchar(150) DEFAULT NULL,
  `primary_guardian_contact` varchar(60) DEFAULT NULL,
  `primary_guardian_occupation` varchar(120) DEFAULT NULL,
  `father_name` varchar(150) DEFAULT NULL,
  `father_living_status_id` tinyint(4) DEFAULT NULL,
  `father_occupation` varchar(120) DEFAULT NULL,
  `father_contact` varchar(60) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_fee_items` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `item` varchar(120) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `discount` decimal(14,2) DEFAULT 0.00,
  `paid` decimal(14,2) DEFAULT 0.00,
  `balance` decimal(14,2) GENERATED ALWAYS AS (`amount` - `discount` - `paid`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_hafz_progress_summary` (
  `student_id` bigint(20) NOT NULL,
  `juz_memorized` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_next_of_kin` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `sequence` tinyint(4) NOT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `occupation` varchar(120) DEFAULT NULL,
  `contact` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_profiles` (
  `student_id` bigint(20) NOT NULL,
  `place_of_birth` varchar(150) DEFAULT NULL,
  `place_of_residence` varchar(150) DEFAULT NULL,
  `district_id` bigint(20) DEFAULT NULL,
  `nationality_id` int(11) DEFAULT NULL,
  `passport_document_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `student_requirements` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `requirement_id` bigint(20) NOT NULL,
  `brought` tinyint(1) DEFAULT 0,
  `date_reported` date DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `subcounties` (
  `id` bigint(20) NOT NULL,
  `county_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `subjects` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `subject_type` varchar(20) DEFAULT 'core'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_attendance` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late','excused') DEFAULT 'present',
  `remarks` text DEFAULT NULL,
  `recorded_by` bigint(20) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_books` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `total_units` int(11) DEFAULT NULL,
  `unit_type` varchar(50) DEFAULT 'verse',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_evaluations` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `evaluator_id` bigint(20) NOT NULL,
  `type` enum('monthly','termly','annual','special') DEFAULT 'monthly',
  `retention_score` decimal(5,2) DEFAULT NULL,
  `tajweed_score` decimal(5,2) DEFAULT NULL,
  `voice_score` decimal(5,2) DEFAULT NULL,
  `discipline_score` decimal(5,2) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `evaluated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_groups` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_group_members` (
  `id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(30) DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_migration_log` (
  `id` bigint(20) NOT NULL,
  `event_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_plans` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `book_id` bigint(20) DEFAULT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `class_id` bigint(20) DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `stream_id` bigint(20) DEFAULT NULL,
  `assigned_date` date NOT NULL,
  `portion_text` varchar(255) NOT NULL,
  `portion_unit` varchar(50) DEFAULT 'verse',
  `expected_length` int(11) DEFAULT NULL,
  `type` varchar(20) NOT NULL CHECK (`type` in ('tilawa','hifz','muraja','other')),
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_portions` (
  `id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `portion_name` varchar(100) NOT NULL,
  `surah_name` varchar(100) DEFAULT NULL,
  `ayah_from` int(11) DEFAULT NULL,
  `ayah_to` int(11) DEFAULT NULL,
  `juz_number` int(11) DEFAULT NULL,
  `page_from` int(11) DEFAULT NULL,
  `page_to` int(11) DEFAULT NULL,
  `status` enum('pending','in_progress','completed','skipped','review') DEFAULT 'pending',
  `difficulty_level` enum('easy','medium','hard') DEFAULT 'medium',
  `estimated_days` int(11) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `assigned_at` datetime DEFAULT current_timestamp(),
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `reviewed_by` bigint(20) DEFAULT NULL,
  `verified_by` bigint(20) DEFAULT NULL,
  `verification_status` enum('unverified','verified','rejected') DEFAULT 'unverified'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `tahfiz_records` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `plan_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `presented` tinyint(1) DEFAULT 0,
  `presented_length` int(11) DEFAULT 0,
  `retention_score` decimal(5,2) DEFAULT NULL,
  `mark` decimal(5,2) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `recorded_by` bigint(20) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `terms` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `academic_year_id` bigint(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `term_progress_log` (
  `id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `day_date` date NOT NULL,
  `week_no` tinyint(4) DEFAULT NULL,
  `summary` varchar(200) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `term_requirements` (
  `id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `requirement_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `term_requirement_items` (
  `id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `mandatory` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `term_student_reports` (
  `id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `report_date` date NOT NULL,
  `status` varchar(20) DEFAULT 'reported',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `term_student_requirement_status` (
  `id` bigint(20) NOT NULL,
  `term_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `brought` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `timetable` (
  `id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `branch_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `user_people` (
  `user_id` bigint(20) NOT NULL,
  `person_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `villages` (
  `id` bigint(20) NOT NULL,
  `parish_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `wallets` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `branch_id` bigint(20) DEFAULT NULL,
  `name` varchar(80) NOT NULL,
  `method` varchar(40) NOT NULL,
  `currency` varchar(10) DEFAULT 'UGX',
  `opening_balance` decimal(14,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `workplans` (
  `id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `owner_type` varchar(20) NOT NULL,
  `owner_id` bigint(20) DEFAULT NULL,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------


-- =========================================
-- INDEXES AND CONSTRAINTS
-- =========================================


-- =========================================
-- FINALIZE SCHEMA SETUP
-- =========================================

COMMIT;


-- Schema creation completed successfully
-- =========================================
-- FINALIZE SCHEMA SETUP
-- =========================================

COMMIT;

-- Schema creation completed successfully
-- Excel Islamic Nursery & Primary School Database Schema

