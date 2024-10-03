import React from 'react';

interface CallMultipleProps {
  multiple: number;
}

const CallMultiple: React.FC<CallMultipleProps> = ({ multiple }) => {
  return <span>x{multiple.toFixed(1)}</span>;
};
export default CallMultiple;
