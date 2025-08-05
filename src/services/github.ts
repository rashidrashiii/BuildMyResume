interface GitHubRepoData {
  stargazers_count: number;
  forks_count: number;
  description: string;
  language: string;
  updated_at: string;
}

export const fetchGitHubRepoData = async (): Promise<GitHubRepoData | null> => {
  try {
    const response = await fetch('https://api.github.com/repos/rashidrashiii/BuildMyResume', {
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BuildMyResume'
  }
});
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      description: data.description,
      language: data.language,
      updated_at: data.updated_at
    };
  } catch (error) {
    // Log error for debugging but don't expose to user
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching GitHub data:', error);
    }
    return null;
  }
};

export const formatStarCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}; 