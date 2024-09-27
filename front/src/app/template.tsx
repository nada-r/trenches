'use client';

import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingDialog from '@/components/trenches/OnboardingDialog';

export default function Template({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <div className="flex flex-col h-screen">
      {authenticated && <Header />}

      <main className="flex-1 p-4">{children}</main>

      {authenticated && <OnboardingDialog />}

      {authenticated && <Footer />}
    </div>
  );
}