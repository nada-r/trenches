'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { TournamentSchema } from '@/models';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import dayjs from 'dayjs';
import TournamentCard, {
  TournamentExtended,
} from '@/components/trenches/TournamentCard';

const instance = createAxiosInstance();

export default function Homepage() {
  const [tournaments, setTournaments] = useState<Array<TournamentExtended>>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<
    Array<TournamentExtended>
  >([]);
  const [closedTournaments, setClosedTournaments] = useState<
    Array<TournamentExtended>
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
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}

      {upcomingTournaments.length > 0 && (
        <>
          <div className="text-center">
            <h1 className="text-lg italic text-gray-500 mb-4">
              ~~ Upcoming ~~
            </h1>
          </div>
          {upcomingTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </>
      )}
      {closedTournaments.length > 0 && (
        <>
          <div className="text-center">
            <h1 className="text-lg italic text-gray-500 mb-4">
              ~~ Previous ~~
            </h1>
          </div>

          {closedTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </>
      )}
    </>
  );
}