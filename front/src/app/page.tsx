'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';
import UnderlineLink from '@/components/links/UnderlineLink';

import Logo from '~/svg/Logo.svg';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Button from '@/components/buttons/Button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
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
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
      router.push('ranking');
    },
  });
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  console.log(process.env);
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

          <Button
            className="mt-6"
            isLoading={disableLogin}
            onClick={login}
            variant="light"
          >
            connect wallet
          </Button>

          <footer className="absolute bottom-2">
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href="https://trenches.top">
              trenches.top
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
