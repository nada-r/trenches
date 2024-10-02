'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginInfo() {
  const searchParams = useSearchParams();

  // Log searchParams entries
  console.log('Search Parameters:');
  searchParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  return (
    <div>
      <h2>Query Parameters:</h2>
      <ul>
        {Array.from(searchParams.entries()).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

const Login = () => {
  return (
    <Suspense>
      <LoginInfo />
    </Suspense>
  );
};

export default Login;