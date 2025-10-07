import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

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
  },

  // Get repository metadata (stars, latest version, etc.)
  async getRepositoryMetadata(githubUrl) {
    try {
      // Extract owner and repo from GitHub URL
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = githubUrl.match(urlPattern);
      
      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }
      
      const [, owner, repo] = match;
      
      // Fetch repository information and latest release in parallel
      const [repoResponse, releaseResponse] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Repo-Fetcher'
          }
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Release-Fetcher'
          }
        })
      ]);
      
      // Handle repository response
      if (repoResponse.status === 'rejected' || !repoResponse.value.ok) {
        throw new Error(`GitHub API error: ${repoResponse.value?.status || 'Network error'}`);
      }
      
      const repoData = await repoResponse.value.json();
      
      // Handle release response (optional, so we don't fail if no releases exist)
      let latestRelease = null;
      if (releaseResponse.status === 'fulfilled' && releaseResponse.value.ok) {
        try {
          latestRelease = await releaseResponse.value.json();
        } catch (error) {
          console.log('Error parsing release data:', error.message);
        }
      }
      
      return {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        description: repoData.description,
        topics: repoData.topics || [],
        license: repoData.license?.name || null,
        latestRelease: latestRelease ? {
          version: latestRelease.tag_name,
          publishedAt: latestRelease.published_at,
          name: latestRelease.name
        } : null
      };
    } catch (error) {
      console.error('Error fetching repository metadata:', error);
      throw error;
    }
  },

  // Summarize README content using LangChain
  async summarizeReadme(readmeContent) {
    try {
      // Define the output schema
      const schema = z.object({
        summary: z.string().describe('A comprehensive summary of the GitHub repository'),
        cool_facts: z.array(z.string()).describe('A list of interesting facts about the repository')
      });

      // Create the output parser
      const parser = StructuredOutputParser.fromZodSchema(schema);

      // Create the prompt template
      const prompt = ChatPromptTemplate.fromTemplate(`
        Summarize this GitHub repository from this README content:
        
        {readmeContent}
        
        {format_instructions}
      `);

      // Initialize the LLM
      const llm = new ChatAnthropic({
        modelName: 'claude-3-haiku-20240307',
        temperature: 0.7,
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      // Create the chain
      const chain = prompt.pipe(llm).pipe(parser);

      // Invoke the chain
      const result = await chain.invoke({
        readmeContent: readmeContent,
        format_instructions: parser.getFormatInstructions()
      });

      return result;
    } catch (error) {
      console.error('Error summarizing README content:', error);
      throw error;
    }
  }
};
