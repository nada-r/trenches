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
  const [bgColor, setBgColor] = useState('bg-lime-500');

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = new Date();
      const endTime = new Date(startedAt.getTime() + durationInSeconds * 1000);
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setRemainingTime('0m 0s');
        setBgColor('bg-red-500');
        return false; // Return false to stop the interval
      } else {
        const hours = Math.max(Math.floor(timeDiff / (1000 * 60 * 60)), 0);
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
        if (hours >= 24) {
          const days = Math.floor(hours / 24);
          timeString = `${days}d ${pad(hours % 24)}h ${pad(minutes)}m`;
          setBgColor('bg-lime-500');
        } else if (hours >= 4) {
          timeString = `${pad(hours)}h ${pad(minutes)}m`;
          setBgColor('bg-lime-500');
        } else if (hours >= 1) {
          timeString = `${pad(hours)}h ${pad(minutes)}m`;
          setBgColor('bg-orange-400');
        } else {
          timeString = `${pad(minutes)}m ${pad(seconds)}s`;
          setBgColor('bg-red-500');
        }
        setRemainingTime(timeString);
      }
      return true; // Return true to continue the interval
    };

    // Execute immediately
    const shouldContinue = updateRemainingTime();

    // Set up interval only if it should continue
    const intervalId = shouldContinue
      ? setInterval(updateRemainingTime, 1000)
      : undefined;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startedAt, durationInSeconds]);

  if (!remainingTime) return '';

  return (
    <Badge
      className={`text-black ${bgColor} rounded-sm px-1 ${classname ?? ''}`}
    >
      {remainingTime}
    </Badge>
  );
};

export default RemainingTime;