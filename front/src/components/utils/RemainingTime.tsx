import * as React from 'react';
import { useEffect, useState } from 'react';

interface RemainingTimeProps {
  startedAt: Date;
  durationInSeconds: number;
}

const RemainingTime: React.FC<RemainingTimeProps> = ({
  startedAt,
  durationInSeconds,
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
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        setRemainingTime(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startedAt, durationInSeconds]);

  return <span>{remainingTime}</span>;
};

export default RemainingTime;