'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // Check for authentication errors from URL parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessages = {
        'Configuration': 'There is a problem with the server configuration.',
        'AccessDenied': 'Access denied. You do not have permission to sign in.',
        'Verification': 'The verification token has expired or has already been used.',
        'Default': 'An error occurred during authentication.',
        'OAuthSignin': 'Error in constructing an authorization URL.',
        'OAuthCallback': 'Error in handling the response from an OAuth provider.',
        'OAuthCreateAccount': 'Could not create OAuth account.',
        'EmailCreateAccount': 'Could not create account with this email.',
        'Callback': 'Error in the OAuth callback handler route.',
        'OAuthAccountNotLinked': 'Email already exists with a different provider.',
        'EmailSignin': 'Sending the e-mail with the verification token failed.',
        'CredentialsSignin': 'The credentials you provided are incorrect.',
        'SessionRequired': 'Please sign in to access this page.',
      };
      
      setError(errorMessages[errorParam] || errorMessages['Default']);
      
      // Clear the error from URL after 5 seconds
      setTimeout(() => {
        setError(null);
        // Remove error parameter from URL
        const url = new URL(window.location);
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url);
      }, 5000);
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null); // Clear any existing errors
    
    try {
      // Use NextAuth signIn with explicit callback URL
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true // Allow redirect but ensure it goes to homepage
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gray-100 text-gray-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <div className="text-center">
          <p className="text-sm font-medium">Signed in as {session.user.name}</p>
          <p className="text-xs text-gray-600">{session.user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="rounded-full border border-solid border-red-200 transition-colors flex items-center justify-center bg-red-50 text-red-600 gap-2 hover:bg-red-100 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-white text-gray-700 gap-2 hover:bg-gray-50 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 shadow-sm border-gray-200"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
