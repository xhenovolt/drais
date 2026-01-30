#!/bin/bash
# Apply Session-Based Auth Schema Migration
# Version: v0.0.0052

set -e

DATABASE_URL="${DATABASE_URL}"

echo "🔄 Applying session-based authentication schema migration..."

psql "$DATABASE_URL" << 'EOF'
-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    stay_logged_in BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    logged_out_at TIMESTAMP,
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(user_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

-- Create school_onboarding table
CREATE TABLE IF NOT EXISTS school_onboarding (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    school_name_set BOOLEAN DEFAULT FALSE,
    school_address_set BOOLEAN DEFAULT FALSE,
    contact_info_set BOOLEAN DEFAULT FALSE,
    location_details_set BOOLEAN DEFAULT FALSE,
    policies_set BOOLEAN DEFAULT FALSE,
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_school_onboarding_status ON school_onboarding(is_complete);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL,
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, school_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_school ON user_roles(school_id, role_name);
CREATE INDEX IF NOT EXISTS idx_user_roles_primary ON user_roles(user_id) WHERE is_primary = TRUE;

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    UNIQUE(role_name, permission)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    school_id BIGINT REFERENCES schools(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(created_at);

-- Add columns to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_onboarded BOOLEAN DEFAULT FALSE;

-- Seed role permissions
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

SELECT 'Migration completed successfully' as status;
EOF

echo "✅ Session-based authentication schema created successfully"
