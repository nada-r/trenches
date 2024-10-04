'use client';

import * as React from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function LoginPage() {
  const { authenticated, user, ready } = usePrivy();


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
      {user ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <ul>
            {Object.entries(user).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user information available</p>
      )}
    </div>
  );
}

