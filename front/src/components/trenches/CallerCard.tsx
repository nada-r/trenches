import React from 'react';
import RankingImage from '@/components/trenches/RankingImage';
import SimCardIcon from '@/components/icons/SimCardIcon';
import { Token } from '@/app/portfolio/page';

export function getSimCardType(balance: number): string {
  if (balance >= 1e7) {
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
    <div className="relative flex flex-col items-center px-4">
      <div className="absolute left-3 -top-3 z-10">
        <RankingImage image={image} />
      </div>
      <SimCardIcon type={type} size={48} />
      <div className="my-2">{type}</div>
    </div>
  );
};
export default CallerCard;
