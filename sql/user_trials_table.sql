-- =====================================================
-- DRAIS v0.0.0043 - User Trials Table
-- 30-day free trial management
-- =====================================================

USE drais;

-- Create user_trials table for trial period tracking
CREATE TABLE IF NOT EXISTS user_trials (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME NOT NULL,
  status ENUM('active', 'expired', 'converted') DEFAULT 'active',
  trial_type VARCHAR(50) DEFAULT '30_day_trial',
  features_enabled JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_trial (user_id, status),
  INDEX idx_trial_status (status, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update payment_plans to include 30-day trial option
UPDATE payment_plans 
SET trial_period_days = 30,
    description = 'Start with a 30-day free trial. Access all features with up to 50 students.'
WHERE plan_code = 'trial';

-- Add stored procedure to check and update expired trials
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS update_expired_trials()
BEGIN
  -- Mark trials as expired if end_date has passed
  UPDATE user_trials
  SET status = 'expired'
  WHERE status = 'active' 
    AND end_date < NOW();
  
  -- Update corresponding payment plans
  UPDATE user_payment_plans upp
  JOIN user_trials ut ON upp.user_id = ut.user_id
  SET upp.status = 'expired'
  WHERE ut.status = 'expired'
    AND upp.status = 'active'
    AND upp.plan_id = (SELECT id FROM payment_plans WHERE plan_code = 'trial');
END$$

DELIMITER ;

-- Add event scheduler to run daily trial expiration check
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS daily_trial_expiration_check
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY)
DO
  CALL update_expired_trials();

-- Add helper function to get remaining trial days
DELIMITER $$

CREATE FUNCTION IF NOT EXISTS get_trial_days_remaining(p_user_id BIGINT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE days_remaining INT DEFAULT 0;
  
  SELECT GREATEST(0, DATEDIFF(end_date, NOW()))
  INTO days_remaining
  FROM user_trials
  WHERE user_id = p_user_id
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN days_remaining;
END$$

DELIMITER ;

-- Add view for easy trial status checking
CREATE OR REPLACE VIEW v_user_trial_status AS
SELECT 
  u.id AS user_id,
  u.email,
  ut.id AS trial_id,
  ut.start_date,
  ut.end_date,
  ut.status AS trial_status,
  DATEDIFF(ut.end_date, NOW()) AS days_remaining,
  CASE 
    WHEN ut.status = 'active' AND ut.end_date >= NOW() THEN 1
    ELSE 0
  END AS is_trial_active,
  ut.trial_type
FROM users u
LEFT JOIN user_trials ut ON u.id = ut.user_id
WHERE ut.id IS NOT NULL;
