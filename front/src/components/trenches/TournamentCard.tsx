import React, { useEffect, useState } from 'react';
import TournamentCounterDate from '@/components/trenches/TournamentCounterDate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tournament } from '@/models';
import dayjs from 'dayjs';

export type TournamentExtended = Tournament & {
  isClosed: boolean;
  isOpen: boolean;
  isUpcoming: boolean;
  isFinish: boolean;
  participationCount?: number;
};

const TournamentCard = ({ tournament }: { tournament: TournamentExtended }) => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    if (tournament) {
      const startedAt = dayjs(tournament.startedAt);
      const now = dayjs();
      const closeTime = startedAt.add(
        tournament.metadata.openDuration,
        'second'
      );
      const endTime = startedAt.add(tournament.metadata.endDuration, 'second');

      setIsUpcoming(now.isBefore(startedAt));
      setIsOpen(startedAt.isBefore(now) && now.isBefore(closeTime));
      setIsClosed(closeTime.isBefore(now) && now.isBefore(endTime));
      setIsFinish(endTime.isBefore(now));
    }
  }, [tournament]);

  return (
    <div
      className={`flex flex-col rounded-lg bg-neutral-900 p-3 mb-4 ${isUpcoming ? 'grayscale' : 'grayscale-0'}`}
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
          <Button
            asChild
            disabled={isUpcoming}
            className="w-full rounded-full text-lg font-bold"
          >
            <Link href={`/tournament/${tournament.id}`} className="w-full">
              {isOpen ? 'Play' : 'View'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;