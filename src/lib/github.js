// GitHub API service for fetching repository information
export const githubService = {
  // Get README.md content from GitHub repository
  async getReadmeContent(githubUrl) {
    try {
      // Extract owner and repo from GitHub URL
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = githubUrl.match(urlPattern);
      
      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }
      
      const [, owner, repo] = match;
      
      // Fetch README.md content from GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Readme-Fetcher'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('README.md not found in repository');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Decode base64 content
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      
      return {
        content: content,
        size: data.size,
        sha: data.sha,
        downloadUrl: data.download_url
      };
    } catch (error) {
      console.error('Error fetching README content:', error);
      throw error;
    }
  }
};
