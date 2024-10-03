import React from 'react';
import { CallExtended } from '@/app/call/page';
import { TableCell, TableRow } from '@/components/ui/table';
import TokenTicker from '@/components/trenches/TokenTicker';
import TokenAddress from '@/components/trenches/TokenAddress';
import TokenLinks from '@/components/trenches/TokenLinks';
import Link from 'next/link';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import FDV from '@/components/trenches/FDV';
import CallMultiple from '@/components/trenches/CallMultiple';

/*

<TableRow>
            <TableHead className="w-[50px] text-muted-foreground border-border">
              Ticker
            </TableHead>
            <TableHead className="w-[80px] text-muted-foreground border-border hidden sm:table-cell">
              copy CA
            </TableHead>
            <TableHead className="text-muted-foreground border-border px-0">
              Links
            </TableHead>
            <TableHead className="text-muted-foreground border-border"></TableHead>
            <TableHead className="text-muted-foreground border-border text-white">
              Alpha callers
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Mcap
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Start
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Highest
            </TableHead>
            <TableHead className="text-muted-foreground border-border text-right">
              Multiple
            </TableHead>
          </TableRow>

 */

const CallTableRow = ({ call }: { call: CallExtended }) => {
  const callColor = call.multiple >= 2 ? 'text-green-500' : 'text-yellow-500';
  return (
    <TableRow key={call.id} className="border-border">
      <TableCell
        className={`font-medium text-foreground border-border ${callColor}`}
      >
        <TokenTicker
          ticker={call.token.ticker}
          address={call.token.address}
          showCopy
        />
      </TableCell>
      <TableCell className="border-border pr-2 text-center hidden sm:block">
        <TokenAddress address={call.tokenAddress} iconOnly />
      </TableCell>
      <TableCell className="text-foreground border-border pl-2">
        <TokenLinks token={call.token} />
      </TableCell>
      <TableCell className="border-border pr-2 text-right">
        <div className="flex justify-end">
          <Link href={`/caller/${call.callerId}`}>
            <CallerAvatar
              name={call.caller?.name || ''}
              image={
                call.caller?.image === null ? undefined : call.caller?.image
              }
              className="w-7 h-7"
            />
          </Link>
        </div>
      </TableCell>
      <TableCell className="text-foreground border-border">
        <Link href={`/caller/${call.callerId}`}>{call.caller?.name}</Link>
      </TableCell>
      <TableCell
        className={`text-foreground border-border text-right ${callColor}`}
      >
        -
      </TableCell>
      <TableCell
        className={`text-foreground border-border text-right ${callColor}`}
      >
        <FDV value={call.startFDV} light={true} />
      </TableCell>
      <TableCell
        className={`text-foreground border-border text-right ${callColor}`}
      >
        <FDV value={call.highestFDV} light={true} />
      </TableCell>
      <TableCell
        className={`text-foreground border-border text-right ${callColor}`}
      >
        <CallMultiple multiple={call.multiple} />
      </TableCell>
    </TableRow>
  );
};

export default CallTableRow;