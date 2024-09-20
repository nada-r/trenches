import React from 'react';
import { Token } from '@/app/portfolio/page';
import CallerAvatar from '@/components/trenches/CallerAvatar';

export function getSimCardType(balance: number): string {
  if (balance >= 3_000_000) {
    return 'gold';
  } else if (balance >= 1_000_000) {
    return 'silver';
  } else if (balance >= 100_000) {
    return 'bronze';
  } else {
    return 'none';
  }
}

const CallerCard: React.FC<Token> = ({ name, balance, image }) => {
  const type = getSimCardType(balance);

  return (
    <div className="relative flex flex-col items-center px-4">
      {/*<div className="absolute left-3 -top-3 z-10">
        <SimCardIcon type={type} size={16} />
      </div>*/}
      <CallerAvatar name={name} image={image} />
      {/*<Avatar>
        <AvatarImage src={image} alt={`@${name}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>*/}
      {/*<div className="my-2">{type}</div>*/}
    </div>
  );
};
export default CallerCard;
