'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [currentUrl, setCurrentUrl] = useState('SSR');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUrl(window.location.href);
    
    console.log('Auth Debug Info:');
    console.log('Status:', status);
    console.log('Session:', session);
    console.log('Environment check:');
    console.log('- NEXTAUTH_URL:', process.env.NEXT_PUBLIC_NEXTAUTH_URL);
    console.log('- Current URL:', window.location.href);
  }, [session, status]);

  if (!isClient) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg text-xs max-w-sm z-50 border-2 border-yellow-400">
        <h3 className="font-bold mb-2 text-yellow-200">🔍 Auth Debug</h3>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg text-xs max-w-sm z-50 border-2 border-yellow-400">
      <h3 className="font-bold mb-2 text-yellow-200">🔍 Auth Debug</h3>
      <p>Status: <span className="font-mono">{status}</span></p>
      <p>Session: <span className="font-mono">{session ? 'Yes' : 'No'}</span></p>
      <p>User: <span className="font-mono">{session?.user?.name || 'None'}</span></p>
      <p>URL: <span className="font-mono text-xs break-all">{currentUrl}</span></p>
    </div>
  );
}
