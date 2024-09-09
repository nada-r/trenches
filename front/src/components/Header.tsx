import { usePrivy, WalletWithMetadata } from '@privy-io/react-auth';
import ProfileIcon from '@/components/icons/ProfileIcon';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = usePrivy();
  const router = useRouter();

  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  const openProfile = () => {
    localStorage.setItem('previousPage', window.location.pathname);
    router.push('/profile');
  };

  return (
    <header className="text-white py-4 px-6">
      <nav className="flex justify-between items-center">
        <div onClick={openProfile}>
          <ProfileIcon />
        </div>
      </nav>
    </header>
  );
}
