import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CallerAvatarProps {
  image?: string;
  name: string;
}

const CallerAvatar: React.FC<CallerAvatarProps> = ({ image, name }) => {
  return (
    <Avatar>
      <AvatarImage src={image} alt={`@${name}`} />
      <AvatarFallback className="text-gray-700">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default CallerAvatar;