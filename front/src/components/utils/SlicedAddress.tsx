import React from 'react';

interface TruncatedAddressProps {
  address: string | undefined;
  showEnd?: boolean;
}

const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
  address,
  showEnd = true,
}) => {
  const truncateAddress = (addr: string | undefined): string => {
    if (!addr) {
      return '';
    }
    if (addr.length <= 8) {
      return addr;
    }
    const start = addr.slice(0, 4);
    if (showEnd) {
      const end = addr.slice(-4);
      return `${start}...${end}`;
    }
    return `${start}...`;
  };

  return <span>{truncateAddress(address)}</span>;
};

export default TruncatedAddress;
