import { NextResponse } from 'next/server';
import { checkRateLimit, incrementUsage } from '../../../lib/rate-limiter';
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

    // Check rate limit using utility function
    const rateLimitResult = await checkRateLimit(apiKey.trim());

    if (!rateLimitResult.isValid) {
      const statusCode = rateLimitResult.error.includes('Rate limit exceeded') ? 429 : 401;
      return NextResponse.json({
        isValid: false,
        error: rateLimitResult.error
      }, { status: statusCode });
    }

    const keyInfo = rateLimitResult.keyInfo;
    const currentUsage = keyInfo.usage_count || 0;

    // Increment usage count for the API key
    await incrementUsage(keyInfo.id, currentUsage);

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
  } catch (error) {
    console.error('Error in github-summarizer:', error);
    
    // Handle rate limit errors
    if (error.message.includes('Rate limit exceeded')) {
      return NextResponse.json(
        { 
          isValid: false, 
          error: error.message
        },
        { status: 429 }
      );
    }

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
