import * as React from 'react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface RemainingTimeProps {
  startedAt: Date;
  durationInSeconds: number;
  classname?: string;
}

const RemainingTime: React.FC<RemainingTimeProps> = ({
  startedAt,
  durationInSeconds,
  classname,
}) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const endTime = new Date(startedAt.getTime() + durationInSeconds * 1000);
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setRemainingTime('Ended');
        clearInterval(intervalId);
      } else {
        const days = Math.max(Math.floor(timeDiff / (1000 * 60 * 60 * 24)), 0);
        const hours = Math.max(
          Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          0
        );
        const minutes = Math.max(
          Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          0
        );
        const seconds = Math.max(
          Math.floor((timeDiff % (1000 * 60)) / 1000),
          0
        );

        const pad = (num: number) => num.toString().padStart(2, '0');

        let timeString = '';
        if (days > 0) {
          timeString = `${days}d ${pad(hours)}h ${pad(minutes)}m`;
        } else if (hours > 0) {
          timeString = `${pad(hours)}h ${pad(minutes)}m`;
        } else {
          timeString = `${pad(minutes)}m ${pad(seconds)}s`;
        }
        setRemainingTime(timeString);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startedAt, durationInSeconds]);

  if (!remainingTime) return '';

  return (
    <Badge
      className={`text-black bg-lime-500 rounded-sm px-1 ${classname ?? ''}`}
    >
      {remainingTime}
    </Badge>
  );
};

export default RemainingTime;