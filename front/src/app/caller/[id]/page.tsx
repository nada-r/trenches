'use client';
import React, { useEffect, useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
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
import CallerAvatar from '@/components/trenches/CallerAvatar';
import CallingPower from '@/components/trenches/CallingPower';

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

      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <CallerAvatar
            name={caller?.name || ''}
            image={caller?.image === null ? undefined : caller?.image}
            className="w-10 h-10 mr-4"
          />
          <h1 className="text-2xl font-bold">{caller?.name}</h1>
          {caller?.name && (
            <a
              href={`https://t.me/${caller.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 pl-2"
            >
              <FaTelegramPlane />
            </a>
          )}
        </div>
        <div className="grid grid-rows-2 gap-1 rounded-lg bg-neutral-900 mt-3 p-3">
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-semibold text-light-gray">Rank:</p>
            <p className="text-sm text-light-gray ">
              #{caller?.data.rank || 0}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-semibold text-light-gray">Power:</p>
            <p className="text-sm text-light-gray ">
              <CallingPower value={caller?.data.power || 0} />
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-4">Opened Calls</h1>
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
