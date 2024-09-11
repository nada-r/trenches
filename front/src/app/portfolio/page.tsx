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
import CallerCard, { CallerCardProps } from '@/components/ui/CallerCard';

interface Token {
  id: string;
  rank: number;
  name: string;
  marketCap: number;
  balance: number;
  image: string;
}

export default function Portfolio() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [callerCards, setCallerCards] = useState<CallerCardProps[]>([]);

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

    function getSimCardType(balance: number): string {
      if (balance >= 1e9) {
        return 'gold';
      } else if (balance >= 1e6) {
        return 'silver';
      } else if (balance >= 1e3) {
        return 'bronze';
      } else {
        return 'none';
      }
    }

    // Temporary function to generate 4 random tokens
    function generateRandomTokens() {
      // prettier-ignore
      const fakeTokens: Token[] = [
        { id: '1', rank: 1, name: 'greg', marketCap: 430000, balance: 13000000, image: '' },
        { id: '2', rank: 2, name: 'Ansem', marketCap: 430000, balance: 3000000, image: '' },
        { id: '3', rank: 3, name: 'bqsed16z', marketCap: 430000, balance: 1000000, image: '' },
        { id: '4', rank: 4, name: 'wallstreetbets', marketCap: 430000, balance: 100000, image: '' },
      ];
      setTokens(fakeTokens);
      setCallerCards(
        fakeTokens.map((token) => ({
          type: getSimCardType(token.balance),
          image: token.image,
        }))
      );
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
        {callerCards.map((card, index) => (
          <CallerCard key={index} {...card} />
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
