'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import React, { useEffect, useState } from 'react';
import { Call, Token } from '@/models';
import TokenAddress from '@/components/trenches/TokenAddress';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import TokenLinks from '@/components/trenches/TokenLinks';
import FDV from '@/components/trenches/FDV';
import TokenTicker from '@/components/trenches/TokenTicker';
import CallMultiple from '@/components/trenches/CallMultiple';
import Link from 'next/link';

const instance = createAxiosInstance();

type CallerLight = {
  name: string;
  image: string;
};

type CallExtended = Call & {
  multiple: number;
  token: Token;
  caller: CallerLight;
};

export default function CallPage() {
  const [calls, setCalls] = useState<Array<CallExtended>>([]);
  const [selectedView, setSelectedView] = useState<'open' | 'closed'>('open');
  const [topOpenCalls, setTopOpenCalls] = useState<Array<CallExtended>>([]);
  const [closedCalls, setClosedCalls] = useState<Array<CallExtended>>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      const response = await instance.get('/calls/tops');

      setTopOpenCalls(response.data.topOpenCalls);
      setCalls(response.data.topOpenCalls);
      setClosedCalls(response.data.closedCalls);
    };
    fetchCalls();
  }, []);

  const viewOpen = () => {
    setCalls(topOpenCalls);
  };

  const viewClosed = () => {
    setCalls(closedCalls);
  };

  return (
    <>
      <ToggleGroup
        type="single"
        value={selectedView}
        className="justify-start"
        onValueChange={(value) => {
          if (value === 'open') {
            viewOpen();
          } else if (value === 'closed') {
            viewClosed();
          }
          setSelectedView(value as 'open' | 'closed');
        }}
      >
        <ToggleGroupItem
          className="h-6 rounded-full"
          onClick={() => viewOpen()}
          value="open"
        >
          Top open calls
        </ToggleGroupItem>
        <ToggleGroupItem
          className="h-6 rounded-full"
          onClick={() => viewClosed()}
          value="closed"
        >
          Closed calls
        </ToggleGroupItem>
      </ToggleGroup>

      <Table className="bg-background text-foreground border-border mt-2">
        <TableCaption className="text-muted-foreground"></TableCaption>
        <TableHeader className="border-border">
          <TableRow>
            <TableHead className="w-[50px] text-muted-foreground border-border">
              Ticker
            </TableHead>
            <TableHead className="w-[80px] text-muted-foreground border-border hidden sm:table-cell">
              copy CA
            </TableHead>
            <TableHead className="text-muted-foreground border-border px-0">
              Links
            </TableHead>
            <TableHead className="text-muted-foreground border-border"></TableHead>
            <TableHead className="text-muted-foreground border-border text-white">
              Alpha callers
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Mcap
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Start
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Highest
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Multiple
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call, index) => {
            const callColor =
              call.multiple >= 2 ? 'text-green-500' : 'text-yellow-500';
            return (
              <TableRow key={call.id} className="border-border">
                <TableCell
                  className={`font-medium text-foreground border-border ${callColor}`}
                >
                  <TokenTicker
                    ticker={call.token.ticker}
                    address={call.token.address}
                    showCopy
                  />
                </TableCell>
                <TableCell className="border-border pr-2 text-center hidden sm:block">
                  <TokenAddress address={call.tokenAddress} iconOnly />
                </TableCell>
                <TableCell className="text-foreground border-border pl-2">
                  <TokenLinks token={call.token} />
                </TableCell>
                <TableCell className="border-border pr-2 text-right">
                  <div className="flex justify-end">
                    <Link href={`/caller/${call.callerId}`}>
                      <CallerAvatar
                        name={call.caller?.name || ''}
                        image={
                          call.caller?.image === null
                            ? undefined
                            : call.caller?.image
                        }
                        className="w-7 h-7"
                      />
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-foreground border-border">
                  <Link href={`/caller/${call.callerId}`}>
                    {call.caller.name}
                  </Link>
                </TableCell>
                <TableCell
                  className={`text-foreground border-border text-right ${callColor}`}
                >
                  -
                </TableCell>
                <TableCell
                  className={`text-foreground border-border text-right ${callColor}`}
                >
                  <FDV value={call.startFDV} light={true} />
                </TableCell>
                <TableCell
                  className={`text-foreground border-border text-right ${callColor}`}
                >
                  <FDV value={call.highestFDV} light={true} />
                </TableCell>
                <TableCell
                  className={`text-foreground border-border text-right ${callColor}`}
                >
                  <CallMultiple multiple={call.multiple} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
