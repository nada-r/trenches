import React from 'react';

interface CallingPowerProps {
  value: number;
}

const CallingPower: React.FC<CallingPowerProps> = ({ value }) => {
  const roundedValue = value.toFixed();
  return <span>{roundedValue}</span>;
};

export default CallingPower;