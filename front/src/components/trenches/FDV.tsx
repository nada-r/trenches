import React from 'react';

interface FDVProps {
  value: number;
}

const FDV: React.FC<FDVProps> = ({ value }) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return <span>{formattedValue}</span>;
};

export default FDV;
