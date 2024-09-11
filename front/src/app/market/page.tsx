'use client';

import React, { useEffect, useState } from 'react';
import MarketCard, { MarketCardProps } from '@/components/ui/MarketCard';
import { RiFilter3Fill } from 'react-icons/ri';

export default function MarketPage() {
  const [marketCard, setMarketCard] = useState<MarketCardProps[]>([]);

  useEffect(() => {
    // Commented out original fetchTokens function
    // async function fetchTokens() {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.NEXT_PUBLIC_BASE_URL!}/tokens`
    //     );
    //     setTokens(response.data);
    //   } catch (error) {
    //     console.error('Error fetching tokens:', error);
    //   }
    // }
    // fetchTokens();

    // Temporary function to generate 4 random tokens
    function generateRandomTokens() {
      // prettier-ignore
      const fakeTokens: MarketCardProps[] = [
        { id: '1', rank: 1, name: 'greg', variation: 387 },
        { id: '2', rank: 2, name: 'Ansem', variation: 387 },
        { id: '3', rank: 3, name: 'bqsed16z', variation: 387 },
        { id: '4', rank: 4, name: 'wallstreetbets', variation: 387 },
      ];
      setMarketCard(fakeTokens);
    }

    generateRandomTokens();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <a href="#" className="text-gray-400 hover:underline flex items-center">
          <RiFilter3Fill className="mr-1" size={24} />{' '}
          <span className="text-sm">Filters</span>
        </a>
        <select className="text-gray-400 bg-neutral-800 border border-neutral-500 rounded-full px-3 py-1">
          <option value="rank">Price high to low</option>
          <option value="name">Price low to high</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 overflow-y-auto py-4">
        {marketCard.map((token, index) => (
          <MarketCard key={index} {...token} />
        ))}
      </div>
    </>
  );
}