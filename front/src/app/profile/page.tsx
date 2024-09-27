'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import TruncatedAddress from '@/components/utils/SlicedAddress';
import { useProfileContext } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button'; // Add this import

export default function ProfilePage() {
  const router = useRouter();
  const [previousPage, setPreviousPage] = useState('/');

  const { walletPubkey, logout } = useProfileContext();

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

  const handleDisplayOnboarding = () => {
    localStorage.removeItem('ONBOARDING_SHOWN');
    location.reload();
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-4">
        <IoClose
          onClick={handleCloseProfile}
          className="text-2xl cursor-pointer"
        />
      </div>
      {walletPubkey && (
        <>
          <div className="">
            <TruncatedAddress address={walletPubkey} />
          </div>
          <Button variant="link" className="mt-4" onClick={logout}>
            Logout
          </Button>
          {/* Add the new button here */}
          <Button
            variant="link"
            className="mt-4"
            onClick={handleDisplayOnboarding}
          >
            Show Onboarding
          </Button>
        </>
      )}
    </div>
  );
}