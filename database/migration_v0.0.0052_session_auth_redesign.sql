/**
 * DRAIS Authentication & Onboarding Redesign
 * Session-Based Architecture for Production SaaS
 * 
 * Version: v0.0.0052
 * Database: PostgreSQL
 * 
 * DESIGN PRINCIPLES:
 * 1. Sessions-only (no JWT/tokens)
 * 2. Onboarding decoupled from auth
 * 3. Single source of truth from database
 * 4. Immutable audit logs
 * 5. Role-based access control (RBAC)
 * 6. Defensive against null/undefined
 */

-- =====================================================================
-- 1. SESSIONS TABLE (Core Session Management)
-- =====================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session metadata
    ip_address VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    
    -- Session lifetime
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL, -- Based on inactivity timeout or explicit expiry
    stay_logged_in BOOLEAN DEFAULT FALSE, -- If true, session extends on each activity
    
    -- Session state
    is_active BOOLEAN DEFAULT TRUE,
    logged_out_at TIMESTAMP,
    
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(user_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

-- =====================================================================
-- 2. SCHOOL ONBOARDING TABLE (Track school setup progress)
-- =====================================================================
CREATE TABLE IF NOT EXISTS school_onboarding (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Mandatory fields
    school_name_set BOOLEAN DEFAULT FALSE,
    school_address_set BOOLEAN DEFAULT FALSE,
    
    -- Optional fields (can be set later)
    contact_info_set BOOLEAN DEFAULT FALSE,
    location_details_set BOOLEAN DEFAULT FALSE,
    policies_set BOOLEAN DEFAULT FALSE,
    
    -- Overall status
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    
    -- Tracking
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT school_onboarding_valid_completion CHECK (
        is_complete = (school_name_set AND school_address_set)
    )
);

CREATE INDEX IF NOT EXISTS idx_school_onboarding_status ON school_onboarding(is_complete);

-- =====================================================================
-- 3. UPDATED USERS TABLE (Add school_onboarded flag)
-- =====================================================================
-- Migration: ALTER TABLE users ADD COLUMN IF NOT EXISTS school_onboarded BOOLEAN DEFAULT FALSE;
-- This flag indicates user can access full system (onboarding complete)

-- =====================================================================
-- 4. USER ROLES TABLE (Role definitions - enhanced)
-- =====================================================================
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL, -- 'superadmin', 'admin', 'teacher', 'staff', 'student', 'parent'
    
    -- Track assignment
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL, -- Who assigned this role
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE, -- Primary role for this user
    
    UNIQUE(user_id, school_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_school ON user_roles(school_id, role_name);
CREATE INDEX IF NOT EXISTS idx_user_roles_primary ON user_roles(user_id) WHERE is_primary = TRUE;

-- =====================================================================
-- 5. ROLE PERMISSIONS TABLE (Permissions for each role)
-- =====================================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL, -- e.g., 'view_dashboard', 'manage_users', 'edit_school'
    
    UNIQUE(role_name, permission)
);

-- Seed default permissions
INSERT INTO role_permissions (role_name, permission) VALUES
    ('superadmin', 'view_dashboard'),
    ('superadmin', 'manage_users'),
    ('superadmin', 'edit_school'),
    ('superadmin', 'view_audit_log'),
    ('superadmin', 'manage_payments'),
    ('admin', 'view_dashboard'),
    ('admin', 'manage_students'),
    ('admin', 'manage_staff'),
    ('admin', 'view_reports'),
    ('teacher', 'view_dashboard'),
    ('teacher', 'manage_classes'),
    ('teacher', 'view_grades'),
    ('student', 'view_dashboard'),
    ('student', 'view_grades'),
    ('parent', 'view_dashboard'),
    ('parent', 'view_child_progress')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 6. AUDIT LOG TABLE (Immutable action log)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    school_id BIGINT REFERENCES schools(id) ON DELETE SET NULL,
    
    -- Action details
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'school_setup'
    entity_type VARCHAR(100), -- 'user', 'school', 'payment_plan', 'role'
    entity_id BIGINT, -- ID of the affected record
    
    -- Change details
    old_values JSONB, -- Previous state (for updates)
    new_values JSONB, -- New state (for updates and creates)
    
    -- Request context
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Immutable timestamp
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(created_at);

-- =====================================================================
-- 7. USER TRIALS TABLE (Enhanced trial tracking)
-- =====================================================================
-- Already exists, but ensure it has these columns:
-- ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS is_converted BOOLEAN DEFAULT FALSE;
-- ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS converted_to_plan_id BIGINT;

-- =====================================================================
-- 8. USER PAYMENT PLANS TABLE (Subscription tracking)
-- =====================================================================
-- Already exists, but ensure it tracks upgrade/downgrade history

-- =====================================================================
-- MIGRATION HELPER: Safe column additions
-- =====================================================================

-- Add missing columns to existing tables
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS school_onboarded BOOLEAN DEFAULT FALSE;

-- =====================================================================
-- VERIFICATION QUERIES
-- =====================================================================

\echo '✅ Session-based authentication tables created'
SELECT COUNT(*) as total_auth_tables FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN (
    'sessions', 'school_onboarding', 'user_roles', 'role_permissions', 'audit_logs'
);
