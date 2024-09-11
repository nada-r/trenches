'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Balance } from '@/components/ui/Balance';
import CallerCard from '@/components/ui/CallerCard';

export interface Token {
  id: string;
  rank: number;
  name: string;
  marketCap: number;
  balance: number;
  image: string;
}

export default function Portfolio() {
  const [tokens, setTokens] = useState<Token[]>([]);

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
      const fakeTokens: Token[] = [
        { id: '1', rank: 1, name: 'greg', marketCap: 430000, balance: 13000000, image: 'https://assets.api.uizard.io/api/cdn/stream/ddcabbc0-9002-4ebc-8bfc-2a47b3f636b1.png' },
        { id: '2', rank: 2, name: 'Ansem', marketCap: 430000, balance: 3000000, image: 'https://assets.api.uizard.io/api/cdn/stream/848ade87-3e76-42a4-9842-ebacf29c9749.png' },
        { id: '3', rank: 3, name: 'bqsed16z', marketCap: 430000, balance: 1000000, image: 'https://assets.api.uizard.io/api/cdn/stream/e53ae5aa-f673-43e7-b711-a691a3603a64.png' },
        { id: '4', rank: 4, name: 'wallstreetbets', marketCap: 430000, balance: 100000, image: 'https://assets.api.uizard.io/api/cdn/stream/5d1295d1-654a-47cd-a559-f4eea99a0f7c.png' },
      ];
      setTokens(fakeTokens);
    }

    generateRandomTokens();
  }, []);

  return (
    <>
      <div className="flex items-baseline mb-4">
        <h1 className="text-2xl font-bold mr-4">Cards</h1>
        <a href="#" className="text-xs text-gray-500 underline">
          See all
        </a>
      </div>
      <div className="flex overflow-x-auto py-4">
        {tokens.map((token, index) => (
          <CallerCard key={index} {...token} />
        ))}
      </div>

      <div className="flex items-baseline mb-4">
        <h1 className="text-2xl font-bold mr-4">Tokens</h1>
        <a href="#" className="text-xs text-gray-500 underline">
          See all
        </a>
      </div>
      <Table className="bg-background text-foreground">
        {tokens.length > 0 ? (
          <>
            <TableHeader className="border-border">
              <TableRow>
                <TableHead className="w-[100px] text-muted-foreground"></TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Mcap</TableHead>
                <TableHead className="text-muted-foreground">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id} className="">
                  <TableCell className="font-medium text-foreground">
                    #{token.rank}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {token.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    ${token.marketCap.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-500">
                    <Balance balance={token.balance} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          <TableCaption className="text-muted-foreground">
            Your Token Portfolio
          </TableCaption>
        )}
      </Table>
    </>
  );
}
