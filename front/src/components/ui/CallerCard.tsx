import React from 'react';
import RankingImage from '@/components/ui/RankingImage';
import SimCardIcon from '@/components/icons/SimCardIcon';
import { Token } from '@/app/portfolio/page';

export function getSimCardType(balance: number): string {
  if (balance >= 1e9) {
    return 'gold';
  } else if (balance >= 1e6) {
    return 'silver';
  } else if (balance >= 1e3) {
    return 'bronze';
  } else {
    return 'none';
  }
}

const CallerCard: React.FC<Token> = ({ balance, image }) => {
  const type = getSimCardType(balance);

  return (
    <div className="flex flex-col items-center p-4">
      <SimCardIcon type={type} size={48} />
      <div className="my-2">{type}</div>
      <RankingImage image={image} />
    </div>
  );
};
export default CallerCard;
