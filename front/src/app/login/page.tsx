'use client';

import * as React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const { authenticated, user, ready } = usePrivy();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (ready && authenticated && user) {
      // Fetch user information when the user is authenticated
      user.get().then((data) => {
        setUserInfo(data);
      });
    }
  }, [ready, authenticated, user]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You are not logged in. Please login to view your info.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">User Information</h1>
      {userInfo ? (
        <pre className="mt-4 p-4 bg-gray-100 rounded-md">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}

