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
import { Balance } from '@/components/trenches/Balance';
import CallerCard from '@/components/trenches/CallerCard';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { usePrivy, WalletWithMetadata } from '@privy-io/react-auth';

export interface Token {
  id: number;
  rank: number;
  name: string;
  marketCap: number;
  balance: number;
  image: string;
}

const instance = createAxiosInstance();

export default function Portfolio() {
  const [tokens, setTokens] = useState<Token[]>([]);

  const { user } = usePrivy();
  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  useEffect(() => {
    if (solanaWallet) {
      const fetchTokens = async () => {
        try {
          const callerResponse = await instance.get('/callers');
          const response = await instance.get(
            `/portfolio/${solanaWallet?.address}`
          );

          setTokens(
            response.data.portfolio.map((t: any, i: number) => ({
              ...callerResponse.data.find((c: any) => c.id === t.callerId),
              marketCap: 430000,
              balance: t.balance,
            }))
          );
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      };

      fetchTokens();
    }
  }, [solanaWallet]);

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
