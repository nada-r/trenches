'use client';

import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import React, { useEffect, useState } from 'react';
import { Call, Token } from '@/models';
import CallCard from '@/components/trenches/CallCard';

const instance = createAxiosInstance();

type CallerLight = {
  id: number;
  name: string;
  image: string;
};

export type CallExtended = Call & {
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
      <div className="sm:hidden">
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

        <div className={`grid grid-cols-1 gap-3 mt-4`}>
          {calls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
      </div>
      <div className="sm:grid grid-cols-3 gap-4">
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Open Calls</h1>
          {topOpenCalls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Closed Calls</h1>
          {closedCalls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
        <div className={`flex flex-col gap-3 mt-4`}></div>
      </div>
    </>
  );
}
