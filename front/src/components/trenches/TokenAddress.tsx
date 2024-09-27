import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

interface TruncatedAddressProps {
  address: string | undefined;
}

const TruncatedAddress: React.FC<TruncatedAddressProps> = ({ address }) => {
  const truncateAddress = (addr: string | undefined): string => {
    if (!addr) {
      return '';
    }
    if (addr.length <= 8) {
      return addr;
    }
    const start = addr.slice(0, 6);
    return `${start}`;
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-row gap-1">
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
