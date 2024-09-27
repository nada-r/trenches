import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import OnboardingDialog from '@/components/trenches/OnboardingDialog';
import Logo from '~/svg/Logo.svg';
import { FaCircleUser } from 'react-icons/fa6';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [title, setTitle] = useState('');

  const openProfile = () => {
    localStorage.setItem('previousPage', pathname);
    router.push('/profile');
  };

  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <header className="flex flex-row items-center gap-3 text-white my-1 mr-4 ml-2 ">
        <Logo className="w-8" />
        {/*<div className="text-center">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>*/}
        <div className="flex flex-wrap gap-x-2 text-sm w-36">
          <a
            href="https://x.com/trenchestop"
            target="_blank"
            rel="noopener noreferrer"
          >
            [twitter]
          </a>
          <a
            href="https://t.me/trenchestopbot"
            target="_blank"
            rel="noopener noreferrer"
          >
            [caller bot]
          </a>
          <a
            href="https://t.me/+CdKFzSF17hU0N2Q9"
            target="_blank"
            rel="noopener noreferrer"
          >
            [chat]
          </a>
          <OnboardingDialog
            showOnboarding={showOnboarding}
            handleOnboardingClose={handleOnboardingClose}
          >
            <a href="#" onClick={() => setShowOnboarding(true)}>
              [how it works]
            </a>
          </OnboardingDialog>
        </div>
        <div className="flex-grow"></div>
        <FaCircleUser size={20} onClick={openProfile} />
      </header>
    </>
  );
}
