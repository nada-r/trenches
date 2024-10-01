import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';

interface TokenTickerProps {
  ticker: string;
  address: string;
  showCopy?: boolean;
}

const TokenTicker: React.FC<TokenTickerProps> = ({
  ticker,
  address,
  showCopy = false,
}) => {
  const handleCopy = () => {
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex flex-row gap-1">
      ${ticker}
      {showCopy && (
        <CopyToClipboard text={address || ''} onCopy={handleCopy}>
          <button title="Copy address" className="text-white sm:hidden">
            <FaCopy size={12} />
          </button>
        </CopyToClipboard>
      )}
    </div>
  );
};

export default TokenTicker;
