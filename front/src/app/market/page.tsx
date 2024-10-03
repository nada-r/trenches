"use client";

import React, { useEffect, useState } from "react";
import MarketCard, { MarketCardProps } from "@/components/trenches/MarketCard";
import { RiFilter3Fill } from "react-icons/ri";
import { createAxiosInstance } from "@/utils/createAxiosInstance";

const instance = createAxiosInstance();

export default function MarketPage() {
  const [marketCard, setMarketCard] = useState<MarketCardProps[]>([]);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await instance.get("/callers");
        setMarketCard(
          response.data.map((c: any, i: number) => ({
            ...c,
            rank: i,
            variation: 387,
          }))
        );
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    }
    fetchTokens();
  }, []);

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <a
            href="#"
            className="text-gray-400 hover:underline flex items-center"
          >
            <RiFilter3Fill className="mr-1" size={24} />{" "}
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

        {/* Overlay to prevent user interaction */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
        <div className="fixed inset-0 flex items-center justify-center z-30">
          <div className="transform rotate-[-30deg] bg-yellow-500 text-black text-6xl font-bold py-4 px-8 rounded-lg">
            COMING SOON
          </div>
        </div>
      </div>
    </>
  );
}
