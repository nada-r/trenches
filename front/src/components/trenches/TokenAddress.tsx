import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';

interface TruncatedAddressProps {
  address: string | undefined;
  iconOnly?: boolean;
}

const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
  address,
  iconOnly = false,
}) => {
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

  const handleCopy = () => {
    toast.success('Copied to clipboard!');
  };

  return (
    <div>
      {!iconOnly && <span>{truncateAddress(address)}</span>}
      <CopyToClipboard text={address || ''} onCopy={handleCopy}>
        <button title="Copy address">
          <FaCopy size={12} />
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default TruncatedAddress;
