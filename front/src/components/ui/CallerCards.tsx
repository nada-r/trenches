import React from 'react';
import RankingImage from '@/components/ui/RankingImage';
import { FaSimCard } from 'react-icons/fa6';

const Card = ({ type }: { type: string }) => {
  const getColorFromType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      default:
        return '#000000'; // Default color if type doesn't match
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <FaSimCard color={getColorFromType(type)} size={48} />
      <div className="my-2">{type}</div>
      <RankingImage
        image={'https://trenches.fra1.cdn.digitaloceanspaces.com/Zorrogems.jpg'}
      />
    </div>
  );
};

const CallerCards = ({ cards }: { cards: Array<{ type: string }> }) => {
  return (
    <div className="flex overflow-x-auto py-4">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default CallerCards;
