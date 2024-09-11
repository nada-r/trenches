import React from 'react';
import RankingImage from '@/components/ui/RankingImage';
import SimCardIcon from '@/components/icons/SimCardIcon';

export interface CallerCardProps {
  type: string;
  image: string;
}

const CallerCard: React.FC<CallerCardProps> = ({ type, image }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <SimCardIcon type={type} size={48} />
      <div className="my-2">{type}</div>
      <RankingImage image={image} />
    </div>
  );
};
export default CallerCard;
