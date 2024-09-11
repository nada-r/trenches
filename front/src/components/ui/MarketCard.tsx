import React from 'react';
import { SlEarphonesAlt } from 'react-icons/sl';

export interface MarketCardProps {
  id: string;
  rank: number;
  name: string;
  variation: number;
}

const MarketCard: React.FC<MarketCardProps> = ({ rank, name, variation }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <SlEarphonesAlt size={48} />
      <div className="my-2 flex items-center">
        {name}
        <span className="ml-2 border border-red-500 text-xs text-gray-500 rounded-full px-2">
          #{rank}
        </span>
      </div>
      <button className="bg-green-700 text-white font-bold py-1 px-4 rounded-full">
        Buy
      </button>
    </div>
  );
};

export default MarketCard;