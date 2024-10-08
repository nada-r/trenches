'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ProfileProvider } from '@/contexts/ProfileContext';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <PrivyProvider
        appId="cm0qi5mm102aet5utw5rvzxu6"
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            walletList: [],
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <ProfileProvider>{children}</ProfileProvider>
      </PrivyProvider>
    </PostHogProvider>
  );
}
