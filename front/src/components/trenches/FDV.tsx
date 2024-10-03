import React from 'react';

interface FDVProps {
  value: number;
  light?: boolean;
}

const FDV: React.FC<FDVProps> = ({ value, light = false }) => {
  const formatLight = (num: number | undefined): string => {
    if (!num) {
      return '-';
    }

    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(0) + 'k';
    } else {
      return '$' + num.toString();
    }
  };

  const formattedValue = light
    ? formatLight(value)
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);

  return <span>{formattedValue}</span>;
};
export default FDV;
