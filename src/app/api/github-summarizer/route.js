import { NextResponse } from 'next/server';
import { apiKeysService } from '../../../lib/api-keys';

// Function to get README.md content from GitHub repository
async function getReadmeContent(githubUrl) {
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

export async function POST(request) {
  try {
    // Get API key from x-api-key header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'x-api-key header is required' 
        },
        { status: 400 }
      );
    }

    if (!apiKey.trim()) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'API key is required' 
        },
        { status: 400 }
      );
    }

    // Get GitHub URL from request body
    const { githubUrl } = await request.json();

    if (!githubUrl || !githubUrl.trim()) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'GitHub URL is required' 
        },
        { status: 400 }
      );
    }

    // Validate the API key using the existing service
    const keyInfo = await apiKeysService.validateKey(apiKey.trim());

    if (keyInfo) {
      // Fetch README.md content from GitHub repository
      const readmeContent = await getReadmeContent(githubUrl);
      
      return NextResponse.json({
        isValid: true,
        githubUrl: githubUrl,
        readmeContent: readmeContent
      });
    } else {
      return NextResponse.json({
        isValid: false,
        error: 'API key not found or invalid'
      }, { status: 401 }); // Unauthorized
    }
  } catch (error) {
    console.error('Error in github-summarizer:', error);
    
    // Handle specific GitHub API errors
    if (error.message.includes('Invalid GitHub URL format')) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'Invalid GitHub URL format. Please provide a valid GitHub repository URL.' 
        },
        { status: 400 }
      );
    }
    
    if (error.message.includes('README.md not found')) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'README.md not found in the specified repository.' 
        },
        { status: 404 }
      );
    }
    
    if (error.message.includes('GitHub API error')) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'Failed to fetch repository information from GitHub.' 
        },
        { status: 502 }
      );
    }
    
    return NextResponse.json(
      { 
        isValid: false, 
        error: 'An error occurred while processing the request.' 
      },
      { status: 500 }
    );
  }
}
