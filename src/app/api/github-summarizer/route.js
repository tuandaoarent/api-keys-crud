import { NextResponse } from 'next/server';
import { apiKeysService } from '../../../lib/api-keys';
import { githubService } from '../../../lib/github';

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
      const readmeData = await githubService.getReadmeContent(githubUrl);
      
      // Summarize the README content using LangChain
      const summary = await githubService.summarizeReadme(readmeData.content);
      
      return NextResponse.json({
        isValid: true,
        githubUrl: githubUrl,
        readmeData: readmeData,
        summary: summary
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
