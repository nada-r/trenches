'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import TournamentSlot from '@/components/trenches/TournamentSlot';
import CallerTournamentCard from '@/components/trenches/CallerTournamentCard';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import {
  Caller,
  Tournament,
  TournamentParticipation,
  TournamentParticipationSchema,
  TournamentSchema,
} from '@/models';
import dayjs from 'dayjs';
import TournamentCounterDate from '@/components/trenches/TournamentCounterDate';
import CallingPower from '@/components/trenches/CallingPower';
import { TournamentExtended } from '@/components/trenches/TournamentCard';
import { useProfileContext } from '@/contexts/ProfileContext';

const instance = createAxiosInstance();

const TournamentPage = ({ params }: { params: { id: string } }) => {
  const tournamentId = Number(params.id);

  const { walletPubkey } = useProfileContext();

  const [tournament, setTournament] = useState<TournamentExtended>();
  const [participation, setParticipation] = useState<
    TournamentParticipation & { score: number }
  >();
  const [myCallers, setMyCallers] = useState<
    Array<Caller & { balance: number; marketCap: number }>
  >([]);
  const [selectedCallers, setSelectedCallers] = useState<
    Array<(Caller & { balance: number; marketCap: number }) | undefined>
  >([]);

  const [score, setScore] = useState(0);
  const [isAllCardsSelected, setIsAllCardsSelected] = useState(false);
  const [isAlreadyParticipate, setIsAlreadyParticipate] = useState(false);

  const [isUpcoming, setIsUpcoming] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    if (tournament && tournament.startedAt) {
      const checkTournamentStatus = () => {
        const startedAt = dayjs(tournament.startedAt);
        const now = dayjs();
        const closeTime = startedAt.add(
          tournament.metadata.openDuration,
          'second'
        );
        const endTime = startedAt.add(
          tournament.metadata.endDuration,
          'second'
        );

        setIsUpcoming(now.isBefore(startedAt));
        setIsOpen(startedAt.isBefore(now) && now.isBefore(closeTime));
        setIsClosed(closeTime.isBefore(now) && now.isBefore(endTime));
        setIsFinish(endTime.isBefore(now));
      };

      checkTournamentStatus();
      const intervalId = setInterval(checkTournamentStatus, 1000);

      return () => clearInterval(intervalId);
    }
  }, [tournament]);

  useEffect(() => {
    if (walletPubkey) {
      const fetchTokens = async () => {
        try {
          const callerResponse = await instance.get('/callers');
          const response = await instance.get(`/portfolio/${walletPubkey}`);

          setMyCallers(
            response.data.portfolio.map((t: any, i: number) => ({
              ...callerResponse.data.find((c: any) => c.id === t.callerId),
              marketCap: 430000,
              balance: t.balance,
            }))
          );
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      };

      fetchTokens();
    }
  }, [walletPubkey]);

  useEffect(() => {
    if (walletPubkey && myCallers.length > 0) {
      const fetchParticipation = async () => {
        try {
          const response = await instance.get(
            `/tournament/${tournamentId}/${walletPubkey}`
          );
          const participation = TournamentParticipationSchema.parse(
            response.data
          );

          setIsAlreadyParticipate(true);
          setParticipation({ ...participation, score: response.data.score });
          setSelectedCallers(
            participation.callers.map((c) =>
              myCallers.find((t) => t.id.toString() === c)
            )
          );
        } catch (error) {
          console.error('Error fetching user tokens:', error);
        }
      };
      fetchParticipation();
    }
  }, [walletPubkey, myCallers]);

  useEffect(() => {
    setIsAllCardsSelected(
      selectedCallers.filter((t) => t !== undefined).length === 3
    );
    setScore(selectedCallers.reduce((acc, c) => acc + (c?.data.power || 0), 0));
  }, [selectedCallers]);

  useEffect(() => {
    // Initialize selectedTokens with 3 undefined elements
    setSelectedCallers([undefined, undefined, undefined]);

    async function fetchTournament() {
      try {
        const response = await instance.get('/tournament/' + params.id);
        const parsedTournament = TournamentSchema.parse(response.data);

        const startedAt = dayjs(parsedTournament.startedAt);
        const now = dayjs();
        const closeTime = startedAt.add(
          parsedTournament.metadata.openDuration,
          'second'
        );
        const endTime = startedAt.add(
          parsedTournament.metadata.endDuration,
          'second'
        );
        setTournament({
          ...parsedTournament,
          participationCount: response.data.participationCount,
          isUpcoming: now.isBefore(startedAt),
          isOpen: startedAt.isBefore(now) && now.isBefore(closeTime),
          isClosed: closeTime.isBefore(now) && now.isBefore(endTime),
          isFinish: endTime.isBefore(now),
        });
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    }
    fetchTournament();
  }, []);

  const selectCaller = (
    caller: Caller & { balance: number; marketCap: number }
  ) => {
    const index = selectedCallers.findIndex((t) => t === undefined);
    if (index !== -1) {
      const newSelected = [...selectedCallers];
      newSelected[index] = caller;
      setSelectedCallers(newSelected);
    }
  };

  const unselectCaller = (caller: Caller) => {
    const index = selectedCallers.findIndex((t) => t?.id === caller.id);
    if (index !== -1) {
      const newSelected = [...selectedCallers];
      newSelected[index] = undefined;
      setSelectedCallers(newSelected);
    }
  };

  const handleJoinTournament = async () => {
    try {
      const response = await instance.post('/tournament/join', {
        tournamentId: Number(params.id),
        walletPubkey: walletPubkey,
        callers: selectedCallers.map((t) => t?.id.toString()),
      });

      console.log('Joined tournament:', response.data);
      const participation = TournamentParticipationSchema.parse(response.data);

      setIsAlreadyParticipate(true);
      setSelectedCallers(
        participation.callers.map((c) =>
          myCallers.find((t) => t.id === Number(c))
        )
      );
      // You might want to update the UI or refetch tournaments here
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Link href="/tournament" className="mr-2">
          <IoIosArrowBack />
        </Link>
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="text-2xl font-bold text-center">
            {tournament?.name || 'Tournament'}
          </h1>
          {tournament && <TournamentCounterDate tournament={tournament} />}
        </div>
      </div>

      <h1 className="text-xl font-bold mb-4">Callers in game</h1>
      <div className="">
        Your actual score: {isClosed && <CallingPower value={score} />}
        {isFinish && (
          <>
            <CallingPower value={participation?.data.score || 0} />
            <span> Your final rank: #{participation?.data.rank}</span>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 py-4">
        {selectedCallers.map((caller, index) => (
          <TournamentSlot
            key={index}
            caller={caller}
            participationClosed={isAlreadyParticipate}
            onUnselect={unselectCaller}
          />
        ))}
      </div>
      <Button
        disabled={isClosed || !isAllCardsSelected || isAlreadyParticipate}
        className="w-full rounded-full"
        onClick={() => handleJoinTournament()}
      >
        {isClosed
          ? 'Participation closed'
          : isAlreadyParticipate
            ? 'Already participate'
            : 'Participate'}
      </Button>
      <p className="mb-16 w-full text-sm text-neutral-500 text-center mt-3">
        {tournament?.participationCount} players have entered the tournament
      </p>

      {isOpen && (
        <>
          <h1 className="text-xl font-bold mb-4">Inventory</h1>
          <div className="grid grid-cols-3 gap-4 py-4">
            {myCallers.map((caller, index) => (
              <CallerTournamentCard
                key={index}
                {...caller}
                participationClosed={isAlreadyParticipate}
                onSelect={() => selectCaller(caller)}
                isSelected={selectedCallers.some(
                  (t) => t && t.id === caller.id
                )}
              />
            ))}
          </div>
        </>
      )}

      <h1 className="text-xl font-bold mb-4">Rewards Breakdown</h1>
      <div className="bg-neutral-700 text-neutral-300 rounded-2xl p-4 mb-4">
        <img src="https://i.imgflip.com/94q580.jpg" />
        {/*<p>The top 10 winners will receive the following</p>
        <p className="mt-2">
          1st Place: ... SOL + x% of supply burned
          <br />
          2nd Place: ... SOL + x% of supply burned
          <br />
          3rd Place: ... SOL + x% of supply burned
          <br />
          4th Place: ... SOL + x% of supply burned
          <br />
          5th Place: ... SOL + x% of supply burned
          <br />
          6th Place: ... SOL + x% of supply burned
          <br />
          7th Place: ... SOL + x% of supply burned
          <br />
          8th Place: ... SOL + x% of supply burned
          <br />
          9th Place: ... SOL + x% of supply burned
          <br />
          10th Place: ... SOL + x% of supply burned
        </p>*/}
      </div>
    </>
  );
};

export default TournamentPage;