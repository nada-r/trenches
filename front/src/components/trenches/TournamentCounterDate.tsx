import React from 'react';
import RemainingTime from '@/components/utils/RemainingTime';
import { Tournament } from '@/models';

const TournamentCounterDate = ({
  tournament,
}: {
  tournament: Tournament & {
    isOpen: boolean;
    isClosed: boolean;
    isFinish: boolean;
    isUpcoming: boolean;
  };
}) => {
  return (
    <div>
      {tournament.isUpcoming && 'Upcoming'}
      {tournament.isOpen && 'Starting in'}
      {tournament.isClosed && 'Finishing in'}
      {tournament.isFinish && 'Finished'}
      {(tournament.isOpen || tournament.isClosed) && (
        <RemainingTime
          classname="m-2"
          startedAt={tournament.startedAt!}
          durationInSeconds={
            tournament.isClosed
              ? tournament.metadata.endDuration
              : tournament.metadata.openDuration
          }
        />
      )}
    </div>
  );
};

export default TournamentCounterDate;