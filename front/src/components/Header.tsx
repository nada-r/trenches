import { usePrivy, WalletWithMetadata } from '@privy-io/react-auth';

export default function Header() {
  const { user } = usePrivy();

  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  return (
    <header className="bg-gray-900 text-white py-4 px-6">
      <nav className="flex justify-between items-center">
        <div className="font-bold text-lg">{solanaWallet?.address}</div>
      </nav>
    </header>
  );
}
