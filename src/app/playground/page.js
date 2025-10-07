'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import NotificationPopup, { NOTIFICATION_TYPES } from '../../components/NotificationPopup';

export default function PlaygroundPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: NOTIFICATION_TYPES.SUCCESS
  });

  // Helper function to show notifications
  const showNotification = (message, type = NOTIFICATION_TYPES.SUCCESS) => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };


  const summarizeGitHubRepo = async (keyToUse, repoUrl) => {
    try {
      // Call the GitHub summarizer API endpoint
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': keyToUse,
        },
        body: JSON.stringify({ githubUrl: repoUrl }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          isValid: false,
          error: result.error || 'Failed to summarize GitHub repository'
        };
      }

      return result;
    } catch (error) {
      console.error('Error summarizing GitHub repository:', error);
      return {
        isValid: false,
        error: 'Failed to summarize GitHub repository. Please try again.'
      };
    }
  };


  const handleSummarySubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', NOTIFICATION_TYPES.ERROR);
      return;
    }

    if (!githubUrl.trim()) {
      showNotification('Please enter a GitHub repository URL', NOTIFICATION_TYPES.ERROR);
      return;
    }

    setIsSummarizing(true);
    setSummaryResult(null);

    try {
      const result = await summarizeGitHubRepo(apiKey.trim(), githubUrl.trim());
      setSummaryResult(result);
      
      if (result.isValid) {
        showNotification('GitHub repository summarized successfully!', NOTIFICATION_TYPES.SUCCESS);
      } else {
        showNotification(result.error, NOTIFICATION_TYPES.ERROR);
      }
    } catch (error) {
      console.error('Summary error:', error);
      showNotification('An error occurred during summarization', NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setGithubUrl('');
    setSummaryResult(null);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Notification Popup */}
          <NotificationPopup
            show={notification.show}
            onClose={hideNotification}
            message={notification.message}
            type={notification.type}
          />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
            <p className="text-gray-600">
              Summarize GitHub repositories using our AI-powered analysis.
            </p>
          </div>

          {/* GitHub Repository Summarizer Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">GitHub Repository Summarizer</h2>
            
            <form onSubmit={handleSummarySubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKeySummary" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="apiKeySummary"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder-gray-500 text-gray-900"
                    placeholder="Enter your API key (e.g., tvly-dev-...)"
                    disabled={isSummarizing}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 text-gray-900"
                    placeholder="https://github.com/owner/repository"
                    disabled={isSummarizing}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSummarizing || !apiKey.trim() || !githubUrl.trim()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSummarizing && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isSummarizing ? 'Analyzing...' : 'Summarize Repository'}
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSummarizing}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>
            </form>
          </div>


          {/* Summary Results */}
          {summaryResult && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Analysis</h3>
              
              {summaryResult.isValid ? (
                <div className="space-y-6">
                  {/* Repository Metadata */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Repository Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Stars:</span>
                        <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.stars?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Forks:</span>
                        <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.forks?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Language:</span>
                        <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.language || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Open Issues:</span>
                        <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.openIssues || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">License:</span>
                        <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.license || 'N/A'}</span>
                      </div>
                      {summaryResult.repositoryMetadata.latestRelease && (
                        <div>
                          <span className="text-blue-600 font-medium">Latest Version:</span>
                          <span className="ml-2 font-medium text-gray-900">{summaryResult.repositoryMetadata.latestRelease.version}</span>
                        </div>
                      )}
                    </div>
                    {summaryResult.repositoryMetadata.description && (
                      <div className="mt-3">
                        <span className="text-blue-600 font-medium">Description:</span>
                        <p className="mt-1 text-gray-900">{summaryResult.repositoryMetadata.description}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">AI Summary</h4>
                    <p className="text-gray-800 leading-relaxed">{summaryResult.summary.summary}</p>
                  </div>

                  {/* Cool Facts */}
                  {summaryResult.summary.cool_facts && summaryResult.summary.cool_facts.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Interesting Facts</h4>
                      <ul className="space-y-2">
                        {summaryResult.summary.cool_facts.map((fact, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-800">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Topics */}
                  {summaryResult.repositoryMetadata.topics && summaryResult.repositoryMetadata.topics.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {summaryResult.repositoryMetadata.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Failed to analyze repository</span>
                </div>
              )}
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Enter your API key in the input field above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Enter a GitHub repository URL to get AI-powered analysis and summary</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Click &quot;Summarize Repository&quot; to analyze the repository</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>View repository metadata including stars, forks, language, and latest version</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Get intelligent insights and interesting facts about the repository</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
