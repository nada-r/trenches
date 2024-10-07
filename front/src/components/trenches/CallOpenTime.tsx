import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface CallOpenTimeProps {
  date?: Date;
}

const CallOpenTime: React.FC<CallOpenTimeProps> = ({ date }) => {
  const [timeSince, setTimeSince] = React.useState<string>('');

  React.useEffect(() => {
    if (!date) return;

    const callTime = dayjs(date);
    setTimeSince(callTime.fromNow(false));
  }, [date]);

  return <span>{timeSince}</span>;
};

export default CallOpenTime;
