'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { usePrivy, WalletWithMetadata } from '@privy-io/react-auth';
import TruncatedAddress from '@/components/utils/SlicedAddress';

export default function ProfilePage() {
  const router = useRouter();
  const [previousPage, setPreviousPage] = useState('/');

  const { user } = usePrivy();
  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  useEffect(() => {
    const storedPreviousPage = localStorage.getItem('previousPage');
    if (storedPreviousPage) {
      setPreviousPage(storedPreviousPage);
    } else {
      setPreviousPage('/ranking');
    }
  }, []);

  const handleCloseProfile = () => {
    router.push(previousPage);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-4">
        <IoClose
          onClick={handleCloseProfile}
          className="text-2xl cursor-pointer"
        />
      </div>
      {solanaWallet && (
        <div className="">
          <TruncatedAddress address={solanaWallet?.address} />
        </div>
      )}
    </div>
  );
}