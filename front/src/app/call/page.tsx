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
  caller?: CallerLight;
};

export default function CallPage() {
  const [calls, setCalls] = useState<Array<CallExtended>>([]);
  const [selectedView, setSelectedView] = useState<'tops' | 'open' | 'closed'>(
    'tops'
  );
  const [topOpenCalls, setTopOpenCalls] = useState<Array<CallExtended>>([]);
  const [openCalls, setOpenCalls] = useState<Array<CallExtended>>([]);
  const [closedCalls, setClosedCalls] = useState<Array<CallExtended>>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      const response = await instance.get('/calls/tops');

      const topOpenCalls = [...response.data.topOpenCalls].sort(
        (a: CallExtended, b: CallExtended) => b.multiple - a.multiple
      );
      setCalls(topOpenCalls);
      setTopOpenCalls(topOpenCalls);
      setOpenCalls(response.data.topOpenCalls);
      setClosedCalls(response.data.closedCalls);
    };
    fetchCalls();
  }, []);

  const viewTops = () => {
    setCalls(topOpenCalls);
  };

  const viewOpen = () => {
    setCalls(openCalls);
  };

  const viewClosed = () => {
    setCalls(closedCalls);
  };

  return (
    <>
      <div className="lg:hidden">
        <ToggleGroup
          type="single"
          value={selectedView}
          className="justify-start"
          onValueChange={(value) => {
            if (value === 'tops') {
              viewTops();
            } else if (value === 'open') {
              viewOpen();
            } else if (value === 'closed') {
              viewClosed();
            }
            setSelectedView(value as 'tops' | 'open' | 'closed');
          }}
        >
          <ToggleGroupItem
            className="h-6 rounded-full"
            onClick={() => viewTops()}
            value="tops"
          >
            Top open calls
          </ToggleGroupItem>
          <ToggleGroupItem
            className="h-6 rounded-full"
            onClick={() => viewOpen()}
            value="open"
          >
            Last open calls
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
      <div className="hidden lg:grid grid-cols-3 gap-4">
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Top Open Calls</h1>
          {topOpenCalls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Last Open Calls</h1>
          {openCalls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Last Closed Calls</h1>
          {closedCalls.map((call, index) => (
            <CallCard key={index} call={call} />
          ))}
        </div>
      </div>
    </>
  );
}
