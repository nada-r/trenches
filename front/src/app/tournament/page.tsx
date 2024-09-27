'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tournament, TournamentSchema } from '@/models';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import dayjs from 'dayjs';
import TournamentCounterDate from '@/components/trenches/TournamentCounterDate';

const instance = createAxiosInstance();

export default function Homepage() {
  const [tournaments, setTournaments] = useState<
    Array<
      Tournament & {
        isClosed: boolean;
        isOpen: boolean;
        isUpcoming: boolean;
        isFinish: boolean;
      }
    >
  >([]);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await instance.get('/tournament/all');
        setTournaments(
          response.data.map((t: unknown) => {
            const parsedTournament = TournamentSchema.parse(t);
            const startedAt = dayjs(parsedTournament.startedAt);
            const now = dayjs();
            const closeTime = startedAt.add(
              parsedTournament.metadata.openDuration,
              'second'
            );
            const endTime = startedAt.add(
              parsedTournament.metadata.endDuration,
              'second'
            );
            return {
              ...parsedTournament,
              isUpcoming: now.isBefore(startedAt),
              isOpen: startedAt.isBefore(now) && now.isBefore(closeTime),
              isClosed: closeTime.isBefore(now) && now.isBefore(endTime),
              isFinish: endTime.isBefore(now),
            };
          })
        );
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    }
    fetchTournaments();
  }, []);

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Tournaments</h1>
      </div>
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="flex flex-col rounded-lg bg-neutral-900 p-3 mb-4"
        >
          <div className="text-lg font-bold mb-2">{tournament.name}</div>
          <div className="flex flex-row">
            <div className="basis-2/3 flex flex-col">
              <TournamentCounterDate tournament={tournament} />
              <div>
                Prize: <span className="text-gray-600 italic">coming soon</span>
              </div>
              {/*<div className="mb-4">
            Supply burn: {tournament.metadata.supplyBurn}%
          </div>*/}
            </div>
            <div className=" basis-1/3">
              <Button asChild className="w-full rounded-full text-lg font-bold">
                <Link href={`/tournament/${tournament.id}`} className="w-full">
                  Play
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}