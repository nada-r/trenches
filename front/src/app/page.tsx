'use client';

import Head from 'next/head';
import * as React from 'react';
import { useState } from 'react';
import '@/lib/env';

import Logo from '~/svg/Logo.svg';
import {
  useLogin,
  usePrivy,
  useSolanaWallets,
  WalletWithMetadata,
} from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { createWallet } = useSolanaWallets();
  const [solanaWalletError, setSolanaWalletError] = useState(false);
  const { login } = useLogin({
    onComplete: (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      console.log(
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount
      );

      const hasExistingSolanaWallet = !!user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
          account.type === 'wallet' &&
          account.walletClientType === 'privy' &&
          account.chainType === 'solana'
      );

      if (!hasExistingSolanaWallet) {
        createWallet()
          .then((walletWithMetadata) => {
            router.push('ranking');
          })
          .catch((e) => {
            console.log(e);
            setSolanaWalletError(true);
          });
      } else {
        router.push('ranking');
      }
    },
  });

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  //console.log(process.env);
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section>
        <div className="layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center">
          <Logo className="w-16" />
          <h1 className="mt-4">Welcome to trenches.top</h1>

          <p className="mt-2 text-sm">
            Find alpha, discover the best callers, make it out of the trenches{' '}
          </p>

          <Button className="mt-6" onClick={login} variant="outline">
            {disableLogin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {disableLogin ? 'Loading' : 'Start'}
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
