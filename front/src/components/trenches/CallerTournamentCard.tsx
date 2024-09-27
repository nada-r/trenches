import React from 'react';
import CallerCard from '@/components/trenches/CallerCard';
import { Button } from '@/components/ui/button';
import { Caller } from '@/models';

interface CallerTournamentCardProps extends Caller {
  participationClosed: boolean;
  onSelect: (caller: Caller) => void;
  isSelected: boolean;
}
const CallerTournamentCard: React.FC<CallerTournamentCardProps> = ({
  participationClosed,
  onSelect,
  isSelected,
  ...caller
}) => {
  const handleSelect = () => {
    onSelect(caller);
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <div className={isSelected ? 'opacity-50' : 'opacity-1'}>
        <CallerCard {...caller} balance={0} marketCap={0} />
        {!participationClosed && (
          <Button variant="link" disabled={isSelected} onClick={handleSelect}>
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        )}
      </div>
    </div>
  );
};
export default CallerTournamentCard;
