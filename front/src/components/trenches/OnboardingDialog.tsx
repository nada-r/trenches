import React, { useState } from 'react';
import {
  Dialog, DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const OnboardingDialog = () => {
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('ONBOARDING_SHOWN')
  );

  const handleOnboardingClose = () => {
    localStorage.setItem('ONBOARDING_SHOWN', 'true');
    setShowOnboarding(false);
  };

  return (
    <Dialog open={showOnboarding}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>HOW IT WORKS</DialogTitle>
        </DialogHeader>
        <ul className="list-disc list-outside m-4">
          <li>
            Explore and follow alpha callers by logging in and browsing the
            ranking page
          </li>
          <li>Buy and sell caller tokens (caller-bags) in the marketplace</li>
          <li>
            Manage your portfolio by tracking caller-bags in the portfolio
            section
          </li>
          <li>Compete in tournaments to win SOL using your caller-bags</li>
        </ul>

        <p>
          Trenches.top tokenises the reputation of alpha callers, users can
          trade and compete for rewards.
        </p>
        <DialogFooter>
          <Button onClick={() => handleOnboardingClose()}>OK</Button>
        </DialogFooter>
      </DialogContent>
      <DialogClose
    </Dialog>
  );
};

export default OnboardingDialog;