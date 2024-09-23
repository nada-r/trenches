'use client';
import React, { useEffect, useState } from 'react';
import { FaTelegram } from 'react-icons/fa';
import { Call, Caller } from '@/models';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import SlicedAddress from '@/components/utils/SlicedAddress';
import FDV from '@/components/trenches/FDV';

const instance = createAxiosInstance();

const Page = ({ params }: { params: { id: string } }) => {
  const [caller, setCaller] = useState<
    Caller & {
      openCalls: Call[];
      closedCalls: Call[];
    }
  >();

  useEffect(() => {
    async function fetchCaller() {
      try {
        const response = await instance.get(`/caller/${params.id}`);
        setCaller(response.data);
      } catch (error) {
        console.error('Error fetching callers:', error);
      }
    }

    fetchCaller();
  }, []);

  return (
    <>
      <Link href="/ranking" className="mr-2">
        <IoIosArrowBack />
      </Link>
      <h1 className="text-2xl font-bold">{caller?.name}</h1>
      {caller?.telegramId && (
        <a
          href={`https://t.me/${caller.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center text-blue-500 hover:text-blue-600"
        >
          <FaTelegram className="mr-2" />
          Telegram
        </a>
      )}

      <h1 className="text-2xl font-bold ">Opened Calls</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Highest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caller?.openCalls.map((call, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <SlicedAddress address={call.tokenAddress} showEnd={false} />
              </TableCell>
              <TableCell>
                <FDV value={call.startFDV} />
              </TableCell>
              <TableCell>
                <FDV value={call.highestFDV} />
                <span className="ml-2 text-sm text-gray-500">
                  [{(call.highestFDV / call.startFDV - 1).toFixed(1)}X]
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h1 className="text-2xl font-bold mt-4">Closed Calls</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Highest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caller?.closedCalls.map((call, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <SlicedAddress address={call.tokenAddress} showEnd={false} />
              </TableCell>
              <TableCell>
                {new Date(call.createdAt)
                  .toLocaleString('en-GB', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(',', '')}
              </TableCell>
              <TableCell>
                <FDV value={call.startFDV} />
              </TableCell>
              <TableCell>
                <FDV value={call.highestFDV} />
                <span className="ml-2 text-sm text-gray-500">
                  [{(call.highestFDV / call.startFDV - 1).toFixed(1)}X]
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Page;
