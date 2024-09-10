import React from 'react';
import RankingImage from '@/components/ui/RankingImage';
import SimCardIcon from '@/components/icons/SimCardIcon';

const Card = ({ type }: { type: string }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <SimCardIcon type={type} size={48} />
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
