'use client';

import { usePrivy } from '@privy-io/react-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

export default function Template({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <div className="flex flex-col h-screen">
      {authenticated && <Header />}

      <main className="flex-1 p-2">{children}</main>

      <Toaster position="top-right" richColors />

      {/*{authenticated && <OnboardingDialog />}*/}

      {authenticated && <Footer />}
    </div>
  );
}