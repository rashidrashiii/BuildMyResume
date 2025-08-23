import { supabase } from '@/integrations/supabase/client';

interface ResumeCounterData {
  count: number;
  lastUpdated: string;
}

class ResumeCounterService {
  private static cache: ResumeCounterData | null = null;
  private static cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private static lastFetch = 0;
  private static incrementQueue: Set<string> = new Set(); // Track resumes that have been incremented

  // Get the current count with caching
  static async getCount(): Promise<{ count: number; error: string | null }> {
    try {
      const now = Date.now();
      
      // Return cached data if still valid
      if (this.cache && (now - this.lastFetch) < this.cacheExpiry) {
        return { count: this.cache.count, error: null };
      }

      // Fetch fresh data from Supabase
      const { data, error } = await supabase
        .from('resume_counter')
        .select('total_resumes, last_updated')
        .eq('id', 1)
        .single();

      if (error) {
        return { count: 0, error: 'Failed to fetch resume count' };
      }

      // Update cache
      this.cache = {
        count: data.total_resumes,
        lastUpdated: data.last_updated
      };
      this.lastFetch = now;

      return { count: data.total_resumes, error: null };
    } catch (error) {
      return { count: 0, error: 'Network error' };
    }
  }

  // Increment the counter for a specific resume (prevents duplicate increments)
  static async incrementForResume(resumeId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Check if this resume has already been counted
      if (this.incrementQueue.has(resumeId)) {
        return { success: true, error: null }; // Already counted
      }

      // Call the increment function
      const { data, error } = await supabase
        .rpc('increment_resume_counter');

      if (error) {
        return { success: false, error: 'Failed to increment counter' };
      }

      // Mark this resume as counted
      this.incrementQueue.add(resumeId);

      // Update cache
      if (this.cache) {
        this.cache.count = data;
        this.cache.lastUpdated = new Date().toISOString();
      }

      // Dispatch custom event to notify components to refresh
      window.dispatchEvent(new CustomEvent('resumeCounterUpdated'));

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Clear cache (useful for testing or manual refresh)
  static clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }

  // Clear increment queue (useful for testing)
  static clearIncrementQueue(): void {
    this.incrementQueue.clear();
  }

  // Get cache status for debugging
  static getCacheStatus(): { hasCache: boolean; cacheAge: number; queueSize: number } {
    const now = Date.now();
    return {
      hasCache: this.cache !== null,
      cacheAge: this.lastFetch > 0 ? now - this.lastFetch : 0,
      queueSize: this.incrementQueue.size
    };
  }
}

export default ResumeCounterService;
