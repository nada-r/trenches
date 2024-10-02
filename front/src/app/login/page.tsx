'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const Login = () => {
  const searchParams = useSearchParams();

  return (
    <div>
      <h2>Query Parameters:</h2>
      {Object.entries(searchParams).length > 0 ? (
        <ul>
          {Object.entries(searchParams).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No query parameters found.</p>
      )}
    </div>
  );
};

export default Login;