import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Player, PlayerSchema } from '@/models';
import { useLogout, usePrivy, WalletWithMetadata } from '@privy-io/react-auth';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { useRouter } from 'next/navigation';

type ProfileContext = {
  profile: Player | undefined;
  walletPubkey: string | undefined;
  logout: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContext | undefined>(undefined);

const instance = createAxiosInstance();

export const ProfileProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<Player>();
  const router = useRouter();

  const { user } = usePrivy();

  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  const walletPubkey = solanaWallet?.address;

  useEffect(() => {
    if (solanaWallet) {
      const fetchProfile = async () => {
        try {
          const response = await instance.post('/profile/my', {
            walletPubkey: solanaWallet?.address,
          });
          setProfile(PlayerSchema.parse(response.data));
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfile();
    }
  }, [solanaWallet]);

  const { logout } = useLogout({
    onSuccess: () => {
      setProfile(undefined);
      router.push('/');
    },
  });

  return (
    <ProfileContext.Provider value={{ profile, walletPubkey, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};
