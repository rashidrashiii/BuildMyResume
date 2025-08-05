-- Create a table for published resumes
CREATE TABLE public.published_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_data TEXT NOT NULL, -- Changed from JSONB to TEXT to store encrypted data
  title TEXT NOT NULL,
  template_name TEXT NOT NULL DEFAULT 'modern',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  client_ip INET,
  user_agent TEXT
  -- Removed data_size as it was specific to JSONB
);

-- Enable Row Level Security
ALTER TABLE public.published_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we want anonymous publishing)
CREATE POLICY "Anyone can view published resumes" 
ON public.published_resumes 
FOR SELECT 
USING (true);

-- Rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_client_ip INET,
  p_action TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 15
) RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Count requests in the time window
  SELECT COUNT(*) INTO request_count
  FROM public.published_resumes
  WHERE client_ip = p_client_ip
    AND created_at > NOW() - INTERVAL '1 minute' * p_window_minutes;
  
  -- Return true if under limit
  RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Data size validation function
CREATE OR REPLACE FUNCTION validate_resume_data_size(
  p_resume_data TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  data_size INTEGER;
BEGIN
  -- Calculate approximate size in bytes
  data_size := octet_length(p_resume_data);
  
  -- Limit to 1MB (1,048,576 bytes)
  RETURN data_size <= 1048576;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced insert policy with rate limiting and validation
CREATE POLICY "Rate limited resume publishing" 
ON public.published_resumes 
FOR INSERT 
WITH CHECK (
  -- Rate limiting: ENABLED FOR PRODUCTION
  check_rate_limit(client_ip, 'publish', 50, 15) AND
  -- Data size validation
  validate_resume_data_size(resume_data) AND
  -- Basic content validation (for TEXT data)
  length(resume_data) > 0 AND
  -- Title length limit
  length(title) <= 200 AND
  -- Template validation
  template_name IN ('modern', 'professional', 'creative', 'elegant', 'ats', 'traditional', 'powerful', 'engineer', 'software-engineer', 'modern-a4', 'modern-two-column', 'two-column', 'gray', 'elite')
);

-- Update policy with validation
CREATE POLICY "Users can update their own resumes or anonymous updates" 
ON public.published_resumes 
FOR UPDATE 
USING (
  (user_id IS NULL OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id))
) WITH CHECK (
  -- Data size validation on update
  validate_resume_data_size(resume_data) AND
  -- Title length limit
  length(title) <= 200
);

CREATE POLICY "Users can delete their own resumes or anonymous deletes" 
ON public.published_resumes 
FOR DELETE 
USING (
  user_id IS NULL OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_published_resumes_updated_at
  BEFORE UPDATE ON public.published_resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Automatic cleanup function for old anonymous resumes
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_resumes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.published_resumes 
  WHERE user_id IS NULL 
    AND created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_published_resumes_user_id ON public.published_resumes(user_id);
CREATE INDEX idx_published_resumes_created_at ON public.published_resumes(created_at DESC);
CREATE INDEX idx_published_resumes_client_ip ON public.published_resumes(client_ip);
CREATE INDEX idx_published_resumes_rate_limit ON public.published_resumes(client_ip, created_at);

-- Create a function to get rate limit info
CREATE OR REPLACE FUNCTION get_rate_limit_info(p_client_ip INET)
RETURNS TABLE(
  requests_in_window INTEGER,
  max_requests INTEGER,
  window_minutes INTEGER,
  reset_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as requests_in_window,
    50 as max_requests, -- Updated from 10 to 50
    15 as window_minutes,
    NOW() + INTERVAL '15 minutes' as reset_time
  FROM public.published_resumes
  WHERE client_ip = p_client_ip
    AND created_at > NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for monitoring
CREATE VIEW resume_publishing_stats AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as total_resumes,
  COUNT(DISTINCT client_ip) as unique_ips,
  AVG(octet_length(resume_data::text)) as avg_data_size,
  MAX(octet_length(resume_data::text)) as max_data_size
FROM public.published_resumes
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_rate_limit(INET, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_resume_data_size(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_rate_limit_info(INET) TO anon, authenticated;
GRANT SELECT ON resume_publishing_stats TO anon, authenticated;