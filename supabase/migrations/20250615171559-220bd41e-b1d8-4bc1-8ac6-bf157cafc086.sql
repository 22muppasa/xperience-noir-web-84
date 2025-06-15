
-- Add missing status values to the message_status enum
ALTER TYPE message_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE message_status ADD VALUE IF NOT EXISTS 'responded';

-- Add missing status value to the post_status enum  
ALTER TYPE post_status ADD VALUE IF NOT EXISTS 'archived';
