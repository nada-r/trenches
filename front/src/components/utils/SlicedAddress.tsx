import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

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

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-row gap-2">
      <span>{truncateAddress(address)}</span>
      <CopyToClipboard text={address || ''} onCopy={handleCopy}>
        <button title="Copy address">
          <FaCopy />
        </button>
      </CopyToClipboard>
      {copied && <span className="text-green-200">Copied!</span>}
    </div>
  );
};

export default TruncatedAddress;
