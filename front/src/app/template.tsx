'use client';

import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';

export default function Template({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <div className="flex flex-col h-screen">
      {authenticated && <Header />}

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}