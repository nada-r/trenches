'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RemainingTime from '@/components/utils/RemainingTime';
import { Tournament, TournamentSchema } from '@/models';
import { createAxiosInstance } from '@/utils/createAxiosInstance';

const instance = createAxiosInstance();

export default function Homepage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await instance.get('/tournament/all');
        setTournaments(
          response.data.map((t: unknown) => TournamentSchema.parse(t))
        );
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    }
    fetchTournaments();
  }, []);

  return (
    <>
      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          className="bg-neutral-800 border border-gray-500 rounded-2xl p-4 mb-4"
        >
          <div className="text-lg font-bold mb-2">{tournament.name}</div>
          <div className="mb-2">
            Time remaining:{' '}
            <RemainingTime
              startedAt={tournament.startedAt!}
              durationInSeconds={tournament.metadata.endDuration}
            />
          </div>
          <div className="mb-2">Prize: {tournament.metadata.prize} SOL</div>
          <div className="mb-4">
            Supply burn: {tournament.metadata.supplyBurn}%
          </div>
          <Button asChild className="w-full">
            <Link href={`/tournament/${tournament.id}`} className="w-full">
              View
            </Link>
          </Button>
        </div>
      ))}
    </>
  );
}