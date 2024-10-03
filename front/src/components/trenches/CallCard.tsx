import React from 'react';
import { CallExtended } from '@/app/call/page';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'sonner';
import CallMultiple from '@/components/trenches/CallMultiple';
import FDV from '@/components/trenches/FDV';
import { BiSolidCopy } from 'react-icons/bi';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import TokenLinks from '@/components/trenches/TokenLinks';
import Link from 'next/link';

const callCard = ({ call }: { call: CallExtended }) => {
  const callColor = call.multiple >= 2 ? 'text-green-500' : 'text-yellow-500';

  const handleCopy = () => {
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex items-center bg-neutral-900 rounded p-3">
      <div className="">
        <img
          src={call.token.image_uri}
          alt={call.token.name}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex flex-col ml-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b pb-2 border-gray-700">
          <div className="flex flex-col gap-y-2 overflow-hidden">
            <div className="flex">
              <div className="!p-0 !m-0 !h-auto relative flex gap-x-1 overflow-hidden">
                <span className="font-medium text-gray-50 whitespace-nowrap min-w-max overflow-ellipsis line-clamp-1 text-sm !leading-[14px]">
                  ${call.token.ticker}
                </span>
                <span className="font-normal text-gray-400 overflow-ellipsis line-clamp-1 text-xs !leading-[12px]">
                  {call.token.name}
                </span>
              </div>
              <div className="!p-0 !m-0 relative !ml-1 flex !h-[12px] z-10 hover:cursor-pointer">
                <CopyToClipboard
                  text={call.token.address || ''}
                  onCopy={handleCopy}
                >
                  <button title="Copy address" className="text-gray-400">
                    <BiSolidCopy size={12} />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="flex items-center z-10">
              <span className="inline-flex items-center break-keep md:ml-0 text-xs leading-none border-gray-500 pr-1">
                <span className="text-gray-400 font-medium">Called by</span>
                <Link
                  href={`/caller/${call.caller.id}`}
                  className="flex flex-row items-center"
                >
                  <CallerAvatar
                    name={call.caller.name}
                    image={
                      call.caller.image === null ? undefined : call.caller.image
                    }
                    className="w-4 h-4 ml-2"
                  />
                  <span className="inline-flex text-gray-200 font-medium ml-1">
                    {call.caller.name}
                  </span>
                </Link>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end min-w-[90px] flex-1"></div>
        </div>
        <div className="flex items-center justify-between mt-2 z-10">
          <div className="flex gap-x-[6px]">
            <TokenLinks token={call.token} />
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-x-1">
              <span
                className="text-gray-400 text-xs leading-none"
                title="Market Cap"
              >
                MC
              </span>
              <span
                className={`font-medium text-xs leading-none text-grey-100 ${callColor}`}
              >
                <FDV value={call.token.data.mcap} light />
              </span>
            </div>
            <div className="flex items-center gap-x-1 ml-2">
              <span className="text-gray-400 text-xs leading-none" title="Open">
                O
              </span>
              <span
                className={`text-grey-100 font-medium text-xs leading-none ${callColor}`}
              >
                <FDV value={call.startFDV} light />
              </span>
            </div>
            <div className="flex items-center gap-x-1 ml-2">
              <span
                className="text-gray-400 text-xs leading-none"
                title="Highest"
              >
                H
              </span>
              <span className={`font-medium text-xs leading-none ${callColor}`}>
                <FDV value={call.highestFDV} light />
              </span>
            </div>
            <div className="flex items-center gap-x-1 ml-2">
              <span
                className="text-gray-400 text-xs leading-none"
                title="Mulitple"
              >
                M
              </span>
              <span className={`font-medium text-xs leading-none ${callColor}`}>
                <CallMultiple multiple={call.multiple} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default callCard;