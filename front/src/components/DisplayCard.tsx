import React from 'react';
import Image from 'next/image';
import { Card, Power } from '@prisma/client';

interface displayCardProps {
    card: Card & {power: Power}
}

const DisplayCard = ({ card }: displayCardProps) => {
  const { id, name, price, power, image } = card;
  return (
    <div className="border rounded-lg p-4 shadow-md">
      {/* <Image src={image} alt={name} width={200} height={200} className="rounded-lg" /> */}
      <h2 className="text-xl font-bold mt-2">{name}</h2>
      <p className="text-gray-600">Price: ${price}</p>
      <div className="mt-2">
        {/* <span className="font-semibold">Power:</span> {power.name} ({power.value}) */}
      </div>
    </div>
  );
};

export default DisplayCard;

