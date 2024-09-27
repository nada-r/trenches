'use client';

import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Template({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <div className="flex flex-col h-screen lg:max-w-2xl">
      {authenticated && <Header />}

      <main className="flex-1 p-2">{children}</main>

      {/*{authenticated && <OnboardingDialog />}*/}

      {authenticated && <Footer />}
    </div>
  );
}