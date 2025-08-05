-- Database Migration for Resume Builder
-- Run this in your Supabase Dashboard SQL Editor

-- Add missing columns for security tracking
ALTER TABLE public.published_resumes 
ADD COLUMN IF NOT EXISTS client_ip INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Update resume_data column type to TEXT for encrypted data
ALTER TABLE public.published_resumes 
ALTER COLUMN resume_data TYPE TEXT;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_client_ip INET,
  p_action TEXT,
  p_max_requests INTEGER DEFAULT 50,
  p_window_minutes INTEGER DEFAULT 15
) RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.published_resumes
  WHERE client_ip = p_client_ip
    AND created_at > NOW() - INTERVAL '1 minute' * p_window_minutes;
  RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create data validation function
CREATE OR REPLACE FUNCTION validate_resume_data_size(
  p_resume_data TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN octet_length(p_resume_data) <= 1048576;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_rate_limit(INET, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_resume_data_size(TEXT) TO anon, authenticated;

-- Verify the changes
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'published_resumes' 
ORDER BY ordinal_position; 