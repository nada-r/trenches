import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OnboardingDialog = ({
  showOnboarding,
  handleOnboardingClose,
  children,
}: {
  showOnboarding: boolean;
  handleOnboardingClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          <li>Add the bot to your telegram group to log your calls</li>
        </ul>

        <p>
          Trenches.top tokenises the reputation of alpha callers, users can
          trade and compete for rewards.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button>OK</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
