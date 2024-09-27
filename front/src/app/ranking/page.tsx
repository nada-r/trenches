'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { Caller } from '@/models';
import CallingPower from '@/components/trenches/CallingPower';
import CallerAvatar from '@/components/trenches/CallerAvatar';
import { useRouter } from 'next/navigation';
import { useProfileContext } from '@/contexts/ProfileContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const instance = createAxiosInstance();

export default function Ranking() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const [callers, setCallers] = useState<Caller[]>([]);
  const [allCallers, setAllCallers] = useState<Caller[]>([]);
  const [followingCallers, setFollowingCallers] = useState<Caller[]>([]);
  const [selectedView, setSelectedView] = useState<'trending' | 'following'>(
    'trending'
  );

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await instance.get('/callers');
        const updatedCallers = response.data.map((caller: Caller) => ({
          ...caller,
          data: {
            ...caller.data,
            power: caller.data.power || 0,
          },
        }));
        setAllCallers(updatedCallers);
        setCallers(updatedCallers);
      } catch (error) {
        console.error('Error fetching callers:', error);
      }
    }

    fetchCards();
  }, []);

  useEffect(() => {
    if (profile) {
      setFollowingCallers(
        allCallers.filter((caller) =>
          profile.data.favorites.includes(caller.id)
        )
      );
    }
  }, [allCallers, profile]);

  const viewTrending = () => {
    setCallers(allCallers);
  };

  const viewFollowing = () => {
    setCallers(followingCallers);
  };

  const displayCallerPage = (callerId: number) => {
    router.push(`/caller/${callerId}`);
  };

  return (
    <>
      <ToggleGroup
        type="single"
        value={selectedView}
        className="justify-start"
        onValueChange={(value) => {
          if (value === 'trending') {
            viewTrending();
          } else if (value === 'followed') {
            viewFollowing();
          }
          setSelectedView(value as 'trending' | 'following');
        }}
      >
        <ToggleGroupItem
          className="h-6 rounded-full"
          onClick={() => viewTrending()}
          value="trending"
        >
          Trending
        </ToggleGroupItem>
        <ToggleGroupItem
          className="h-6 rounded-full"
          onClick={() => viewFollowing()}
          value="followed"
        >
          Followed
        </ToggleGroupItem>
      </ToggleGroup>

      <Table className="bg-background text-foreground border-border mt-2">
        <TableCaption className="text-muted-foreground"></TableCaption>
        <TableHeader className="border-border">
          <TableRow>
            <TableHead className="w-[50px] text-muted-foreground border-border">
              Rank
            </TableHead>
            <TableHead className="text-muted-foreground border-border"></TableHead>
            <TableHead className="text-muted-foreground border-border px-0">
              Alpha Caller
            </TableHead>
            <TableHead className="text-muted-foreground border-border">
              Calling power
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callers.map((caller, index) => (
            <TableRow
              key={caller.id}
              className="border-border"
              onClick={() => displayCallerPage(caller.id)}
            >
              <TableCell className="font-medium text-foreground border-border">
                #{caller.data.rank}
              </TableCell>
              <TableCell className="border-border pr-2">
                <CallerAvatar
                  name={caller.name}
                  image={caller.image === null ? undefined : caller.image}
                  className="w-8 h-8"
                />
              </TableCell>
              <TableCell className="text-foreground border-border pl-2">
                {caller.name}
              </TableCell>
              <TableCell className="text-foreground border-border">
                <div className="flex justify-center items-center">
                  <CallingPower value={caller.data.power} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
