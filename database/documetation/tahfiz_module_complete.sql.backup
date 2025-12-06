-- =========================================
-- DRAIS TAHFIZ MANAGEMENT MODULE
-- Comprehensive Database Schema Extension
-- Generated: December 5, 2025
-- Version: 1.0.0
-- =========================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

USE `drais`;

-- Disable foreign key checks for clean table creation
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================
-- DROP EXISTING TAHFIZ TABLES (Enhanced)
-- =========================================
DROP TABLE IF EXISTS `tahfiz_lesson_revisions`;
DROP TABLE IF EXISTS `tahfiz_daily_revisions`;
DROP TABLE IF EXISTS `tahfiz_intensive_revisions`;
DROP TABLE IF EXISTS `tahfiz_mistake_logs`;
DROP TABLE IF EXISTS `tahfiz_recitation_submissions`;
DROP TABLE IF EXISTS `tahfiz_portion_assignments`;
DROP TABLE IF EXISTS `tahfiz_learner_progress`;
DROP TABLE IF EXISTS `tahfiz_learner_enrollments`;
DROP TABLE IF EXISTS `tahfiz_group_transfers`;
DROP TABLE IF EXISTS `tahfiz_teacher_assignments`;
DROP TABLE IF EXISTS `tahfiz_completion_certificates`;
DROP TABLE IF EXISTS `tahfiz_mastery_validations`;
DROP TABLE IF EXISTS `tahfiz_evaluation_reports`;
DROP TABLE IF EXISTS `tahfiz_book_ayat_map`;
DROP TABLE IF EXISTS `tahfiz_book_page_map`;
DROP TABLE IF EXISTS `tahfiz_book_juz_map`;
DROP TABLE IF EXISTS `tahfiz_book_surah_map`;
DROP TABLE IF EXISTS `tahfiz_book_hizb_map`;
DROP TABLE IF EXISTS `tahfiz_book_quarter_map`;
DROP TABLE IF EXISTS `tahfiz_book_sections`;
DROP TABLE IF EXISTS `tahfiz_book_structure_definitions`;
DROP TABLE IF EXISTS `tahfiz_book_types`;
DROP TABLE IF EXISTS `tahfiz_books_enhanced`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- A. BOOK DEFINITIONS MODULE
-- =========================================

-- --------------------------------------------------------
-- Book Types Master Table
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` varchar(50) NOT NULL COMMENT 'quran, yassarna, shatibiyyah, tuhfatul_atfaal, mutashabihat, etc',
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `structure_type` varchar(50) NOT NULL COMMENT 'hierarchical, linear, chapter-based, ayat-based',
  `supports_surah` tinyint(1) DEFAULT 0,
  `supports_juz` tinyint(1) DEFAULT 0,
  `supports_pages` tinyint(1) DEFAULT 1,
  `supports_abyat` tinyint(1) DEFAULT 0,
  `supports_topics` tinyint(1) DEFAULT 0,
  `requires_tajweed` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master table for all book types (Quran, Yassarna, poems, etc)';

-- --------------------------------------------------------
-- Enhanced Books Table
-- --------------------------------------------------------
CREATE TABLE `tahfiz_books_enhanced` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `school_id` bigint(20) NOT NULL,
  `book_type_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `arabic_title` varchar(200) DEFAULT NULL,
  `author` varchar(150) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `total_units` int(11) DEFAULT NULL COMMENT 'Total countable units (pages, verses, abyat)',
  `unit_type` varchar(50) DEFAULT 'page' COMMENT 'page, verse, bait, topic, line',
  `difficulty_level` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
  `estimated_completion_days` int(11) DEFAULT NULL,
  `sequence_order` int(11) DEFAULT 0 COMMENT 'Display order in lists',
  `is_active` tinyint(1) DEFAULT 1,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata_json`)) COMMENT 'Flexible storage for book-specific data',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced books with full structural support';

-- --------------------------------------------------------
-- Book Structure Definitions (Generic Hierarchy)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_structure_definitions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `structure_type` varchar(50) NOT NULL COMMENT 'surah, juz, hizb, quarter, page, paper, chapter, baab, topic, subtopic',
  `total_count` int(11) NOT NULL COMMENT 'Total number of this structure type in the book',
  `sequence_order` int(11) DEFAULT 0,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Defines what structural elements a book contains';

-- --------------------------------------------------------
-- Book Sections (Hierarchical Content Organization)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_sections` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `parent_section_id` bigint(20) DEFAULT NULL COMMENT 'For nested hierarchy (e.g., juz → surah → ayah)',
  `section_type` varchar(50) NOT NULL COMMENT 'surah, juz, hizb, quarter, page, paper, chapter, baab, topic, bait, ayah',
  `section_number` int(11) NOT NULL COMMENT 'Numeric identifier (e.g., Surah 1, Juz 15, Page 302)',
  `section_name` varchar(200) DEFAULT NULL COMMENT 'Name if applicable (e.g., Al-Fatihah, Introduction)',
  `arabic_name` varchar(200) DEFAULT NULL,
  `start_reference` varchar(100) DEFAULT NULL COMMENT 'Starting point (e.g., "Surah 1 Ayah 1", "Page 1 Line 3")',
  `end_reference` varchar(100) DEFAULT NULL,
  `content_text` text DEFAULT NULL COMMENT 'Actual text content for small sections (optional)',
  `unit_count` int(11) DEFAULT NULL COMMENT 'How many sub-units (e.g., 7 ayat in Al-Fatihah)',
  `sequence_order` int(11) DEFAULT 0,
  `difficulty_level` enum('easy','medium','hard') DEFAULT 'medium',
  `estimated_study_minutes` int(11) DEFAULT NULL,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Hierarchical content sections for any book type';

-- =========================================
-- QURAN-SPECIFIC MAPPING TABLES
-- =========================================

-- --------------------------------------------------------
-- Surah Master Map (114 Surahs)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_surah_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL COMMENT 'Links to Quran book record',
  `surah_number` tinyint(4) NOT NULL,
  `surah_name_arabic` varchar(100) NOT NULL,
  `surah_name_english` varchar(100) DEFAULT NULL,
  `surah_name_transliteration` varchar(100) DEFAULT NULL,
  `revelation_place` enum('makkah','madinah') DEFAULT NULL,
  `total_ayat` smallint(6) NOT NULL,
  `start_page` smallint(6) DEFAULT NULL,
  `end_page` smallint(6) DEFAULT NULL,
  `start_juz` tinyint(4) DEFAULT NULL,
  `end_juz` tinyint(4) DEFAULT NULL,
  `sequence_order` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Surah metadata for Quran';

-- --------------------------------------------------------
-- Juz Map (30 Juz)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_juz_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `juz_number` tinyint(4) NOT NULL,
  `start_surah` tinyint(4) NOT NULL,
  `start_ayah` smallint(6) NOT NULL,
  `end_surah` tinyint(4) NOT NULL,
  `end_ayah` smallint(6) NOT NULL,
  `start_page` smallint(6) DEFAULT NULL,
  `end_page` smallint(6) DEFAULT NULL,
  `total_ayat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Juz divisions (30 parts of Quran)';

-- --------------------------------------------------------
-- Hizb Map (60 Hizb)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_hizb_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `hizb_number` tinyint(4) NOT NULL,
  `juz_number` tinyint(4) NOT NULL,
  `start_surah` tinyint(4) NOT NULL,
  `start_ayah` smallint(6) NOT NULL,
  `end_surah` tinyint(4) NOT NULL,
  `end_ayah` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Hizb divisions (60 parts, 2 per juz)';

-- --------------------------------------------------------
-- Quarter Map (120 Quarters / Rub)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_quarter_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `quarter_number` smallint(6) NOT NULL,
  `hizb_number` tinyint(4) NOT NULL,
  `juz_number` tinyint(4) NOT NULL,
  `start_surah` tinyint(4) NOT NULL,
  `start_ayah` smallint(6) NOT NULL,
  `end_surah` tinyint(4) NOT NULL,
  `end_ayah` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Quarter divisions (120 parts, Rub al-Hizb)';

-- --------------------------------------------------------
-- Page Map (604 Pages, 302 Papers)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_page_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `page_number` smallint(6) NOT NULL,
  `paper_number` smallint(6) DEFAULT NULL COMMENT 'Physical paper (page_number / 2)',
  `juz_number` tinyint(4) NOT NULL,
  `hizb_number` tinyint(4) DEFAULT NULL,
  `start_surah` tinyint(4) NOT NULL,
  `start_ayah` smallint(6) NOT NULL,
  `end_surah` tinyint(4) NOT NULL,
  `end_ayah` smallint(6) NOT NULL,
  `total_ayat_on_page` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Page-by-page mapping (604 pages)';

-- --------------------------------------------------------
-- Ayat Map (6236 Verses)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_book_ayat_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `book_id` bigint(20) NOT NULL,
  `surah_number` tinyint(4) NOT NULL,
  `ayah_number` smallint(6) NOT NULL,
  `ayah_text_arabic` text NOT NULL,
  `ayah_text_transliteration` text DEFAULT NULL,
  `ayah_text_translation` text DEFAULT NULL COMMENT 'English or local language',
  `page_number` smallint(6) NOT NULL,
  `juz_number` tinyint(4) NOT NULL,
  `hizb_number` tinyint(4) DEFAULT NULL,
  `quarter_number` smallint(6) DEFAULT NULL,
  `sajda_type` enum('recommended','obligatory') DEFAULT NULL,
  `sequence_in_quran` smallint(6) NOT NULL COMMENT 'Global ayah number (1-6236)',
  `word_count` tinyint(4) DEFAULT NULL,
  `metadata_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata_json`)) COMMENT 'Tajweed rules, recitation notes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Complete ayat repository (6236 verses)';

-- =========================================
-- B. TAHFIZ OPERATIONAL TABLES
-- =========================================

-- --------------------------------------------------------
-- Enhanced Tahfiz Groups
-- --------------------------------------------------------
CREATE TABLE `tahfiz_groups_enhanced` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `school_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `arabic_name` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `primary_teacher_id` bigint(20) NOT NULL,
  `assistant_teacher_id` bigint(20) DEFAULT NULL,
  `target_book_id` bigint(20) DEFAULT NULL COMMENT 'Primary book being studied',
  `proficiency_level` enum('beginner','intermediate','advanced','revision','hafidh') DEFAULT 'beginner',
  `max_capacity` int(11) DEFAULT 30,
  `current_enrollment` int(11) DEFAULT 0,
  `meeting_schedule` varchar(255) DEFAULT NULL COMMENT 'Daily schedule description',
  `room_location` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced Tahfiz study groups';

-- --------------------------------------------------------
-- Teacher Assignments (Multiple Teachers per Group)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_teacher_assignments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `group_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `role` enum('primary','assistant','substitute','evaluator') DEFAULT 'assistant',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `removed_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Multiple teachers can be assigned to a group';

-- --------------------------------------------------------
-- Learner Enrollments (Student → Group → Book)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_learner_enrollments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `withdrawn_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','withdrawn','completed','suspended') DEFAULT 'active',
  `withdrawal_reason` text DEFAULT NULL,
  `starting_level` varchar(100) DEFAULT NULL COMMENT 'E.g., "Juz 1", "Page 1", "Beginner"',
  `target_completion_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Student enrollment in Tahfiz groups and books';

-- --------------------------------------------------------
-- Group Transfer History
-- --------------------------------------------------------
CREATE TABLE `tahfiz_group_transfers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `from_group_id` bigint(20) DEFAULT NULL,
  `to_group_id` bigint(20) NOT NULL,
  `transfer_reason` varchar(255) DEFAULT NULL,
  `transferred_by` bigint(20) DEFAULT NULL COMMENT 'User/staff who initiated transfer',
  `transferred_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Track group transfers for students';

-- --------------------------------------------------------
-- Learner Progress Master (One record per student per book)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_learner_progress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `enrollment_id` bigint(20) DEFAULT NULL,
  `current_section_id` bigint(20) DEFAULT NULL COMMENT 'Current surah/juz/page/topic being studied',
  `current_portion_text` varchar(255) DEFAULT NULL COMMENT 'Human-readable current position',
  `total_completed_units` int(11) DEFAULT 0 COMMENT 'Pages/verses/abyat completed',
  `total_units_in_book` int(11) DEFAULT NULL,
  `completion_percentage` decimal(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN `total_units_in_book` > 0 
      THEN (`total_completed_units` / `total_units_in_book`) * 100 
      ELSE 0 
    END
  ) STORED,
  `start_date` date DEFAULT NULL,
  `expected_completion_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `status` enum('not_started','in_progress','under_revision','completed','certified') DEFAULT 'not_started',
  `mastery_level` enum('none','beginner','intermediate','proficient','master','hafidh') DEFAULT 'none',
  `last_recitation_date` date DEFAULT NULL,
  `last_revision_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Master progress tracking per student per book';

-- --------------------------------------------------------
-- Portion Assignments (Teacher assigns next portion)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_portion_assignments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `section_id` bigint(20) DEFAULT NULL COMMENT 'Links to tahfiz_book_sections',
  `assigned_by_teacher_id` bigint(20) NOT NULL,
  `assignment_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `portion_text` varchar(255) NOT NULL COMMENT 'E.g., "Surah Al-Baqarah Ayah 1-5", "Page 10"',
  `portion_type` enum('new_memorization','light_revision','intensive_revision','evaluation') DEFAULT 'new_memorization',
  `estimated_difficulty` enum('easy','medium','hard') DEFAULT 'medium',
  `status` enum('assigned','in_progress','completed','skipped','pending_evaluation') DEFAULT 'assigned',
  `teacher_notes` text DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Teacher assigns portions to students';

-- --------------------------------------------------------
-- Daily Recitation Submissions (Student reads to teacher)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_recitation_submissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `assignment_id` bigint(20) DEFAULT NULL,
  `book_id` bigint(20) NOT NULL,
  `section_id` bigint(20) DEFAULT NULL,
  `recitation_date` date NOT NULL,
  `recitation_time` time DEFAULT NULL,
  `portion_recited` varchar(255) NOT NULL,
  `recitation_type` enum('new_lesson','juzu_darus','muraaja','evaluation') DEFAULT 'new_lesson',
  `teacher_id` bigint(20) NOT NULL COMMENT 'Teacher who heard the recitation',
  `total_mistakes` int(11) DEFAULT 0,
  `tajweed_score` decimal(5,2) DEFAULT NULL COMMENT 'Out of 100',
  `fluency_score` decimal(5,2) DEFAULT NULL,
  `retention_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `status` enum('pending','approved','needs_revision','rejected') DEFAULT 'pending',
  `teacher_feedback` text DEFAULT NULL,
  `audio_recording_url` varchar(255) DEFAULT NULL COMMENT 'Optional audio file',
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Daily recitation records with scores';

-- --------------------------------------------------------
-- Mistake Logs (Detailed error tracking)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_mistake_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `recitation_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `surah_number` tinyint(4) DEFAULT NULL,
  `ayah_number` smallint(6) DEFAULT NULL,
  `page_number` smallint(6) DEFAULT NULL,
  `mistake_type` enum('tajweed','pronunciation','skipped_word','wrong_word','hesitation','other') NOT NULL,
  `mistake_description` text DEFAULT NULL,
  `correction_provided` text DEFAULT NULL,
  `severity` enum('minor','moderate','major','critical') DEFAULT 'minor',
  `recurring_mistake` tinyint(1) DEFAULT 0 COMMENT 'Flag if student makes this mistake repeatedly',
  `logged_by_teacher_id` bigint(20) NOT NULL,
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detailed mistake tracking per recitation';

-- --------------------------------------------------------
-- Daily Light Revisions (Juzu Darus)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_daily_revisions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `revision_date` date NOT NULL,
  `portion_revised` varchar(255) NOT NULL COMMENT 'What was revised',
  `section_id` bigint(20) DEFAULT NULL,
  `revision_type` enum('juzu_darus','self_study','group_revision') DEFAULT 'juzu_darus',
  `presented_to_teacher` tinyint(1) DEFAULT 0,
  `teacher_id` bigint(20) DEFAULT NULL,
  `quality_score` decimal(5,2) DEFAULT NULL COMMENT 'Teacher assessment if presented',
  `mistakes_count` int(11) DEFAULT 0,
  `duration_minutes` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Daily light revision tracking (Juzu Darus)';

-- --------------------------------------------------------
-- Intensive Revisions (Muraaja - Scheduled deep review)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_intensive_revisions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `revision_schedule_date` date NOT NULL,
  `actual_revision_date` date DEFAULT NULL,
  `portion_to_revise` varchar(255) NOT NULL COMMENT 'E.g., "Juz 1-3", "Surah Al-Baqarah full"',
  `section_from_id` bigint(20) DEFAULT NULL,
  `section_to_id` bigint(20) DEFAULT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `status` enum('scheduled','in_progress','completed','postponed','cancelled') DEFAULT 'scheduled',
  `completion_percentage` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `total_mistakes` int(11) DEFAULT 0,
  `teacher_evaluation` text DEFAULT NULL,
  `next_revision_date` date DEFAULT NULL COMMENT 'When next Muraaja should happen',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Scheduled intensive revision (Muraaja)';

-- --------------------------------------------------------
-- Lesson Revisions (Links revision to specific lessons)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_lesson_revisions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `intensive_revision_id` bigint(20) NOT NULL,
  `original_recitation_id` bigint(20) DEFAULT NULL COMMENT 'Links back to when this was first learned',
  `section_id` bigint(20) DEFAULT NULL,
  `portion_text` varchar(255) NOT NULL,
  `revision_quality` enum('excellent','good','fair','needs_work') DEFAULT 'good',
  `mistakes_count` int(11) DEFAULT 0,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Individual lesson tracking within intensive revisions';

-- --------------------------------------------------------
-- Evaluation Reports (Periodic assessments)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_evaluation_reports` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `evaluator_id` bigint(20) NOT NULL,
  `evaluation_date` date NOT NULL,
  `evaluation_type` enum('weekly','monthly','quarterly','termly','annual','final_exam') DEFAULT 'monthly',
  `term_id` bigint(20) DEFAULT NULL,
  `memorization_score` decimal(5,2) DEFAULT NULL,
  `tajweed_score` decimal(5,2) DEFAULT NULL,
  `fluency_score` decimal(5,2) DEFAULT NULL,
  `retention_score` decimal(5,2) DEFAULT NULL,
  `discipline_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL COMMENT 'A, B, C, etc.',
  `rank_in_group` int(11) DEFAULT NULL,
  `total_students_in_group` int(11) DEFAULT NULL,
  `strengths` text DEFAULT NULL,
  `weaknesses` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `evaluator_comments` text DEFAULT NULL,
  `parent_notified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Periodic evaluation reports';

-- --------------------------------------------------------
-- Mastery Validations (Verification before moving forward)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_mastery_validations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL COMMENT 'Section being validated (e.g., Juz 1)',
  `validation_date` date NOT NULL,
  `validator_id` bigint(20) NOT NULL COMMENT 'Senior teacher or examiner',
  `validation_type` enum('section','juz','surah','full_book') DEFAULT 'section',
  `oral_test_score` decimal(5,2) DEFAULT NULL,
  `written_test_score` decimal(5,2) DEFAULT NULL,
  `tajweed_accuracy` decimal(5,2) DEFAULT NULL,
  `fluency_rating` decimal(5,2) DEFAULT NULL,
  `pass_status` enum('pending','passed','failed','conditional_pass') DEFAULT 'pending',
  `validator_feedback` text DEFAULT NULL,
  `revalidation_required` tinyint(1) DEFAULT 0,
  `revalidation_date` date DEFAULT NULL,
  `certification_eligible` tinyint(1) DEFAULT 0 COMMENT 'Ready for certificate?',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Formal mastery validation tests';

-- --------------------------------------------------------
-- Completion Certificates
-- --------------------------------------------------------
CREATE TABLE `tahfiz_completion_certificates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `certificate_type` enum('section_completion','juz_completion','book_completion','hafidh_certification','ijazah') DEFAULT 'book_completion',
  `certificate_number` varchar(100) NOT NULL COMMENT 'Unique certificate ID',
  `issue_date` date NOT NULL,
  `issued_by_id` bigint(20) NOT NULL COMMENT 'Authority who issued (e.g., Director, Sheikh)',
  `completion_date` date NOT NULL COMMENT 'When the book/section was completed',
  `total_duration_days` int(11) DEFAULT NULL COMMENT 'How long it took to complete',
  `final_grade` varchar(10) DEFAULT NULL,
  `distinction` enum('with_honors','with_distinction','pass','conditional') DEFAULT NULL,
  `certificate_document_url` varchar(255) DEFAULT NULL COMMENT 'PDF/image of certificate',
  `verification_code` varchar(100) DEFAULT NULL COMMENT 'QR code or hash for authenticity',
  `remarks` text DEFAULT NULL,
  `is_revoked` tinyint(1) DEFAULT 0,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `revoke_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Completion certificates and Hafidh status';

-- --------------------------------------------------------
-- Enhanced Attendance (Integrates with existing attendance)
-- --------------------------------------------------------
CREATE TABLE `tahfiz_attendance_enhanced` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused','sick','present_no_recitation') DEFAULT 'present',
  `arrival_time` time DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `recitation_submitted` tinyint(1) DEFAULT 0 COMMENT 'Did student recite today?',
  `reason_for_absence` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `recorded_by_teacher_id` bigint(20) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Enhanced Tahfiz attendance with recitation status';

-- =========================================
-- =========================================

-- Performance indexes for frequent queries

-- =========================================
-- =========================================
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

-- =========================================
-- SCHEMA CREATION COMPLETED
-- =========================================

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- DRAIS Tahfiz Management Module Database Schema v1.0.0
-- Total Tables Created: 32
-- Total Foreign Keys: 60+
-- Total Indexes: 80+
-- Supports: Quran (6236 ayat), Yassarna, Shatibiyyah, and custom books
-- =========================================

-- =========================================
-- TAHFIZ TABLES FROM SCHOOL.SQL
-- Moved for better organization
-- =========================================

-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


-- --------------------------------------------------------


