'use client';

import Head from 'next/head';
import * as React from 'react';
import { useState, useEffect } from 'react';
import '@/lib/env';
import {
  usePrivy,
  useSolanaWallets,
  WalletWithMetadata,
} from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { createWallet } = useSolanaWallets();
  const [solanaWalletError, setSolanaWalletError] = useState(false);


  // Create a Solana wallet if the user doesn't have one
  const checkAndCreateWallet = async () => {
    const hasExistingSolanaWallet = !!user?.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

    if (!hasExistingSolanaWallet) {
      try {
        await createWallet();
        router.push('ranking');
      } catch (e) {
        console.log(e);
        setSolanaWalletError(true);
      } 
    } else {
      router.push('ranking');
    }
  };

  useEffect(() => {
    if (ready && authenticated && user?.telegram) {
      checkAndCreateWallet();
    }
  }, [ready, authenticated]);

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated && user?.telegram);

  //console.log(process.env);
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section>
        <div className="layout relative flex min-h-[calc(100dvh)] flex-col items-center justify-center py-12 text-center">
          <img src="images/logo.png" className="w-16 h-16" alt="Logo" />
          <h1 className="mt-4">Welcome to trenches.top</h1>

          <p className="mt-2 text-sm">
            Find alpha, discover the best callers, make it out of the trenches{' '}
          </p>

          <Button className="mt-6" onClick={() => window.location.href = "https://t.me/trenchestopbot?start="} variant="outline">
            {disableLogin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {disableLogin ? 'Loading' : 'Login with Telegram'}
          </Button>
          {solanaWalletError && (
            <p className="text-red-500">
              Error with wallet creation, reload the page and try again
            </p>
          )}

          <footer className="absolute bottom-2">
            © {new Date().getFullYear()} By{' '}
            <Link href="https://trenches.top" className="underline">
              trenches.top
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}