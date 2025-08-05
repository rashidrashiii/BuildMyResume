import { supabase } from '@/integrations/supabase/client';
import { checkRateLimit, validateResumeData, SECURITY_CONFIG } from '@/utils/security';

export interface PublishedResume {
  id: string;
  user_id: string | null;
  resume_data: string;
  title: string;
  template_name: string;
  created_at: string;
  updated_at: string;
  client_ip?: string;
  user_agent?: string;
  data_size?: number;
}

export interface RateLimitInfo {
  requests_in_window: number;
  max_requests: number;
  window_minutes: number;
  reset_time: string;
}

export class PublishedResumeService {
  private static getClientInfo() {
    return {
      client_ip: this.getClientIP(),
      user_agent: navigator.userAgent
    };
  }

  private static getClientIP(): string {
    // In a real application, you would get this from the request headers
    // For now, return a placeholder - this should be implemented based on your deployment environment
    return 'unknown';
  }

  static async checkRateLimit(): Promise<{ allowed: boolean; info?: RateLimitInfo; error?: string }> {
    try {
      const clientIP = this.getClientIP();
      
      const { data, error } = await supabase
        .rpc('get_rate_limit_info', { p_client_ip: clientIP });

      if (error) {
        if (error.code === 'PGRST202' || error.message?.includes('function') || error.message?.includes('not found')) {
          return { allowed: true };
        }
        
        return { allowed: false, error: 'Failed to check rate limit' };
      }

      if (data && data.length > 0) {
        const info = data[0] as RateLimitInfo;
        const allowed = info.requests_in_window < info.max_requests;
        
        return { 
          allowed, 
          info,
          error: allowed ? undefined : `Rate limit exceeded. Please try again after ${new Date(info.reset_time).toLocaleString()}`
        };
      }

      return { allowed: true };
    } catch (error) {
      return { allowed: true };
    }
  }

  static async publishResume(
    encryptedResumeData: string,
    title?: string,
    existingId?: string
  ): Promise<{ data: PublishedResume | null; error: string | null }> {
    const resumeTitle = title || 'Resume';
    
    try {
      if (SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
        const clientRateLimit = checkRateLimit('resume_publish');
        if (!clientRateLimit.allowed) {
          return { 
            data: null, 
            error: `Rate limit exceeded. Please try again in ${Math.ceil((clientRateLimit.resetTime! - Date.now()) / 60000)} minutes.` 
          };
        }
      }

      const clientInfo = this.getClientInfo();

      if (existingId) {
        const { data, error } = await supabase
          .from('published_resumes')
          .update({
            resume_data: encryptedResumeData,
            title: resumeTitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingId)
          .select()
          .single();

        if (error) {
          if (error.code === '23514') {
            return { data: null, error: 'Resume data too large or invalid format' };
          }
          if (error.code === '23505') {
            return { data: null, error: 'Duplicate resume detected' };
          }
          if (error.message?.includes('rate limit')) {
            return { data: null, error: 'Rate limit exceeded. Please try again later.' };
          }
          
          return { data: null, error: 'Failed to publish resume' };
        }

        return { data: data as unknown as PublishedResume, error: null };
      } else {
        const { data, error } = await supabase
          .from('published_resumes')
          .insert({
            resume_data: encryptedResumeData,
            title: resumeTitle,
            user_id: null
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23514') {
            return { data: null, error: 'Resume data too large or invalid format' };
          }
          if (error.code === '23505') {
            return { data: null, error: 'Duplicate resume detected' };
          }
          if (error.message?.includes('rate limit')) {
            return { data: null, error: 'Rate limit exceeded. Please try again later.' };
          }
          
          return { data: null, error: 'Failed to publish resume' };
        }

        return { data: data as unknown as PublishedResume, error: null };
      }
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  static async getPublishedResume(id: string): Promise<{ data: PublishedResume | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('published_resumes')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: 'Resume not found' };
      }

      return { data: data as unknown as PublishedResume, error: null };
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  static async deletePublishedResume(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('published_resumes')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: 'Failed to delete resume' };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  static async getPublishingStats(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('resume_publishing_stats')
        .select('*')
        .order('hour', { ascending: false })
        .limit(24);

      if (error) {
        if (error.code === 'PGRST202' || error.message?.includes('relation') || error.message?.includes('not found')) {
          return { data: [], error: null };
        }
        
        return { data: null, error: 'Failed to fetch statistics' };
      }

      return { data, error: null };
    } catch (error) {
      return { data: [], error: null };
    }
  }

  static async cleanupOldResumes(): Promise<{ deletedCount: number | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('cleanup_old_anonymous_resumes');

      if (error) {
        if (error.code === 'PGRST202' || error.message?.includes('function') || error.message?.includes('not found')) {
          return { deletedCount: 0, error: 'Cleanup function not available' };
        }
        
        return { deletedCount: null, error: 'Failed to cleanup old resumes' };
      }

      return { deletedCount: data, error: null };
    } catch (error) {
      return { deletedCount: 0, error: 'Cleanup function not available' };
    }
  }
}