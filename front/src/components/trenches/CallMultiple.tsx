import React from 'react';

interface CallMultipleProps {
  multiple: number;
}

const CallMultiple: React.FC<CallMultipleProps> = ({ multiple }) => {
  return <span>[{multiple.toFixed(1)}X]</span>;
};
export default CallMultiple;
