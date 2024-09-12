import React from 'react';
import { Token } from '@/app/portfolio/page';
import CallerCard from '@/components/trenches/CallerCard';
import { Button } from '@/components/ui/button';

interface CallerTournamentCardProps extends Token {
  onSelect: (token: Token) => void;
}
interface CallerTournamentCardProps extends Token {
  onSelect: (token: Token) => void;
  isSelected: boolean;
}
const CallerTournamentCard: React.FC<CallerTournamentCardProps> = ({
  onSelect,
  isSelected,
  ...token
}) => {
  const handleSelect = () => {
    onSelect(token);
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <div>
        <CallerCard {...token} />
        <Button variant="link" disabled={isSelected} onClick={handleSelect}>
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </div>
  );
};
export default CallerTournamentCard;
