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
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useRouter } from 'next/navigation';

const instance = createAxiosInstance();

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { profile, walletPubkey } = useProfileContext();

  const [caller, setCaller] = useState<
    Caller & {
      openCalls: Call[];
      closedCalls: Call[];
    }
  >();
  const [isFollowing, setIsFollowing] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setIsFollowing(profile.data.favorites.includes(Number(params.id)));
    }
  }, [profile]);

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await instance.post(`/caller/${params.id}/${endpoint}`, {
        walletPubkey,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <>
      <Link href="#" onClick={() => router.back()} className="mr-2">
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
            <>
              <a
                href={`https://t.me/${caller.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 pl-2"
              >
                <FaTelegramPlane />
              </a>
              <button
                onClick={handleFollowToggle}
                className="ml-2 hover:text-yellow-400"
              >
                {isFollowing ? <AiFillStar /> : <AiOutlineStar />}
              </button>
            </>
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

      <Table className="mt-4">
        <TableHeader>
          <TableRow className="border-b-gray-600">
            <TableHead className="font-bold text-lg text-white">
              Opened Calls
            </TableHead>
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
      <Table className="mt-4">
        <TableHeader>
          <TableRow className="border-b-gray-600">
            <TableHead className="font-bold text-lg text-white">
              Closed Calls
            </TableHead>
            {/*<TableHead>Since</TableHead>*/}
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
              {/*<TableCell>
                {(() => {
                  const createdAt = new Date(call.createdAt);
                  const now = new Date();
                  const diffTime = Math.abs(
                    now.getTime() - createdAt.getTime()
                  );
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return `${diffDays}d`;
                })()}
              </TableCell>*/}
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
