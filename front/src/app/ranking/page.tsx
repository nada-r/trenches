'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import RankingImage from '@/components/trenches/RankingImage';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { Caller } from '@/models';
import { PiLightningFill } from 'react-icons/pi';

const instance = createAxiosInstance();

export default function Ranking() {
  const [callers, setCallers] = useState<Caller[]>([]);

  useEffect(() => {
    console.log(
      'check process emv',
      JSON.stringify(process.env.NEXT_PUBLIC_BACKEND_URL)
    );
    async function fetchCards() {
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
      try {
        const response = await instance.get('/callers');
        setCallers(response.data);
      } catch (error) {
        console.error('Error fetching callers:', error);
      }
    }
    fetchCards();
  }, []);

  return (
    <>
      <div>
        <h1>Trending</h1>
      </div>
      <div>
        {/* <>{JSON.stringify(callers)}</> test if data is loading*/}
        {/* {callers.length > 0 && <DisplayCard card={callers[0]} />} */}
      </div>
      <Table className="bg-background text-foreground border-border">
        <TableCaption className="text-muted-foreground"></TableCaption>
        <TableHeader className="border-border">
          <TableRow>
            <TableHead className="w-[100px] text-muted-foreground border-border">
              Rank
            </TableHead>
            <TableHead className="text-muted-foreground border-border"></TableHead>
            <TableHead className="text-muted-foreground border-border">
              Name
            </TableHead>
            <TableHead className="text-muted-foreground border-border">
              Calling power
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callers.map((caller, index) => (
            <TableRow key={caller.id} className="border-border">
              <TableCell className="font-medium text-foreground border-border">
                {index + 1}
              </TableCell>
              <TableCell className="border-border">
                {caller.image && <RankingImage image={caller.image} />}
              </TableCell>
              <TableCell className="text-foreground border-border">
                {caller.name}
              </TableCell>
              <TableCell className="text-foreground border-border">
                <div className="flex justify-center items-center">
                  {caller.data.power}
                  <PiLightningFill
                    size={20}
                    className="text-yellow-400 animate-pulse"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}