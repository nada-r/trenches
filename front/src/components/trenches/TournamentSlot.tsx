import React from 'react';
import CallerCard from '@/components/trenches/CallerCard';
import { FaTimes } from 'react-icons/fa';
import { Caller } from '@/models';

interface CallerTournamentCardProps {
  participationClosed: boolean;
  caller: Caller | undefined;
  onUnselect: (caller: Caller) => void;
}

const TournamentSlot: React.FC<CallerTournamentCardProps> = ({
  participationClosed,
  caller,
  onUnselect,
}) => {
  return (
    <>
      <div className="text-neutral-500 bg-neutral-800 border border-neutral-500 rounded-2xl text-center min-h-36 flex items-center justify-center">
        {caller ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <CallerCard {...caller} marketCap={0} balance={0} />
            {!participationClosed && (
              <FaTimes
                onClick={() => onUnselect(caller)}
                className="mt-1 cursor-pointer"
              />
            )}
          </div>
        ) : (
          <span>Slot</span>
        )}
      </div>
    </>
  );
};

export default TournamentSlot;