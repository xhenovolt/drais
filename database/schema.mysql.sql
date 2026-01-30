-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: drais
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_years`
--

DROP TABLE IF EXISTS `academic_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_years` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_years`
--

LOCK TABLES `academic_years` WRITE;
/*!40000 ALTER TABLE `academic_years` DISABLE KEYS */;
/*!40000 ALTER TABLE `academic_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_forms`
--

DROP TABLE IF EXISTS `admission_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission_forms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `school_id` bigint NOT NULL,
  `form_number` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `file_url` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `file_size` bigint DEFAULT NULL,
  `generated_by` bigint NOT NULL,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `form_number` (`form_number`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_school_id` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_forms`
--

LOCK TABLES `admission_forms` WRITE;
/*!40000 ALTER TABLE `admission_forms` DISABLE KEYS */;
/*!40000 ALTER TABLE `admission_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `lesson_id` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `instructions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `total_marks` decimal(5,2) NOT NULL,
  `assigned_date` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `late_submission_allowed` tinyint(1) DEFAULT '0',
  `late_penalty_percentage` decimal(5,2) DEFAULT '0.00',
  `attachment_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submission_type` enum('file','text','link','both') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'file',
  `allowed_file_types` json DEFAULT NULL COMMENT 'pdf, doc, jpg, etc.',
  `max_file_size_mb` int unsigned DEFAULT '10',
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student assignments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_submission`
--

DROP TABLE IF EXISTS `assignment_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_submission` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `submission_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `submission_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` timestamp NOT NULL,
  `is_late` tinyint(1) DEFAULT '0',
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `graded_by` bigint unsigned DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','submitted','graded','returned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'submitted',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student assignment submissions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_submission`
--

LOCK TABLES `assignment_submission` WRITE;
/*!40000 ALTER TABLE `assignment_submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `section_id` bigint unsigned DEFAULT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused','half_day') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `recorded_by` bigint unsigned DEFAULT NULL COMMENT 'User who recorded attendance',
  `method` enum('manual','biometric','rfid','qr_code') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'manual',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student daily attendance records';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actor_user_id` bigint DEFAULT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `changes_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `ip` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `audit_log_chk_1` CHECK (json_valid(`changes_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklisted_tokens`
--

DROP TABLE IF EXISTS `blacklisted_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklisted_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `blacklisted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklisted_tokens`
--

LOCK TABLES `blacklisted_tokens` WRITE;
/*!40000 ALTER TABLE `blacklisted_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklisted_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `budget_amount` decimal(12,2) NOT NULL,
  `spent_amount` decimal(12,2) DEFAULT '0.00',
  `remaining_amount` decimal(12,2) GENERATED ALWAYS AS ((`budget_amount` - `spent_amount`)) STORED,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Budget planning and tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget`
--

LOCK TABLES `budget` WRITE;
/*!40000 ALTER TABLE `budget` DISABLE KEYS */;
/*!40000 ALTER TABLE `budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bursaries`
--

DROP TABLE IF EXISTS `bursaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bursaries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `bursary_type` enum('percentage','fixed_amount','full_sponsorship') COLLATE utf8mb4_unicode_ci NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL COMMENT 'If type is percentage (0-100)',
  `fixed_amount` decimal(10,2) DEFAULT NULL COMMENT 'If type is fixed_amount',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `sponsor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sponsor_contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `applied_by` bigint DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `reviewed_by` bigint DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_term_year` (`term`,`year`),
  KEY `idx_status` (`status`),
  KEY `applied_by` (`applied_by`),
  KEY `reviewed_by` (`reviewed_by`),
  CONSTRAINT `bursaries_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bursaries_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bursaries_ibfk_3` FOREIGN KEY (`applied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bursaries_ibfk_4` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bursaries`
--

LOCK TABLES `bursaries` WRITE;
/*!40000 ALTER TABLE `bursaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `bursaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bursary_adjustments`
--

DROP TABLE IF EXISTS `bursary_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bursary_adjustments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bursary_id` bigint unsigned NOT NULL,
  `student_fee_id` bigint unsigned NOT NULL,
  `original_amount` decimal(10,2) NOT NULL,
  `adjustment_amount` decimal(10,2) NOT NULL,
  `adjusted_amount` decimal(10,2) NOT NULL COMMENT 'Amount after reduction',
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bursary_id` (`bursary_id`),
  KEY `idx_student_fee_id` (`student_fee_id`),
  CONSTRAINT `bursary_adjustments_ibfk_1` FOREIGN KEY (`bursary_id`) REFERENCES `bursaries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bursary_adjustments_ibfk_2` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bursary_adjustments`
--

LOCK TABLES `bursary_adjustments` WRITE;
/*!40000 ALTER TABLE `bursary_adjustments` DISABLE KEYS */;
/*!40000 ALTER TABLE `bursary_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `template_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `certificate_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificate_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `issue_date` date NOT NULL,
  `pdf_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_number` (`certificate_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Issued certificates';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_template`
--

DROP TABLE IF EXISTS `certificate_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_template` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_type` enum('completion','achievement','participation','character','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_design` json DEFAULT NULL COMMENT 'Template design configuration',
  `is_default` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Certificate templates';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_template`
--

LOCK TABLES `certificate_template` WRITE;
/*!40000 ALTER TABLE `certificate_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chart_of_account`
--

DROP TABLE IF EXISTS `chart_of_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chart_of_account` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `account_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('asset','liability','equity','revenue','expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_account_id` bigint unsigned DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chart of accounts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chart_of_account`
--

LOCK TABLES `chart_of_account` WRITE;
/*!40000 ALTER TABLE `chart_of_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `chart_of_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `level` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `section` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_school_id` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_results`
--

DROP TABLE IF EXISTS `class_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `class_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `term_id` bigint DEFAULT NULL,
  `result_type_id` bigint NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_results`
--

LOCK TABLES `class_results` WRITE;
/*!40000 ALTER TABLE `class_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subjects`
--

DROP TABLE IF EXISTS `class_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `class_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subjects`
--

LOCK TABLES `class_subjects` WRITE;
/*!40000 ALTER TABLE `class_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `curriculum_id` int DEFAULT NULL,
  `class_level` int DEFAULT NULL,
  `head_teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `person_id` bigint NOT NULL,
  `contact_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `occupation` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alive_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_death` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counties`
--

DROP TABLE IF EXISTS `counties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `district_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counties`
--

LOCK TABLES `counties` WRITE;
/*!40000 ALTER TABLE `counties` DISABLE KEYS */;
/*!40000 ALTER TABLE `counties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned DEFAULT NULL COMMENT 'Links to existing subject',
  `course_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `objectives` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration_hours` int unsigned DEFAULT NULL COMMENT 'Total course duration',
  `credits` int unsigned DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prerequisites` json DEFAULT NULL COMMENT 'Array of prerequisite course IDs',
  `syllabus_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Course catalog for LMS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curriculums`
--

DROP TABLE IF EXISTS `curriculums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculums` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculums`
--

LOCK TABLES `curriculums` WRITE;
/*!40000 ALTER TABLE `curriculums` DISABLE KEYS */;
/*!40000 ALTER TABLE `curriculums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department_workplans`
--

DROP TABLE IF EXISTS `department_workplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department_workplans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department_id` bigint NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department_workplans`
--

LOCK TABLES `department_workplans` WRITE;
/*!40000 ALTER TABLE `department_workplans` DISABLE KEYS */;
/*!40000 ALTER TABLE `department_workplans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `head_staff_id` bigint DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_types`
--

DROP TABLE IF EXISTS `document_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_types`
--

LOCK TABLES `document_types` WRITE;
/*!40000 ALTER TABLE `document_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `owner_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `owner_id` bigint NOT NULL,
  `document_type_id` bigint NOT NULL,
  `file_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `issued_by` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `uploaded_by` bigint DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_log`
--

DROP TABLE IF EXISTS `email_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `recipient_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_user_id` bigint unsigned DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','sent','failed','bounced') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `email_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., smtp, sendgrid, mailgun',
  `provider_message_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachments` json DEFAULT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sent_at` timestamp NULL DEFAULT NULL,
  `opened_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Email sending logs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_log`
--

LOCK TABLES `email_log` WRITE;
/*!40000 ALTER TABLE `email_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `class_id` bigint DEFAULT NULL,
  `theology_class_id` bigint DEFAULT NULL,
  `stream_id` bigint DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `term_id` bigint DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `event_type` enum('holiday','exam','meeting','sports','cultural','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_audience` enum('all','students','teachers','parents','specific_class') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `class_id` bigint unsigned DEFAULT NULL COMMENT 'If target_audience is specific_class',
  `is_holiday` tinyint(1) DEFAULT '0',
  `organizer_id` bigint unsigned DEFAULT NULL,
  `max_participants` int unsigned DEFAULT NULL,
  `registration_required` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='School events and calendar';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_participant`
--

DROP TABLE IF EXISTS `event_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_participant` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint unsigned NOT NULL,
  `participant_type` enum('student','teacher','parent','guest') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_id` bigint unsigned DEFAULT NULL COMMENT 'Student or User ID',
  `participant_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('registered','attended','absent','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'registered',
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `attended_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Event participants and attendance';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_participant`
--

LOCK TABLES `event_participant` WRITE;
/*!40000 ALTER TABLE `event_participant` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `location` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'upcoming',
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_result`
--

DROP TABLE IF EXISTS `exam_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_result` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `exam_schedule_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `marks_obtained` decimal(5,2) NOT NULL,
  `total_marks` decimal(5,2) NOT NULL,
  `percentage` decimal(5,2) GENERATED ALWAYS AS (((`marks_obtained` / `total_marks`) * 100)) STORED,
  `grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `entered_by` bigint unsigned DEFAULT NULL,
  `verified_by` bigint unsigned DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Examination results and marks';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_result`
--

LOCK TABLES `exam_result` WRITE;
/*!40000 ALTER TABLE `exam_result` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_schedule`
--

DROP TABLE IF EXISTS `exam_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_schedule` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `exam_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `exam_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration_minutes` int unsigned DEFAULT NULL,
  `room_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT '100.00',
  `invigilator_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Examination schedules';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_schedule`
--

LOCK TABLES `exam_schedule` WRITE;
/*!40000 ALTER TABLE `exam_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `class_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `term_id` bigint DEFAULT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `body` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `expense_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `expense_date` date NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Utilities, Salaries, Supplies, etc.',
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','cheque','mobile_money','card') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `receipt_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','paid','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `requested_by` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_number` (`expense_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Expense tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense`
--

LOCK TABLES `expense` WRITE;
/*!40000 ALTER TABLE `expense` DISABLE KEYS */;
/*!40000 ALTER TABLE `expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_category`
--

DROP TABLE IF EXISTS `fee_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Tuition, Transport, Boarding, Meals, Uniform',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_recurring` tinyint(1) DEFAULT '0' COMMENT 'Charged every term',
  `accounting_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'For integration with accounting systems',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee category definitions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_category`
--

LOCK TABLES `fee_category` WRITE;
/*!40000 ALTER TABLE `fee_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_discount`
--

DROP TABLE IF EXISTS `fee_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_discount` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Siblings Discount, Merit Scholarship',
  `discount_type` enum('percentage','fixed_amount') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `applicable_to` enum('all_fees','specific_category','specific_structure') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all_fees',
  `fee_category_id` bigint unsigned DEFAULT NULL,
  `conditions` json DEFAULT NULL COMMENT 'Eligibility conditions',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee discounts and scholarships';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_discount`
--

LOCK TABLES `fee_discount` WRITE;
/*!40000 ALTER TABLE `fee_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_items`
--

DROP TABLE IF EXISTS `fee_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `item_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `default_amount` decimal(10,2) NOT NULL,
  `category` enum('tuition','boarding','transport','meals','library','sports','uniform','exam','other') COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  `is_mandatory` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `applies_to_all` tinyint(1) DEFAULT '1' COMMENT 'If 0, requires specific allocation',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`),
  KEY `idx_deleted` (`deleted_at`),
  CONSTRAINT `fee_items_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_items`
--

LOCK TABLES `fee_items` WRITE;
/*!40000 ALTER TABLE `fee_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_structure`
--

DROP TABLE IF EXISTS `fee_structure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_structure` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned DEFAULT NULL COMMENT 'NULL for school-wide fees',
  `fee_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., Tuition, Transport, Boarding, Exam',
  `amount` decimal(10,2) NOT NULL,
  `is_compulsory` tinyint(1) DEFAULT '1',
  `due_date` date DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Fee structure definitions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_structure`
--

LOCK TABLES `fee_structure` WRITE;
/*!40000 ALTER TABLE `fee_structure` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_structure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_upload`
--

DROP TABLE IF EXISTS `file_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_upload` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned DEFAULT NULL,
  `uploaded_by` bigint unsigned DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT NULL COMMENT 'Size in bytes',
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Table name this file relates to',
  `entity_id` bigint unsigned DEFAULT NULL COMMENT 'ID of related record',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='File upload tracking';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_upload`
--

LOCK TABLES `file_upload` WRITE;
/*!40000 ALTER TABLE `file_upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `file_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_category`
--

DROP TABLE IF EXISTS `inventory_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `parent_category_id` bigint unsigned DEFAULT NULL COMMENT 'For subcategories',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventory item categories';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_category`
--

LOCK TABLES `inventory_category` WRITE;
/*!40000 ALTER TABLE `inventory_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_item`
--

DROP TABLE IF EXISTS `inventory_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `item_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `unit_of_measure` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'pieces, kg, liters, etc.',
  `current_quantity` decimal(10,2) DEFAULT '0.00',
  `minimum_quantity` decimal(10,2) DEFAULT '0.00' COMMENT 'Reorder level',
  `maximum_quantity` decimal(10,2) DEFAULT NULL,
  `unit_cost` decimal(10,2) DEFAULT '0.00',
  `selling_price` decimal(10,2) DEFAULT NULL,
  `storage_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_consumable` tinyint(1) DEFAULT '1',
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier_contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_code` (`item_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventory items catalog';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_item`
--

LOCK TABLES `inventory_item` WRITE;
/*!40000 ALTER TABLE `inventory_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `amount_paid` decimal(10,2) DEFAULT '0.00',
  `balance` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path to PDF',
  `status` enum('pending','partial','paid','overdue','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `generated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `generated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_invoice_number` (`invoice_number`,`school_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_term_year` (`term`,`year`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`),
  KEY `generated_by` (`generated_by`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entry`
--

DROP TABLE IF EXISTS `journal_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `journal_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` date NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_debit` decimal(12,2) NOT NULL,
  `total_credit` decimal(12,2) NOT NULL,
  `status` enum('draft','posted','reversed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `posted_by` bigint unsigned DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `journal_number` (`journal_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='General journal entries';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry`
--

LOCK TABLES `journal_entry` WRITE;
/*!40000 ALTER TABLE `journal_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `journal_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entry_line`
--

DROP TABLE IF EXISTS `journal_entry_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entry_line` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `journal_entry_id` bigint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `debit_amount` decimal(12,2) DEFAULT '0.00',
  `credit_amount` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Journal entry line items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entry_line`
--

LOCK TABLES `journal_entry_line` WRITE;
/*!40000 ALTER TABLE `journal_entry_line` DISABLE KEYS */;
/*!40000 ALTER TABLE `journal_entry_line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `lesson_number` int unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Lesson content/notes',
  `learning_outcomes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration_minutes` int unsigned DEFAULT NULL,
  `lesson_type` enum('lecture','video','reading','quiz','assignment','practical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'lecture',
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resources` json DEFAULT NULL COMMENT 'Additional resources',
  `is_published` tinyint(1) DEFAULT '0',
  `publish_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Course lessons and topics';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `library_book`
--

DROP TABLE IF EXISTS `library_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_book` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publication_year` year DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., Fiction, Science, History',
  `total_copies` int unsigned DEFAULT '1',
  `available_copies` int unsigned DEFAULT '1',
  `book_location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Shelf/rack location',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Library book catalog';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `library_book`
--

LOCK TABLES `library_book` WRITE;
/*!40000 ALTER TABLE `library_book` DISABLE KEYS */;
/*!40000 ALTER TABLE `library_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `library_transaction`
--

DROP TABLE IF EXISTS `library_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_transaction` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `book_id` bigint unsigned NOT NULL,
  `borrower_type` enum('student','teacher','staff') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `borrower_id` bigint unsigned NOT NULL COMMENT 'Student or User ID',
  `borrowed_date` date NOT NULL,
  `due_date` date NOT NULL,
  `returned_date` date DEFAULT NULL,
  `status` enum('borrowed','returned','overdue','lost') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'borrowed',
  `fine_amount` decimal(10,2) DEFAULT '0.00',
  `fine_paid` tinyint(1) DEFAULT '0',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `issued_by` bigint unsigned DEFAULT NULL,
  `received_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Book borrowing transactions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `library_transaction`
--

LOCK TABLES `library_transaction` WRITE;
/*!40000 ALTER TABLE `library_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `library_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `living_statuses`
--

DROP TABLE IF EXISTS `living_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `living_statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `living_statuses`
--

LOCK TABLES `living_statuses` WRITE;
/*!40000 ALTER TABLE `living_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `living_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned NOT NULL,
  `recipient_id` bigint unsigned DEFAULT NULL COMMENT 'NULL for group messages',
  `conversation_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'For threading messages',
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('direct','group','announcement') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'direct',
  `priority` enum('normal','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `attachments` json DEFAULT NULL COMMENT 'Array of file URLs',
  `parent_message_id` bigint unsigned DEFAULT NULL COMMENT 'For reply threading',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Internal messaging system';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nationalities`
--

DROP TABLE IF EXISTS `nationalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nationalities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nationalities`
--

LOCK TABLES `nationalities` WRITE;
/*!40000 ALTER TABLE `nationalities` DISABLE KEYS */;
/*!40000 ALTER TABLE `nationalities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned DEFAULT NULL COMMENT 'NULL for system-wide notifications',
  `user_id` bigint unsigned DEFAULT NULL COMMENT 'Specific user, NULL for broadcast',
  `recipient_type` enum('user','role','class','all') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `recipient_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'User ID, role slug, or class ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('info','success','warning','error','announcement') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `priority` enum('low','medium','high','urgent') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., fees, exams, attendance, general',
  `action_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Link to relevant page',
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System notifications';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_steps`
--

DROP TABLE IF EXISTS `onboarding_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_steps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `step_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `step_order` int NOT NULL DEFAULT '0',
  `status` enum('pending','in_progress','completed','skipped') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `step_data` json DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_step` (`user_id`,`step_name`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_step_order` (`user_id`,`step_order`),
  KEY `idx_onboarding_user_status` (`user_id`,`status`),
  CONSTRAINT `onboarding_steps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tracks user onboarding progress step by step';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_steps`
--

LOCK TABLES `onboarding_steps` WRITE;
/*!40000 ALTER TABLE `onboarding_steps` DISABLE KEYS */;
INSERT INTO `onboarding_steps` VALUES (33,6,'school_setup',1,'completed','{\"city\": \"Kampala\", \"email\": \"\", \"phone\": \"0741341483\", \"address\": \"\", \"country\": \"Uganda\", \"website\": \"\", \"school_name\": \"Mandela College School\", \"school_type\": \"primary\"}',NULL,'2025-12-17 09:14:47','2025-12-06 10:07:15','2025-12-17 09:14:47'),(34,6,'admin_profile',2,'completed','{\"city\": \"Kampala\", \"phone\": \"0757000154\", \"address\": \"Kampala\", \"country\": \"Uganda\", \"language\": \"en\", \"timezone\": \"Africa/Kampala\", \"full_name\": \"mandelacollege@gmail.com\"}',NULL,'2025-12-17 09:15:11','2025-12-06 10:07:15','2025-12-17 09:15:11'),(35,6,'payment_plan',3,'completed','{\"plan_id\": 13, \"is_trial\": true, \"selected_at\": \"2025-12-07T14:05:25.251Z\", \"billing_cycle\": \"trial\"}',NULL,'2025-12-07 14:05:25','2025-12-06 10:07:15','2025-12-07 14:05:25'),(36,6,'review_confirm',4,'completed','{\"confirmed\": true, \"confirmedAt\": \"2025-12-17T09:15:12.610Z\"}',NULL,'2025-12-17 09:15:13','2025-12-06 10:07:15','2025-12-17 09:15:13'),(37,7,'school_setup',1,'completed','{\"city\": \"hh\", \"email\": \"\", \"phone\": \"h\", \"address\": \"nh\", \"country\": \"Uganda\", \"website\": \"\", \"school_name\": \"hhh\", \"school_type\": \"primary\"}',NULL,'2025-12-06 12:34:45','2025-12-06 12:19:33','2025-12-06 12:34:45'),(38,7,'admin_profile',2,'completed','{\"city\": \"hjhj\", \"phone\": \"fhj\", \"address\": \"khjgj\", \"country\": \"khtgf\", \"language\": \"en\", \"timezone\": \"Africa/Kampala\", \"full_name\": \"jhg\"}',NULL,'2025-12-06 12:34:55','2025-12-06 12:19:33','2025-12-06 12:34:55'),(39,7,'payment_plan',3,'completed','{\"plan_id\": 13, \"is_trial\": true, \"selected_at\": \"2025-12-06T12:24:03.941Z\", \"billing_cycle\": \"yearly\"}',NULL,'2025-12-06 12:24:04','2025-12-06 12:19:33','2025-12-06 12:24:04'),(40,7,'review_confirm',4,'completed','{\"confirmed\": true, \"confirmedAt\": \"2025-12-06T12:35:19.594Z\"}',NULL,'2025-12-06 12:35:20','2025-12-06 12:19:33','2025-12-06 12:35:20'),(41,8,'school_setup',1,'pending',NULL,NULL,NULL,'2025-12-06 12:46:09',NULL),(42,8,'admin_profile',2,'pending',NULL,NULL,NULL,'2025-12-06 12:46:09',NULL),(43,8,'payment_plan',3,'pending',NULL,NULL,NULL,'2025-12-06 12:46:09',NULL),(44,8,'review_confirm',4,'pending',NULL,NULL,NULL,'2025-12-06 12:46:09',NULL),(45,9,'school_setup',1,'completed','{\"city\": \"ijhghjk\", \"email\": \"\", \"phone\": \"\", \"address\": \"bulun\", \"country\": \"Uganda\", \"website\": \"\", \"school_name\": \"Albayan\", \"school_type\": \"primary\"}',NULL,'2025-12-06 12:56:58','2025-12-06 12:56:35','2025-12-06 12:56:58'),(46,9,'admin_profile',2,'completed','{\"city\": \"hgfsd\", \"phone\": \"0745774879\", \"address\": \"ight\", \"country\": \"Uganda\", \"language\": \"en\", \"timezone\": \"Africa/Kampala\", \"full_name\": \"joun\"}',NULL,'2025-12-06 12:57:19','2025-12-06 12:56:35','2025-12-06 12:57:19'),(47,9,'payment_plan',3,'completed','{\"plan_id\": 13, \"is_trial\": true, \"selected_at\": \"2025-12-06T12:57:46.404Z\", \"billing_cycle\": \"trial\"}',NULL,'2025-12-06 12:57:46','2025-12-06 12:56:35','2025-12-06 12:57:46'),(48,9,'review_confirm',4,'completed','{\"confirmed\": true, \"confirmedAt\": \"2025-12-06T12:57:50.179Z\"}',NULL,'2025-12-06 12:57:50','2025-12-06 12:56:35','2025-12-06 12:57:50'),(49,10,'school_setup',1,'completed','{\"city\": \"Kampala\", \"email\": \"\", \"phone\": \"\", \"address\": \"Matugga\", \"country\": \"Uganda\", \"website\": \"\", \"school_name\": \"Ibun Hamis Secondary School\", \"school_type\": \"secondary\"}',NULL,'2025-12-10 21:36:53','2025-12-10 21:36:22','2025-12-10 21:36:53'),(50,10,'admin_profile',2,'completed','{\"city\": \"timba\", \"phone\": \"0741447879\", \"address\": \"Iganga\", \"country\": \"Uganda\", \"language\": \"en\", \"timezone\": \"Africa/Kampala\", \"full_name\": \"Namuyaba Halima\"}',NULL,'2025-12-10 21:37:25','2025-12-10 21:36:22','2025-12-10 21:37:25'),(51,10,'payment_plan',3,'completed','{\"plan_id\": 13, \"is_trial\": true, \"selected_at\": \"2025-12-10T21:37:40.410Z\", \"billing_cycle\": \"trial\"}',NULL,'2025-12-10 21:37:40','2025-12-10 21:36:22','2025-12-10 21:37:40'),(52,10,'review_confirm',4,'completed','{\"confirmed\": true, \"confirmedAt\": \"2025-12-10T21:37:43.740Z\"}',NULL,'2025-12-10 21:37:44','2025-12-10 21:36:22','2025-12-10 21:37:44');
/*!40000 ALTER TABLE `onboarding_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orphan_statuses`
--

DROP TABLE IF EXISTS `orphan_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orphan_statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orphan_statuses`
--

LOCK TABLES `orphan_statuses` WRITE;
/*!40000 ALTER TABLE `orphan_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `orphan_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parishes`
--

DROP TABLE IF EXISTS `parishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parishes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `subcounty_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parishes`
--

LOCK TABLES `parishes` WRITE;
/*!40000 ALTER TABLE `parishes` DISABLE KEYS */;
/*!40000 ALTER TABLE `parishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `invoice_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','mobile_money','cheque','card') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Transaction ID from payment gateway',
  `payment_date` datetime NOT NULL,
  `status` enum('pending','completed','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `paid_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Name of person who paid',
  `phone_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `processed_by` bigint unsigned DEFAULT NULL COMMENT 'User who processed payment',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment transactions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `method_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method_type` enum('cash','bank_transfer','mobile_money','cheque','card','other') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `account_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bank account or mobile money number',
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bank name or MM provider',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,2,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(2,3,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(3,4,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(4,5,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(5,6,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(6,7,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(7,8,'Cash Payment','cash',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(8,2,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(9,3,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(10,4,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(11,5,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(12,6,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(13,7,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(14,8,'Bank Transfer','bank_transfer','1234567890','School Account','ABC Bank',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(15,2,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(16,3,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(17,4,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(18,5,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(19,6,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(20,7,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(21,8,'Mobile Money','mobile_money','0712345678','School MM','M-Pesa',1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(22,2,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(23,3,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(24,4,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(25,5,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(26,6,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(27,7,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10'),(28,8,'Cheque','cheque',NULL,NULL,NULL,1,'2025-12-11 13:16:10','2025-12-11 13:16:10');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_plan`
--

DROP TABLE IF EXISTS `payment_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_plan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `number_of_installments` int unsigned NOT NULL,
  `installment_amount` decimal(10,2) NOT NULL,
  `frequency` enum('weekly','biweekly','monthly') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `start_date` date NOT NULL,
  `status` enum('active','completed','defaulted','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student payment plans';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_plan`
--

LOCK TABLES `payment_plan` WRITE;
/*!40000 ALTER TABLE `payment_plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_plans`
--

DROP TABLE IF EXISTS `payment_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `plan_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `price_monthly` decimal(10,2) NOT NULL DEFAULT '0.00',
  `price_yearly` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'UGX',
  `trial_period_days` int DEFAULT '0',
  `max_students` int DEFAULT NULL,
  `max_staff` int DEFAULT NULL,
  `max_schools` int DEFAULT '1',
  `features` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_trial` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_name` (`plan_name`),
  UNIQUE KEY `plan_code` (`plan_code`),
  KEY `idx_active` (`is_active`),
  KEY `idx_trial` (`is_trial`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Available subscription plans and pricing';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_plans`
--

LOCK TABLES `payment_plans` WRITE;
/*!40000 ALTER TABLE `payment_plans` DISABLE KEYS */;
INSERT INTO `payment_plans` VALUES (13,'Free Trial','trial','30-day free trial with full features',0.00,0.00,'UGX',30,50,10,1,'[\"Student Management\", \"Basic Reports\", \"SMS Notifications\", \"Email Support\"]',1,1,1,'2025-12-06 10:41:39',NULL),(14,'Starter','starter','Perfect for small schools',150000.00,1500000.00,'UGX',0,200,20,1,'[\"Student Management\", \"Fee Management\", \"Basic Reports\", \"SMS & Email\", \"Priority Support\"]',1,0,2,'2025-12-06 10:41:39',NULL),(15,'Professional','professional','Best for growing institutions',350000.00,3500000.00,'UGX',0,500,50,1,'[\"All Starter Features\", \"Exam Management\", \"Advanced Reports\", \"Attendance Tracking\", \"Library Management\", \"WhatsApp Integration\"]',1,0,3,'2025-12-06 10:41:39',NULL),(16,'Enterprise','enterprise','Unlimited power for large schools',750000.00,7500000.00,'UGX',0,NULL,NULL,1,'[\"All Professional Features\", \"Unlimited Students\", \"Unlimited Staff\", \"AI Analytics\", \"Custom Branding\", \"Dedicated Support\", \"Multi-School Management\"]',1,0,4,'2025-12-06 10:41:39',NULL);
/*!40000 ALTER TABLE `payment_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_reminder`
--

DROP TABLE IF EXISTS `payment_reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_reminder` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `reminder_type` enum('sms','email','notification','all') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_due` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','sent','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment reminder logs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_reminder`
--

LOCK TABLES `payment_reminder` WRITE;
/*!40000 ALTER TABLE `payment_reminder` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_reminder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `staff_id` bigint unsigned NOT NULL,
  `pay_period_start` date NOT NULL,
  `pay_period_end` date NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `allowances` json DEFAULT NULL COMMENT 'Housing, transport, meal allowances',
  `bonuses` decimal(10,2) DEFAULT '0.00',
  `overtime_hours` decimal(5,2) DEFAULT '0.00',
  `overtime_pay` decimal(10,2) DEFAULT '0.00',
  `gross_salary` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) DEFAULT '0.00',
  `pension` decimal(10,2) DEFAULT '0.00',
  `insurance` decimal(10,2) DEFAULT '0.00',
  `loan_deduction` decimal(10,2) DEFAULT '0.00',
  `other_deductions` json DEFAULT NULL,
  `total_deductions` decimal(10,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) GENERATED ALWAYS AS ((`gross_salary` - `total_deductions`)) STORED,
  `payment_date` date DEFAULT NULL,
  `payment_method` enum('bank_transfer','cash','cheque','mobile_money') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','processed','paid','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `generated_by` bigint unsigned DEFAULT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payroll records';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll_definitions`
--

DROP TABLE IF EXISTS `payroll_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll_definitions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll_definitions`
--

LOCK TABLES `payroll_definitions` WRITE;
/*!40000 ALTER TABLE `payroll_definitions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payroll_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `people` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `other_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `given_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugin`
--

DROP TABLE IF EXISTS `plugin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugin` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned DEFAULT NULL COMMENT 'NULL for system-wide plugins',
  `plugin_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `settings` json DEFAULT NULL COMMENT 'Plugin-specific settings',
  `installed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugin_key` (`plugin_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Installed plugins and extensions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugin`
--

LOCK TABLES `plugin` WRITE;
/*!40000 ALTER TABLE `plugin` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order`
--

DROP TABLE IF EXISTS `purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `po_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('draft','submitted','approved','ordered','received','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `requested_by` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `terms_and_conditions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `po_number` (`po_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Purchase orders';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order`
--

LOCK TABLES `purchase_order` WRITE;
/*!40000 ALTER TABLE `purchase_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_item`
--

DROP TABLE IF EXISTS `purchase_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_order_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * `unit_cost`)) STORED,
  `quantity_received` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Purchase order line items';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_item`
--

LOCK TABLES `purchase_order_item` WRITE;
/*!40000 ALTER TABLE `purchase_order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `lesson_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `total_marks` decimal(5,2) NOT NULL,
  `pass_percentage` decimal(5,2) DEFAULT '50.00',
  `duration_minutes` int unsigned NOT NULL,
  `attempts_allowed` int unsigned DEFAULT '1',
  `shuffle_questions` tinyint(1) DEFAULT '1',
  `show_results` enum('immediately','after_due_date','manual') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'immediately',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Online quizzes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempt`
--

DROP TABLE IF EXISTS `quiz_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempt` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `attempt_number` int unsigned NOT NULL,
  `started_at` timestamp NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `time_taken_minutes` int unsigned DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT NULL,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `status` enum('in_progress','completed','abandoned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'in_progress',
  `answers` json DEFAULT NULL COMMENT 'Student answers',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student quiz attempts';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempt`
--

LOCK TABLES `quiz_attempt` WRITE;
/*!40000 ALTER TABLE `quiz_attempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_question`
--

DROP TABLE IF EXISTS `quiz_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_question` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint unsigned NOT NULL,
  `question_number` int unsigned NOT NULL,
  `question_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_type` enum('multiple_choice','true_false','short_answer','essay') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` json DEFAULT NULL COMMENT 'For multiple choice',
  `correct_answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `marks` decimal(5,2) NOT NULL,
  `explanation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quiz questions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_question`
--

LOCK TABLES `quiz_question` WRITE;
/*!40000 ALTER TABLE `quiz_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `transaction_id` bigint unsigned NOT NULL,
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receipt_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Path to PDF',
  `generated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `generated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_receipt_number` (`receipt_number`,`school_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_receipt_date` (`receipt_date`),
  KEY `generated_by` (`generated_by`),
  CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `receipts_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `receipts_ibfk_3` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `receipts_ibfk_4` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_card_metrics`
--

DROP TABLE IF EXISTS `report_card_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_card_metrics` (
  `report_card_id` bigint NOT NULL,
  `total_score` decimal(7,2) DEFAULT NULL,
  `average_score` decimal(5,2) DEFAULT NULL,
  `min_score` decimal(5,2) DEFAULT NULL,
  `max_score` decimal(5,2) DEFAULT NULL,
  `position` int DEFAULT NULL,
  `promoted` tinyint(1) DEFAULT '0',
  `promotion_class_id` bigint DEFAULT NULL,
  `computed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_card_metrics`
--

LOCK TABLES `report_card_metrics` WRITE;
/*!40000 ALTER TABLE `report_card_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_card_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_card_subjects`
--

DROP TABLE IF EXISTS `report_card_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_card_subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `report_card_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `total_score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_card_subjects`
--

LOCK TABLES `report_card_subjects` WRITE;
/*!40000 ALTER TABLE `report_card_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_card_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_cards`
--

DROP TABLE IF EXISTS `report_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `term_id` bigint NOT NULL,
  `overall_grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `class_teacher_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `headteacher_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `dos_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_cards`
--

LOCK TABLES `report_cards` WRITE;
/*!40000 ALTER TABLE `report_cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requirements_master`
--

DROP TABLE IF EXISTS `requirements_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requirements_master` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requirements_master`
--

LOCK TABLES `requirements_master` WRITE;
/*!40000 ALTER TABLE `requirements_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `requirements_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result_types`
--

DROP TABLE IF EXISTS `result_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `weight` decimal(5,2) DEFAULT NULL,
  `deadline` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result_types`
--

LOCK TABLES `result_types` WRITE;
/*!40000 ALTER TABLE `result_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `result_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `exam_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route_stop`
--

DROP TABLE IF EXISTS `route_stop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route_stop` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `route_id` bigint unsigned NOT NULL,
  `stop_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stop_order` int unsigned NOT NULL,
  `pickup_time` time DEFAULT NULL,
  `dropoff_time` time DEFAULT NULL,
  `landmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Route pickup/dropoff stops';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route_stop`
--

LOCK TABLES `route_stop` WRITE;
/*!40000 ALTER TABLE `route_stop` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_stop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_report`
--

DROP TABLE IF EXISTS `saved_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_report` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `report_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g., income_statement, balance_sheet, attendance',
  `report_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameters` json DEFAULT NULL COMMENT 'Report generation parameters',
  `file_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_format` enum('pdf','excel','csv') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'Auto-delete old reports',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Generated and saved reports';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_report`
--

LOCK TABLES `saved_report` WRITE;
/*!40000 ALTER TABLE `saved_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_settings`
--

DROP TABLE IF EXISTS `school_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `key_name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_settings`
--

LOCK TABLES `school_settings` WRITE;
/*!40000 ALTER TABLE `school_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `school_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legal_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `short_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'UGX',
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `region` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registration_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_type` enum('primary','secondary','primary_secondary','tertiary','vocational') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'primary',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `subscription_plan` enum('trial','professional','premium','gold') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'trial',
  `subscription_status` enum('active','suspended','cancelled','trial') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'trial',
  `subscription_start_date` date DEFAULT NULL,
  `subscription_end_date` date DEFAULT NULL,
  `owner_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `owner_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `owner_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Africa/Kampala',
  `academic_year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_format` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'DD/MM/YYYY',
  `modules_enabled` json DEFAULT NULL COMMENT 'Array of enabled module IDs',
  `settings` json DEFAULT NULL COMMENT 'School-specific settings',
  PRIMARY KEY (`id`),
  UNIQUE KEY `school_code` (`school_code`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Multi-school setup - each user can manage multiple schools';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (2,NULL,'Alhanan Education center',NULL,NULL,NULL,'alhanan@gmail.com','0744548779','UGX','Bulubandi',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-06 10:31:45',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(3,NULL,'Alhanan Education centre',NULL,NULL,NULL,'alhanan@gmail.com','0741441445','UGX','Bulubandi',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-06 12:20:19',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(4,NULL,'Alhanan Education centre',NULL,NULL,NULL,NULL,NULL,'UGX','Bulubandi',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-06 12:26:34',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(5,NULL,'hhh',NULL,NULL,NULL,NULL,'h','UGX','nh',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-06 12:34:45',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(6,NULL,'Albayan',NULL,NULL,NULL,NULL,NULL,'UGX','bulun',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-06 12:56:58',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(7,NULL,'Tawheed Primary School',NULL,NULL,NULL,'Tawheed@gmail.com','0705091765','UGX','Nabidongha C, Iganga Central Division',NULL,NULL,NULL,NULL,NULL,'primary','2025-12-07 14:04:26',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(8,NULL,'Ibun Hamis Secondary School',NULL,NULL,NULL,NULL,NULL,'UGX','Matugga',NULL,NULL,NULL,NULL,NULL,'secondary','2025-12-10 21:36:53',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(9,NULL,'Mandela College School',NULL,NULL,NULL,'mcs@gmail.com','0741341483','UGX','Namboole, bweyogerere, Kira, Wakiso',NULL,NULL,NULL,NULL,NULL,'secondary','2025-12-17 09:13:34',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL),(10,NULL,'Mandela College School',NULL,NULL,NULL,NULL,'0741341483','UGX',NULL,NULL,NULL,NULL,NULL,NULL,'primary','2025-12-17 09:14:47',NULL,NULL,'trial','trial',NULL,NULL,NULL,NULL,NULL,'Africa/Kampala',NULL,'DD/MM/YYYY',NULL,NULL);
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms_log`
--

DROP TABLE IF EXISTS `sms_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sms_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `recipient_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_user_id` bigint unsigned DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','sent','failed','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `sms_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'e.g., africastalking, twilio',
  `provider_message_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` decimal(8,4) DEFAULT '0.0000',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sent_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SMS sending logs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_log`
--

LOCK TABLES `sms_log` WRITE;
/*!40000 ALTER TABLE `sms_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `sms_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `person_id` bigint NOT NULL,
  `staff_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_appraisal`
--

DROP TABLE IF EXISTS `staff_appraisal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_appraisal` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `staff_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `appraisal_date` date NOT NULL,
  `teaching_quality` decimal(2,1) DEFAULT NULL,
  `student_engagement` decimal(2,1) DEFAULT NULL,
  `professionalism` decimal(2,1) DEFAULT NULL,
  `punctuality` decimal(2,1) DEFAULT NULL,
  `teamwork` decimal(2,1) DEFAULT NULL,
  `innovation` decimal(2,1) DEFAULT NULL,
  `overall_rating` decimal(2,1) DEFAULT NULL,
  `strengths` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `areas_for_improvement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `goals` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `appraiser_comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `staff_comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `appraised_by` bigint unsigned NOT NULL,
  `status` enum('draft','submitted','acknowledged','disputed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff performance appraisals';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_appraisal`
--

LOCK TABLES `staff_appraisal` WRITE;
/*!40000 ALTER TABLE `staff_appraisal` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_appraisal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_attendance`
--

DROP TABLE IF EXISTS `staff_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `staff_id` bigint NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'present',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_attendance`
--

LOCK TABLES `staff_attendance` WRITE;
/*!40000 ALTER TABLE `staff_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_leave`
--

DROP TABLE IF EXISTS `staff_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_leave` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `staff_id` bigint unsigned NOT NULL,
  `leave_type` enum('annual','sick','maternity','paternity','unpaid','study','compassionate','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int unsigned NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Staff leave applications';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_leave`
--

LOCK TABLES `staff_leave` WRITE;
/*!40000 ALTER TABLE `staff_leave` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_leave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_salaries`
--

DROP TABLE IF EXISTS `staff_salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_salaries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `staff_id` bigint NOT NULL,
  `month` year DEFAULT NULL,
  `period_month` tinyint DEFAULT NULL,
  `definition_id` bigint NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_salaries`
--

LOCK TABLES `staff_salaries` WRITE;
/*!40000 ALTER TABLE `staff_salaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movement`
--

DROP TABLE IF EXISTS `stock_movement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movement` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `movement_type` enum('purchase','issue','return','adjustment','damage','loss') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_cost` decimal(10,2) DEFAULT NULL,
  `total_cost` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * `unit_cost`)) STORED,
  `transaction_date` date NOT NULL,
  `reference_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_to` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Department or person',
  `issued_by` bigint unsigned DEFAULT NULL,
  `quantity_before` decimal(10,2) DEFAULT NULL,
  `quantity_after` decimal(10,2) DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stock movement history';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movement`
--

LOCK TABLES `stock_movement` WRITE;
/*!40000 ALTER TABLE `stock_movement` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_movement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streams`
--

DROP TABLE IF EXISTS `streams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `class_id` bigint NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streams`
--

LOCK TABLES `streams` WRITE;
/*!40000 ALTER TABLE `streams` DISABLE KEYS */;
/*!40000 ALTER TABLE `streams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint DEFAULT NULL,
  `person_id` bigint NOT NULL,
  `class_id` int DEFAULT NULL,
  `theology_class_id` int DEFAULT NULL,
  `admission_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `village_id` bigint DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_account`
--

DROP TABLE IF EXISTS `student_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_account` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `school_id` bigint NOT NULL,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `total_fees` decimal(10,2) DEFAULT '0.00',
  `amount_paid` decimal(10,2) DEFAULT '0.00',
  `balance` decimal(10,2) DEFAULT '0.00',
  `last_payment_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_term` (`student_id`,`school_id`,`term`,`year`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_term_year` (`term`,`year`),
  KEY `idx_balance` (`balance`),
  CONSTRAINT `student_account_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_account_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_account`
--

LOCK TABLES `student_account` WRITE;
/*!40000 ALTER TABLE `student_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_attendance`
--

DROP TABLE IF EXISTS `student_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'present',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance`
--

LOCK TABLES `student_attendance` WRITE;
/*!40000 ALTER TABLE `student_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_contacts`
--

DROP TABLE IF EXISTS `student_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_contacts` (
  `student_id` bigint NOT NULL,
  `contact_id` bigint NOT NULL,
  `relationship` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_contacts`
--

LOCK TABLES `student_contacts` WRITE;
/*!40000 ALTER TABLE `student_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_curriculums`
--

DROP TABLE IF EXISTS `student_curriculums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_curriculums` (
  `student_id` bigint NOT NULL,
  `curriculum_id` tinyint NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_curriculums`
--

LOCK TABLES `student_curriculums` WRITE;
/*!40000 ALTER TABLE `student_curriculums` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_curriculums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_education_levels`
--

DROP TABLE IF EXISTS `student_education_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_education_levels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `education_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `level_name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `institution` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year_completed` year DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_education_levels`
--

LOCK TABLES `student_education_levels` WRITE;
/*!40000 ALTER TABLE `student_education_levels` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_education_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_family_status`
--

DROP TABLE IF EXISTS `student_family_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_family_status` (
  `student_id` bigint NOT NULL,
  `orphan_status_id` tinyint DEFAULT NULL,
  `primary_guardian_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primary_guardian_contact` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primary_guardian_occupation` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `father_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `father_living_status_id` tinyint DEFAULT NULL,
  `father_occupation` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `father_contact` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_family_status`
--

LOCK TABLES `student_family_status` WRITE;
/*!40000 ALTER TABLE `student_family_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_family_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_fee_discount`
--

DROP TABLE IF EXISTS `student_fee_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_fee_discount` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `fee_discount_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student discount assignments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_fee_discount`
--

LOCK TABLES `student_fee_discount` WRITE;
/*!40000 ALTER TABLE `student_fee_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_fee_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_fees`
--

DROP TABLE IF EXISTS `student_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_fees` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `school_id` bigint NOT NULL,
  `fee_item_id` bigint unsigned NOT NULL,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `amount` decimal(10,2) NOT NULL COMMENT 'Actual amount (may differ from default)',
  `status` enum('pending','partial','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `allocated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `allocated_by` bigint DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_fee` (`student_id`,`fee_item_id`,`term`,`year`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_fee_item_id` (`fee_item_id`),
  KEY `idx_term_year` (`term`,`year`),
  KEY `idx_status` (`status`),
  KEY `allocated_by` (`allocated_by`),
  CONSTRAINT `student_fees_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_fees_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_fees_ibfk_3` FOREIGN KEY (`fee_item_id`) REFERENCES `fee_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_fees_ibfk_4` FOREIGN KEY (`allocated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_fees`
--

LOCK TABLES `student_fees` WRITE;
/*!40000 ALTER TABLE `student_fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_hafz_progress_summary`
--

DROP TABLE IF EXISTS `student_hafz_progress_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_hafz_progress_summary` (
  `student_id` bigint NOT NULL,
  `juz_memorized` int DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_hafz_progress_summary`
--

LOCK TABLES `student_hafz_progress_summary` WRITE;
/*!40000 ALTER TABLE `student_hafz_progress_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_hafz_progress_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_next_of_kin`
--

DROP TABLE IF EXISTS `student_next_of_kin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_next_of_kin` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `sequence` tinyint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `occupation` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_next_of_kin`
--

LOCK TABLES `student_next_of_kin` WRITE;
/*!40000 ALTER TABLE `student_next_of_kin` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_next_of_kin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_profiles` (
  `student_id` bigint NOT NULL,
  `place_of_birth` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `place_of_residence` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  `nationality_id` int DEFAULT NULL,
  `passport_document_id` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_profiles`
--

LOCK TABLES `student_profiles` WRITE;
/*!40000 ALTER TABLE `student_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_requirements`
--

DROP TABLE IF EXISTS `student_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_requirements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `term_id` bigint NOT NULL,
  `requirement_id` bigint NOT NULL,
  `brought` tinyint(1) DEFAULT '0',
  `date_reported` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_requirements`
--

LOCK TABLES `student_requirements` WRITE;
/*!40000 ALTER TABLE `student_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_transport`
--

DROP TABLE IF EXISTS `student_transport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_transport` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `route_id` bigint unsigned NOT NULL,
  `stop_id` bigint unsigned NOT NULL,
  `academic_term_id` bigint unsigned NOT NULL,
  `status` enum('active','suspended','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student transport assignments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_transport`
--

LOCK TABLES `student_transport` WRITE;
/*!40000 ALTER TABLE `student_transport` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_transport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcounties`
--

DROP TABLE IF EXISTS `subcounties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcounties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `county_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcounties`
--

LOCK TABLES `subcounties` WRITE;
/*!40000 ALTER TABLE `subcounties` DISABLE KEYS */;
/*!40000 ALTER TABLE `subcounties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'core',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_attendance_enhanced`
--

DROP TABLE IF EXISTS `tahfiz_attendance_enhanced`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_attendance_enhanced` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `group_id` bigint NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused','sick','present_no_recitation') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'present',
  `arrival_time` time DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `recitation_submitted` tinyint(1) DEFAULT '0' COMMENT 'Did student recite today?',
  `reason_for_absence` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `recorded_by_teacher_id` bigint DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced Tahfiz attendance with recitation status';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_attendance_enhanced`
--

LOCK TABLES `tahfiz_attendance_enhanced` WRITE;
/*!40000 ALTER TABLE `tahfiz_attendance_enhanced` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_attendance_enhanced` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_ayat_map`
--

DROP TABLE IF EXISTS `tahfiz_book_ayat_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_ayat_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `surah_number` tinyint NOT NULL,
  `ayah_number` smallint NOT NULL,
  `ayah_text_arabic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ayah_text_transliteration` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ayah_text_translation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'English or local language',
  `page_number` smallint NOT NULL,
  `juz_number` tinyint NOT NULL,
  `hizb_number` tinyint DEFAULT NULL,
  `quarter_number` smallint DEFAULT NULL,
  `sajda_type` enum('recommended','obligatory') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sequence_in_quran` smallint NOT NULL COMMENT 'Global ayah number (1-6236)',
  `word_count` tinyint DEFAULT NULL,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Tajweed rules, recitation notes',
  PRIMARY KEY (`id`),
  CONSTRAINT `tahfiz_book_ayat_map_chk_1` CHECK (json_valid(`metadata_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Complete ayat repository (6236 verses)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_ayat_map`
--

LOCK TABLES `tahfiz_book_ayat_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_ayat_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_ayat_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_hizb_map`
--

DROP TABLE IF EXISTS `tahfiz_book_hizb_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_hizb_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `hizb_number` tinyint NOT NULL,
  `juz_number` tinyint NOT NULL,
  `start_surah` tinyint NOT NULL,
  `start_ayah` smallint NOT NULL,
  `end_surah` tinyint NOT NULL,
  `end_ayah` smallint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Hizb divisions (60 parts, 2 per juz)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_hizb_map`
--

LOCK TABLES `tahfiz_book_hizb_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_hizb_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_hizb_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_juz_map`
--

DROP TABLE IF EXISTS `tahfiz_book_juz_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_juz_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `juz_number` tinyint NOT NULL,
  `start_surah` tinyint NOT NULL,
  `start_ayah` smallint NOT NULL,
  `end_surah` tinyint NOT NULL,
  `end_ayah` smallint NOT NULL,
  `start_page` smallint DEFAULT NULL,
  `end_page` smallint DEFAULT NULL,
  `total_ayat` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Juz divisions (30 parts of Quran)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_juz_map`
--

LOCK TABLES `tahfiz_book_juz_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_juz_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_juz_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_page_map`
--

DROP TABLE IF EXISTS `tahfiz_book_page_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_page_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `page_number` smallint NOT NULL,
  `paper_number` smallint DEFAULT NULL COMMENT 'Physical paper (page_number / 2)',
  `juz_number` tinyint NOT NULL,
  `hizb_number` tinyint DEFAULT NULL,
  `start_surah` tinyint NOT NULL,
  `start_ayah` smallint NOT NULL,
  `end_surah` tinyint NOT NULL,
  `end_ayah` smallint NOT NULL,
  `total_ayat_on_page` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Page-by-page mapping (604 pages)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_page_map`
--

LOCK TABLES `tahfiz_book_page_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_page_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_page_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_quarter_map`
--

DROP TABLE IF EXISTS `tahfiz_book_quarter_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_quarter_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `quarter_number` smallint NOT NULL,
  `hizb_number` tinyint NOT NULL,
  `juz_number` tinyint NOT NULL,
  `start_surah` tinyint NOT NULL,
  `start_ayah` smallint NOT NULL,
  `end_surah` tinyint NOT NULL,
  `end_ayah` smallint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Quarter divisions (120 parts, Rub al-Hizb)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_quarter_map`
--

LOCK TABLES `tahfiz_book_quarter_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_quarter_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_quarter_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_sections`
--

DROP TABLE IF EXISTS `tahfiz_book_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_sections` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `parent_section_id` bigint DEFAULT NULL COMMENT 'For nested hierarchy (e.g., juz → surah → ayah)',
  `section_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'surah, juz, hizb, quarter, page, paper, chapter, baab, topic, bait, ayah',
  `section_number` int NOT NULL COMMENT 'Numeric identifier (e.g., Surah 1, Juz 15, Page 302)',
  `section_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Name if applicable (e.g., Al-Fatihah, Introduction)',
  `arabic_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Starting point (e.g., "Surah 1 Ayah 1", "Page 1 Line 3")',
  `end_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Actual text content for small sections (optional)',
  `unit_count` int DEFAULT NULL COMMENT 'How many sub-units (e.g., 7 ayat in Al-Fatihah)',
  `sequence_order` int DEFAULT '0',
  `difficulty_level` enum('easy','medium','hard') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'medium',
  `estimated_study_minutes` int DEFAULT NULL,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `tahfiz_book_sections_chk_1` CHECK (json_valid(`metadata_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Hierarchical content sections for any book type';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_sections`
--

LOCK TABLES `tahfiz_book_sections` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_sections` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_structure_definitions`
--

DROP TABLE IF EXISTS `tahfiz_book_structure_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_structure_definitions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL,
  `structure_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'surah, juz, hizb, quarter, page, paper, chapter, baab, topic, subtopic',
  `total_count` int NOT NULL COMMENT 'Total number of this structure type in the book',
  `sequence_order` int DEFAULT '0',
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  CONSTRAINT `tahfiz_book_structure_definitions_chk_1` CHECK (json_valid(`metadata_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Defines what structural elements a book contains';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_structure_definitions`
--

LOCK TABLES `tahfiz_book_structure_definitions` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_structure_definitions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_structure_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_surah_map`
--

DROP TABLE IF EXISTS `tahfiz_book_surah_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_surah_map` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `book_id` bigint NOT NULL COMMENT 'Links to Quran book record',
  `surah_number` tinyint NOT NULL,
  `surah_name_arabic` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `surah_name_english` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `surah_name_transliteration` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `revelation_place` enum('makkah','madinah') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_ayat` smallint NOT NULL,
  `start_page` smallint DEFAULT NULL,
  `end_page` smallint DEFAULT NULL,
  `start_juz` tinyint DEFAULT NULL,
  `end_juz` tinyint DEFAULT NULL,
  `sequence_order` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Surah metadata for Quran';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_surah_map`
--

LOCK TABLES `tahfiz_book_surah_map` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_surah_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_surah_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_book_types`
--

DROP TABLE IF EXISTS `tahfiz_book_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_book_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'quran, yassarna, shatibiyyah, tuhfatul_atfaal, mutashabihat, etc',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `structure_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'hierarchical, linear, chapter-based, ayat-based',
  `supports_surah` tinyint(1) DEFAULT '0',
  `supports_juz` tinyint(1) DEFAULT '0',
  `supports_pages` tinyint(1) DEFAULT '1',
  `supports_abyat` tinyint(1) DEFAULT '0',
  `supports_topics` tinyint(1) DEFAULT '0',
  `requires_tajweed` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master table for all book types (Quran, Yassarna, poems, etc)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_book_types`
--

LOCK TABLES `tahfiz_book_types` WRITE;
/*!40000 ALTER TABLE `tahfiz_book_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_book_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_books_enhanced`
--

DROP TABLE IF EXISTS `tahfiz_books_enhanced`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_books_enhanced` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `book_type_id` bigint NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `arabic_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `author` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `total_units` int DEFAULT NULL COMMENT 'Total countable units (pages, verses, abyat)',
  `unit_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'page' COMMENT 'page, verse, bait, topic, line',
  `difficulty_level` enum('beginner','intermediate','advanced','expert') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'beginner',
  `estimated_completion_days` int DEFAULT NULL,
  `sequence_order` int DEFAULT '0' COMMENT 'Display order in lists',
  `is_active` tinyint(1) DEFAULT '1',
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Flexible storage for book-specific data',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `tahfiz_books_enhanced_chk_1` CHECK (json_valid(`metadata_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced books with full structural support';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_books_enhanced`
--

LOCK TABLES `tahfiz_books_enhanced` WRITE;
/*!40000 ALTER TABLE `tahfiz_books_enhanced` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_books_enhanced` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_completion_certificates`
--

DROP TABLE IF EXISTS `tahfiz_completion_certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_completion_certificates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `certificate_type` enum('section_completion','juz_completion','book_completion','hafidh_certification','ijazah') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'book_completion',
  `certificate_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Unique certificate ID',
  `issue_date` date NOT NULL,
  `issued_by_id` bigint NOT NULL COMMENT 'Authority who issued (e.g., Director, Sheikh)',
  `completion_date` date NOT NULL COMMENT 'When the book/section was completed',
  `total_duration_days` int DEFAULT NULL COMMENT 'How long it took to complete',
  `final_grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `distinction` enum('with_honors','with_distinction','pass','conditional') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificate_document_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'PDF/image of certificate',
  `verification_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'QR code or hash for authenticity',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `is_revoked` tinyint(1) DEFAULT '0',
  `revoked_at` timestamp NULL DEFAULT NULL,
  `revoke_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Completion certificates and Hafidh status';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_completion_certificates`
--

LOCK TABLES `tahfiz_completion_certificates` WRITE;
/*!40000 ALTER TABLE `tahfiz_completion_certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_completion_certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_daily_revisions`
--

DROP TABLE IF EXISTS `tahfiz_daily_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_daily_revisions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `revision_date` date NOT NULL,
  `portion_revised` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'What was revised',
  `section_id` bigint DEFAULT NULL,
  `revision_type` enum('juzu_darus','self_study','group_revision') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'juzu_darus',
  `presented_to_teacher` tinyint(1) DEFAULT '0',
  `teacher_id` bigint DEFAULT NULL,
  `quality_score` decimal(5,2) DEFAULT NULL COMMENT 'Teacher assessment if presented',
  `mistakes_count` int DEFAULT '0',
  `duration_minutes` int DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Daily light revision tracking (Juzu Darus)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_daily_revisions`
--

LOCK TABLES `tahfiz_daily_revisions` WRITE;
/*!40000 ALTER TABLE `tahfiz_daily_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_daily_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_evaluation_reports`
--

DROP TABLE IF EXISTS `tahfiz_evaluation_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_evaluation_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `evaluator_id` bigint NOT NULL,
  `evaluation_date` date NOT NULL,
  `evaluation_type` enum('weekly','monthly','quarterly','termly','annual','final_exam') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'monthly',
  `term_id` bigint DEFAULT NULL,
  `memorization_score` decimal(5,2) DEFAULT NULL,
  `tajweed_score` decimal(5,2) DEFAULT NULL,
  `fluency_score` decimal(5,2) DEFAULT NULL,
  `retention_score` decimal(5,2) DEFAULT NULL,
  `discipline_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'A, B, C, etc.',
  `rank_in_group` int DEFAULT NULL,
  `total_students_in_group` int DEFAULT NULL,
  `strengths` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `weaknesses` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `recommendations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `evaluator_comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `parent_notified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Periodic evaluation reports';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_evaluation_reports`
--

LOCK TABLES `tahfiz_evaluation_reports` WRITE;
/*!40000 ALTER TABLE `tahfiz_evaluation_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_evaluation_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_group_transfers`
--

DROP TABLE IF EXISTS `tahfiz_group_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_group_transfers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `from_group_id` bigint DEFAULT NULL,
  `to_group_id` bigint NOT NULL,
  `transfer_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transferred_by` bigint DEFAULT NULL COMMENT 'User/staff who initiated transfer',
  `transferred_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Track group transfers for students';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_group_transfers`
--

LOCK TABLES `tahfiz_group_transfers` WRITE;
/*!40000 ALTER TABLE `tahfiz_group_transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_group_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_groups_enhanced`
--

DROP TABLE IF EXISTS `tahfiz_groups_enhanced`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_groups_enhanced` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `arabic_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `primary_teacher_id` bigint NOT NULL,
  `assistant_teacher_id` bigint DEFAULT NULL,
  `target_book_id` bigint DEFAULT NULL COMMENT 'Primary book being studied',
  `proficiency_level` enum('beginner','intermediate','advanced','revision','hafidh') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'beginner',
  `max_capacity` int DEFAULT '30',
  `current_enrollment` int DEFAULT '0',
  `meeting_schedule` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Daily schedule description',
  `room_location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced Tahfiz study groups';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_groups_enhanced`
--

LOCK TABLES `tahfiz_groups_enhanced` WRITE;
/*!40000 ALTER TABLE `tahfiz_groups_enhanced` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_groups_enhanced` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_intensive_revisions`
--

DROP TABLE IF EXISTS `tahfiz_intensive_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_intensive_revisions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `revision_schedule_date` date NOT NULL,
  `actual_revision_date` date DEFAULT NULL,
  `portion_to_revise` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'E.g., "Juz 1-3", "Surah Al-Baqarah full"',
  `section_from_id` bigint DEFAULT NULL,
  `section_to_id` bigint DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  `status` enum('scheduled','in_progress','completed','postponed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  `completion_percentage` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `total_mistakes` int DEFAULT '0',
  `teacher_evaluation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `next_revision_date` date DEFAULT NULL COMMENT 'When next Muraaja should happen',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Scheduled intensive revision (Muraaja)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_intensive_revisions`
--

LOCK TABLES `tahfiz_intensive_revisions` WRITE;
/*!40000 ALTER TABLE `tahfiz_intensive_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_intensive_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_learner_enrollments`
--

DROP TABLE IF EXISTS `tahfiz_learner_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_learner_enrollments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `group_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `withdrawn_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','withdrawn','completed','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `withdrawal_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `starting_level` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'E.g., "Juz 1", "Page 1", "Beginner"',
  `target_completion_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Student enrollment in Tahfiz groups and books';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_learner_enrollments`
--

LOCK TABLES `tahfiz_learner_enrollments` WRITE;
/*!40000 ALTER TABLE `tahfiz_learner_enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_learner_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_learner_progress`
--

DROP TABLE IF EXISTS `tahfiz_learner_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_learner_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `enrollment_id` bigint DEFAULT NULL,
  `current_section_id` bigint DEFAULT NULL COMMENT 'Current surah/juz/page/topic being studied',
  `current_portion_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Human-readable current position',
  `total_completed_units` int DEFAULT '0' COMMENT 'Pages/verses/abyat completed',
  `total_units_in_book` int DEFAULT NULL,
  `completion_percentage` decimal(5,2) GENERATED ALWAYS AS ((case when (`total_units_in_book` > 0) then ((`total_completed_units` / `total_units_in_book`) * 100) else 0 end)) STORED,
  `start_date` date DEFAULT NULL,
  `expected_completion_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `status` enum('not_started','in_progress','under_revision','completed','certified') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'not_started',
  `mastery_level` enum('none','beginner','intermediate','proficient','master','hafidh') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'none',
  `last_recitation_date` date DEFAULT NULL,
  `last_revision_date` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master progress tracking per student per book';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_learner_progress`
--

LOCK TABLES `tahfiz_learner_progress` WRITE;
/*!40000 ALTER TABLE `tahfiz_learner_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_learner_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_lesson_revisions`
--

DROP TABLE IF EXISTS `tahfiz_lesson_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_lesson_revisions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `intensive_revision_id` bigint NOT NULL,
  `original_recitation_id` bigint DEFAULT NULL COMMENT 'Links back to when this was first learned',
  `section_id` bigint DEFAULT NULL,
  `portion_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `revision_quality` enum('excellent','good','fair','needs_work') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'good',
  `mistakes_count` int DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Individual lesson tracking within intensive revisions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_lesson_revisions`
--

LOCK TABLES `tahfiz_lesson_revisions` WRITE;
/*!40000 ALTER TABLE `tahfiz_lesson_revisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_lesson_revisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_mastery_validations`
--

DROP TABLE IF EXISTS `tahfiz_mastery_validations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_mastery_validations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `section_id` bigint NOT NULL COMMENT 'Section being validated (e.g., Juz 1)',
  `validation_date` date NOT NULL,
  `validator_id` bigint NOT NULL COMMENT 'Senior teacher or examiner',
  `validation_type` enum('section','juz','surah','full_book') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'section',
  `oral_test_score` decimal(5,2) DEFAULT NULL,
  `written_test_score` decimal(5,2) DEFAULT NULL,
  `tajweed_accuracy` decimal(5,2) DEFAULT NULL,
  `fluency_rating` decimal(5,2) DEFAULT NULL,
  `pass_status` enum('pending','passed','failed','conditional_pass') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `validator_feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `revalidation_required` tinyint(1) DEFAULT '0',
  `revalidation_date` date DEFAULT NULL,
  `certification_eligible` tinyint(1) DEFAULT '0' COMMENT 'Ready for certificate?',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Formal mastery validation tests';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_mastery_validations`
--

LOCK TABLES `tahfiz_mastery_validations` WRITE;
/*!40000 ALTER TABLE `tahfiz_mastery_validations` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_mastery_validations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_mistake_logs`
--

DROP TABLE IF EXISTS `tahfiz_mistake_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_mistake_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recitation_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `surah_number` tinyint DEFAULT NULL,
  `ayah_number` smallint DEFAULT NULL,
  `page_number` smallint DEFAULT NULL,
  `mistake_type` enum('tajweed','pronunciation','skipped_word','wrong_word','hesitation','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mistake_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `correction_provided` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `severity` enum('minor','moderate','major','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'minor',
  `recurring_mistake` tinyint(1) DEFAULT '0' COMMENT 'Flag if student makes this mistake repeatedly',
  `logged_by_teacher_id` bigint NOT NULL,
  `logged_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detailed mistake tracking per recitation';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_mistake_logs`
--

LOCK TABLES `tahfiz_mistake_logs` WRITE;
/*!40000 ALTER TABLE `tahfiz_mistake_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_mistake_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_portion_assignments`
--

DROP TABLE IF EXISTS `tahfiz_portion_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_portion_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `book_id` bigint NOT NULL,
  `section_id` bigint DEFAULT NULL COMMENT 'Links to tahfiz_book_sections',
  `assigned_by_teacher_id` bigint NOT NULL,
  `assignment_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `portion_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'E.g., "Surah Al-Baqarah Ayah 1-5", "Page 10"',
  `portion_type` enum('new_memorization','light_revision','intensive_revision','evaluation') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'new_memorization',
  `estimated_difficulty` enum('easy','medium','hard') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'medium',
  `status` enum('assigned','in_progress','completed','skipped','pending_evaluation') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'assigned',
  `teacher_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Teacher assigns portions to students';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_portion_assignments`
--

LOCK TABLES `tahfiz_portion_assignments` WRITE;
/*!40000 ALTER TABLE `tahfiz_portion_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_portion_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_recitation_submissions`
--

DROP TABLE IF EXISTS `tahfiz_recitation_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_recitation_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `assignment_id` bigint DEFAULT NULL,
  `book_id` bigint NOT NULL,
  `section_id` bigint DEFAULT NULL,
  `recitation_date` date NOT NULL,
  `recitation_time` time DEFAULT NULL,
  `portion_recited` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `recitation_type` enum('new_lesson','juzu_darus','muraaja','evaluation') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'new_lesson',
  `teacher_id` bigint NOT NULL COMMENT 'Teacher who heard the recitation',
  `total_mistakes` int DEFAULT '0',
  `tajweed_score` decimal(5,2) DEFAULT NULL COMMENT 'Out of 100',
  `fluency_score` decimal(5,2) DEFAULT NULL,
  `retention_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `status` enum('pending','approved','needs_revision','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `teacher_feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `audio_recording_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Optional audio file',
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Daily recitation records with scores';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_recitation_submissions`
--

LOCK TABLES `tahfiz_recitation_submissions` WRITE;
/*!40000 ALTER TABLE `tahfiz_recitation_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_recitation_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tahfiz_teacher_assignments`
--

DROP TABLE IF EXISTS `tahfiz_teacher_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tahfiz_teacher_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `role` enum('primary','assistant','substitute','evaluator') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'assistant',
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `removed_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Multiple teachers can be assigned to a group';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tahfiz_teacher_assignments`
--

LOCK TABLES `tahfiz_teacher_assignments` WRITE;
/*!40000 ALTER TABLE `tahfiz_teacher_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tahfiz_teacher_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_progress_log`
--

DROP TABLE IF EXISTS `term_progress_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_progress_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term_id` bigint NOT NULL,
  `day_date` date NOT NULL,
  `week_no` tinyint DEFAULT NULL,
  `summary` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_progress_log`
--

LOCK TABLES `term_progress_log` WRITE;
/*!40000 ALTER TABLE `term_progress_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_progress_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_requirement_items`
--

DROP TABLE IF EXISTS `term_requirement_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_requirement_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term_id` bigint NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `mandatory` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_requirement_items`
--

LOCK TABLES `term_requirement_items` WRITE;
/*!40000 ALTER TABLE `term_requirement_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_requirement_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_requirements`
--

DROP TABLE IF EXISTS `term_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_requirements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term_id` bigint NOT NULL,
  `requirement_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_requirements`
--

LOCK TABLES `term_requirements` WRITE;
/*!40000 ALTER TABLE `term_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_student_reports`
--

DROP TABLE IF EXISTS `term_student_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_student_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `report_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'reported',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_student_reports`
--

LOCK TABLES `term_student_reports` WRITE;
/*!40000 ALTER TABLE `term_student_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_student_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term_student_requirement_status`
--

DROP TABLE IF EXISTS `term_student_requirement_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term_student_requirement_status` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `item_id` bigint NOT NULL,
  `brought` tinyint(1) DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term_student_requirement_status`
--

LOCK TABLES `term_student_requirement_status` WRITE;
/*!40000 ALTER TABLE `term_student_requirement_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `term_student_requirement_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `academic_year_id` bigint NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `class_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint DEFAULT NULL,
  `day_of_week` tinyint NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `school_id` bigint NOT NULL,
  `term` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `payment_method_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Receipt number or external ref',
  `transaction_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_for` text COLLATE utf8mb4_unicode_ci COMMENT 'Description of what was paid',
  `status` enum('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'completed',
  `processed_by` bigint DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_term_year` (`term`,`year`),
  KEY `idx_transaction_date` (`transaction_date`),
  KEY `idx_status` (`status`),
  KEY `idx_reference` (`transaction_reference`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `processed_by` (`processed_by`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_route`
--

DROP TABLE IF EXISTS `transport_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_route` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `route_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fare` decimal(10,2) DEFAULT '0.00',
  `vehicle_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int unsigned DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transport routes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_route`
--

LOCK TABLES `transport_route` WRITE;
/*!40000 ALTER TABLE `transport_route` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned DEFAULT NULL COMMENT 'NULL for super admins, set for school users',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `national_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_photo_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('super_admin','school_admin','teacher','student','parent','accountant','librarian','staff') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissions` json DEFAULT NULL COMMENT 'Array of permission codes',
  `status` enum('active','inactive','suspended','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT '0',
  `two_factor_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_attempts` int DEFAULT '0',
  `locked_until` timestamp NULL DEFAULT NULL,
  `password_changed_at` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_token_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Unified user authentication and profile management';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_payment_plans`
--

DROP TABLE IF EXISTS `user_payment_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_payment_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `plan_id` bigint NOT NULL,
  `billing_cycle` enum('monthly','yearly','trial') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'monthly',
  `status` enum('active','trial','expired','cancelled','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'trial',
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT NULL,
  `trial_end_date` timestamp NULL DEFAULT NULL,
  `auto_renew` tinyint(1) DEFAULT '1',
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `last_payment_date` timestamp NULL DEFAULT NULL,
  `next_payment_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `plan_id` (`plan_id`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_trial_end` (`trial_end_date`),
  KEY `idx_user_plans_active` (`user_id`,`status`),
  CONSTRAINT `user_payment_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_payment_plans_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='User subscription tracking and billing';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_payment_plans`
--

LOCK TABLES `user_payment_plans` WRITE;
/*!40000 ALTER TABLE `user_payment_plans` DISABLE KEYS */;
INSERT INTO `user_payment_plans` VALUES (8,7,13,'monthly','active','2025-12-06 12:24:04',NULL,'2026-01-05 12:24:04',1,NULL,NULL,NULL,NULL,NULL,'2025-12-06 12:24:03',NULL),(9,9,13,'monthly','active','2025-12-06 12:57:46',NULL,'2026-01-05 12:57:46',1,NULL,NULL,NULL,NULL,NULL,'2025-12-06 12:57:46',NULL),(10,6,13,'monthly','active','2025-12-07 14:05:25',NULL,'2026-01-06 14:05:25',1,NULL,NULL,NULL,NULL,NULL,'2025-12-07 14:05:25',NULL),(11,10,13,'monthly','active','2025-12-10 21:37:40',NULL,'2026-01-09 21:37:40',1,NULL,NULL,NULL,NULL,NULL,'2025-12-10 21:37:40',NULL);
/*!40000 ALTER TABLE `user_payment_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_people`
--

DROP TABLE IF EXISTS `user_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_people` (
  `user_id` bigint NOT NULL,
  `person_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_people`
--

LOCK TABLES `user_people` WRITE;
/*!40000 ALTER TABLE `user_people` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `school_id` bigint DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Uganda',
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Africa/Kampala',
  `language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'en',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_school_id` (`school_id`),
  KEY `idx_user_profiles_user` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Extended user profile information (1:1 with users)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (9,6,10,'mandelacollege@gmail.com','0757000154','Kampala','Kampala','Uganda','Africa/Kampala','en',NULL,NULL,NULL,'2025-12-06 10:07:15','2025-12-17 09:15:11'),(10,7,5,'jhg','fhj','khjgj','hjhj','khtgf','Africa/Kampala','en',NULL,NULL,NULL,'2025-12-06 12:19:33','2025-12-06 12:34:55'),(11,8,1,NULL,NULL,NULL,NULL,'Uganda','Africa/Kampala','en',NULL,NULL,NULL,'2025-12-06 12:46:09',NULL),(12,9,6,'joun','0745774879','ight','hgfsd','Uganda','Africa/Kampala','en',NULL,NULL,NULL,'2025-12-06 12:56:35','2025-12-06 12:57:19'),(13,10,8,'Namuyaba Halima','0741447879','Iganga','timba','Uganda','Africa/Kampala','en',NULL,NULL,NULL,'2025-12-10 21:36:22','2025-12-10 21:37:25');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `device_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_last_activity` (`last_activity`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_trials`
--

DROP TABLE IF EXISTS `user_trials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_trials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime NOT NULL,
  `status` enum('active','expired','converted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `trial_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '30_day_trial',
  `features_enabled` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_trial` (`user_id`,`status`),
  KEY `idx_trial_status` (`status`,`end_date`),
  CONSTRAINT `user_trials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_trials`
--

LOCK TABLES `user_trials` WRITE;
/*!40000 ALTER TABLE `user_trials` DISABLE KEYS */;
INSERT INTO `user_trials` VALUES (8,7,'2025-12-06 15:24:04','2026-01-05 15:24:04','active','30_day_trial',NULL,'2025-12-06 12:24:03','2025-12-06 12:24:03'),(9,8,'2025-12-06 15:51:06','2026-01-05 15:51:06','active','30_day_trial',NULL,'2025-12-06 12:51:06','2025-12-06 12:51:06'),(10,9,'2025-12-06 15:57:46','2026-01-05 15:57:46','active','30_day_trial',NULL,'2025-12-06 12:57:46','2025-12-06 12:57:46'),(11,6,'2025-12-07 17:05:25','2026-01-06 17:05:25','active','30_day_trial',NULL,'2025-12-07 14:05:25','2025-12-07 14:05:25'),(12,10,'2025-12-11 00:37:40','2026-01-10 00:37:40','active','30_day_trial',NULL,'2025-12-10 21:37:40','2025-12-10 21:37:40');
/*!40000 ALTER TABLE `user_trials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `onboarding_completed` tinyint(1) DEFAULT '0',
  `onboarding_completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,10,NULL,NULL,'xhenonpro','xhenonprototype@gmail.com',NULL,'$2b$10$BMSGAT99BFGq9T5KM177ZuOlspS.UKJlpcYiXY1slotlCxQESBUL2','active','2025-12-19 14:11:12','2025-12-06 10:07:15','2025-12-06 10:07:15',NULL,0,NULL),(7,5,NULL,NULL,'hamibra','hamibra@gmail.com',NULL,'$2b$10$tX9w2A0lx0V.uxTuyUddieg6jbXs6F2ZArC.Mq4QaaU5D3/2fg.nu','active','2025-12-06 12:53:40','2025-12-06 12:19:33','2025-12-06 12:19:33',NULL,1,'2025-12-06 12:32:17'),(8,1,NULL,NULL,'testuser','testuser@example.com',NULL,'$2b$10$2XlD3WMbNArJTj6.7x4LdOUeFKsZIYosr6/1.OhF6p9xzEaNssna2','active','2025-12-06 12:50:44','2025-12-06 12:46:09','2025-12-06 12:46:09',NULL,1,'2025-12-06 12:51:06'),(9,6,NULL,NULL,'john','johncena@gmail.com',NULL,'$2b$10$vQIbBYUgLHNkclv5lfTIA.mQxg4LlKaoDm6ExLNH3.HPj4msSRFi6','active',NULL,'2025-12-06 12:56:36','2025-12-06 12:56:36',NULL,0,NULL),(10,8,NULL,NULL,'dispenza','joedispenza@gmail.com',NULL,'$2b$10$ZMBVVulxd.jSgbbsPmRUuuoiVdMl1ZvZGHL.ecwxcOL7D2TgOPFKS','active',NULL,'2025-12-10 21:36:22','2025-12-10 21:36:22',NULL,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  
  INSERT INTO user_profiles (user_id, school_id)
  VALUES (NEW.id, NEW.school_id);
  
  
  INSERT INTO onboarding_steps (user_id, step_name, step_order, status) VALUES
  (NEW.id, 'school_setup', 1, 'pending'),
  (NEW.id, 'admin_profile', 2, 'pending'),
  (NEW.id, 'payment_plan', 3, 'pending'),
  (NEW.id, 'review_confirm', 4, 'pending');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `v_user_trial_status`
--

DROP TABLE IF EXISTS `v_user_trial_status`;
/*!50001 DROP VIEW IF EXISTS `v_user_trial_status`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_user_trial_status` AS SELECT 
 1 AS `user_id`,
 1 AS `email`,
 1 AS `trial_id`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `trial_status`,
 1 AS `days_remaining`,
 1 AS `is_trial_active`,
 1 AS `trial_type`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `villages`
--

DROP TABLE IF EXISTS `villages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `villages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parish_id` bigint NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `villages`
--

LOCK TABLES `villages` WRITE;
/*!40000 ALTER TABLE `villages` DISABLE KEYS */;
/*!40000 ALTER TABLE `villages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `method` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'UGX',
  `opening_balance` decimal(14,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workplans`
--

DROP TABLE IF EXISTS `workplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workplans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `school_id` bigint NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `owner_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `owner_id` bigint DEFAULT NULL,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workplans`
--

LOCK TABLES `workplans` WRITE;
/*!40000 ALTER TABLE `workplans` DISABLE KEYS */;
/*!40000 ALTER TABLE `workplans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `v_user_trial_status`
--

/*!50001 DROP VIEW IF EXISTS `v_user_trial_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_user_trial_status` AS select `u`.`id` AS `user_id`,`u`.`email` AS `email`,`ut`.`id` AS `trial_id`,`ut`.`start_date` AS `start_date`,`ut`.`end_date` AS `end_date`,`ut`.`status` AS `trial_status`,(to_days(`ut`.`end_date`) - to_days(now())) AS `days_remaining`,(case when ((`ut`.`status` = 'active') and (`ut`.`end_date` >= now())) then 1 else 0 end) AS `is_trial_active`,`ut`.`trial_type` AS `trial_type` from (`users` `u` left join `user_trials` `ut` on((`u`.`id` = `ut`.`user_id`))) where (`ut`.`id` is not null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-23 16:40:57
