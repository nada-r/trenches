import React from 'react';
import { Token } from '@/app/portfolio/page';
import CallerCard from '@/components/trenches/CallerCard';
import { FaTimes } from 'react-icons/fa';

interface CallerTournamentCardProps {
  token: Token | undefined;
  onUnselect: (token: Token) => void;
}

const TournamentSlot: React.FC<CallerTournamentCardProps> = ({
  token,
  onUnselect,
}) => {
  return (
    <>
      <div className="text-neutral-500 bg-neutral-800 border border-neutral-500 rounded-2xl text-center min-h-36 flex items-center justify-center">
        {token ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <CallerCard {...token} />
            <FaTimes
              onClick={() => onUnselect(token)}
              className="mt-1 cursor-pointer"
            />
          </div>
        ) : (
          <span>Slot</span>
        )}
      </div>
    </>
  );
};

export default TournamentSlot;