import React from "react";
import SimCardIcon from "@/components/icons/SimCardIcon";
import RankingImage from "@/components/trenches/RankingImage";

export interface MarketCardProps {
  id: string;
  rank: number;
  name: string;
  image: string;
  variation: number;
}

const MarketCard: React.FC<MarketCardProps> = ({
  rank,
  name,
  image,
  variation,
}) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative flex flex-col items-center px-4">
        <div className="absolute left-3 -top-3 z-10">
          <RankingImage image={image} />
        </div>
        <SimCardIcon size={48} />
      </div>
      <div className="my-2 flex items-center">
        {name}
        <span className="ml-2 border border-red-500 text-xs text-gray-500 rounded-full px-2">
          #{rank}
        </span>
      </div>
      <div className="flex space-x-2">
        <button className="bg-green-700 text-white font-bold py-1 px-2 sm:px-4 text-sm sm:text-base rounded-full">
          Buy
        </button>
        <button className="bg-red-700 text-white font-bold py-1 px-2 sm:px-4 text-sm sm:text-base rounded-full">
          Sell
        </button>
      </div>
    </div>
  );
};

export default MarketCard;
