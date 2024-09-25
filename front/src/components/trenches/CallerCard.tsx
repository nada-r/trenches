import React from 'react';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import { Caller } from '@/models';
import { useRouter } from 'next/navigation';

export function getSimCardType(balance: number): string {
  if (balance >= 3_000_000) {
    return 'gold';
  } else if (balance >= 1_000_000) {
    return 'silver';
  } else if (balance >= 100_000) {
    return 'bronze';
  } else {
    return 'none';
  }
}

const CallerCard: React.FC<Caller & { balance: number; marketCap: number }> = ({
  id,
  name,
  balance,
  image,
  data,
}) => {
  const router = useRouter();
  const type = getSimCardType(balance);

  const displayCallerPage = () => {
    router.push(`/caller/${id}`);
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="flex flex-row">
        <CallerAvatar name={name} image={image === null ? undefined : image} />
        <div>
          <span className="ml-2 border border-red-500 text-xs text-gray-500 rounded-full px-2">
            #{data.rank}
          </span>
        </div>
      </div>
      <div className="my-2" onClick={() => displayCallerPage()}>
        {name}
      </div>
      {/*<Avatar>
        <AvatarImage src={image} alt={`@${name}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>*/}
      {/*<div className="my-2">{type}</div>*/}
    </div>
  );
};
export default CallerCard;
