// SimCardIcon.tsx
import React from 'react';
import { FaSimCard } from 'react-icons/fa6';

const getColorFromType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'bronze':
      return '#CD7F32';
    case 'silver':
      return '#C0C0C0';
    case 'gold':
      return '#FFD700';
    default:
      return 'rgb(212 212 212)'; // Default color if type doesn't match
  }
};

interface SimCardIconProps {
  type?: string;
  size?: number;
}
const SimCardIcon = ({ type = 'none', size = 48 }: SimCardIconProps) => {
  return <FaSimCard color={getColorFromType(type)} size={size} />;
};

export default SimCardIcon;