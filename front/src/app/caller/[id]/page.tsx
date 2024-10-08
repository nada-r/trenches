'use client';
import React, { useEffect, useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import { Call, Caller, Token } from '@/models';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import CallingPower from '@/components/trenches/CallingPower';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useRouter } from 'next/navigation';
import CallCard from '@/components/trenches/CallCard';

const instance = createAxiosInstance();

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { profile, walletPubkey } = useProfileContext();

  const [caller, setCaller] = useState<
    Caller & {
      openCalls: Array<Call & { token: Token; multiple: number }>;
      closedCalls: Array<Call & { token: Token; multiple: number }>;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Open Calls</h1>
          {caller?.openCalls && caller.openCalls.length > 0 ? (
            caller.openCalls.map((call, index) => (
              <CallCard key={index} call={call} showCaller={false} />
            ))
          ) : (
            <p className="text-gray-500 italic">
              This caller has no open calls at the moment.
            </p>
          )}
        </div>
        <div className={`flex flex-col gap-3 mt-4`}>
          <h1>Closed Calls</h1>
          {caller?.closedCalls && caller.closedCalls.length > 0 ? (
            caller.closedCalls.map((call, index) => (
              <CallCard key={index} call={call} showCaller={false} />
            ))
          ) : (
            <p className="text-gray-500 italic">
              This caller has no closed calls at the moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
