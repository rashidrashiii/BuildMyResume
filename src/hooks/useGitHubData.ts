import { useState, useEffect } from 'react';
import { fetchGitHubRepoData, formatStarCount } from '@/services/github';

interface GitHubRepoData {
  stargazers_count: number;
  forks_count: number;
  description: string;
  language: string;
  updated_at: string;
}

interface UseGitHubDataReturn {
  data: GitHubRepoData | null;
  loading: boolean;
  error: string | null;
  formattedStarCount: string;
  formattedForkCount: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'github_repo_data';

const getCachedData = (): { data: GitHubRepoData; timestamp: number } | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp < CACHE_DURATION) {
      return { data, timestamp };
    }
    
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

const setCachedData = (data: GitHubRepoData): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    // Log error for debugging but don't expose to user
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caching GitHub data:', error);
    }
  }
};

export const useGitHubData = (): UseGitHubDataReturn => {
  const [data, setData] = useState<GitHubRepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cached = getCachedData();
        if (cached) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const freshData = await fetchGitHubRepoData();
        if (freshData) {
          setData(freshData);
          setCachedData(freshData);
        } else {
          setError('Failed to fetch GitHub data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formattedStarCount = data ? formatStarCount(data.stargazers_count) : '0';
  const formattedForkCount = data ? formatStarCount(data.forks_count) : '0';

  return {
    data,
    loading,
    error,
    formattedStarCount,
    formattedForkCount
  };
}; 