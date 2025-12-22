import { getCache, setCache, isCacheValid } from './storage';

const GITHUB_REPO = 'fuck-algorithm/leetcode-240-search-a-2d-matrix-ii';
const CACHE_KEY = 'github_stars';
const CACHE_TTL = 60 * 60 * 1000; // 1小时

interface GitHubRepoInfo {
  stargazers_count: number;
}

export async function getGitHubStars(): Promise<number> {
  // 检查缓存是否有效
  const isValid = await isCacheValid(CACHE_KEY);
  if (isValid) {
    const cached = await getCache<number>(CACHE_KEY);
    if (cached !== null) {
      return cached;
    }
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubRepoInfo = await response.json();
    const stars = data.stargazers_count;

    // 保存到缓存
    await setCache(CACHE_KEY, stars, CACHE_TTL);

    return stars;
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);
    
    // 尝试获取过期的缓存
    const cached = await getCache<number>(CACHE_KEY);
    if (cached !== null) {
      return cached;
    }
    
    return 0;
  }
}

export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;
