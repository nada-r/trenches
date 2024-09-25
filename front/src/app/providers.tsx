'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ProfileProvider } from '@/contexts/ProfileContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm0qi5mm102aet5utw5rvzxu6"
      config={{
        // Customize Privy's appearance in your app
        loginMethods: ['email'],
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
  );
}
