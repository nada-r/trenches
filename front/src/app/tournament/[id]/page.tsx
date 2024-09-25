'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Token } from '@/app/portfolio/page';
import { Button } from '@/components/ui/button';
import TournamentSlot from '@/components/trenches/TournamentSlot';
import CallerTournamentCard from '@/components/trenches/CallerTournamentCard';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import {
  Tournament,
  TournamentParticipation,
  TournamentParticipationSchema,
  TournamentSchema,
} from '@/models';
import RemainingTime from '@/components/utils/RemainingTime';
import { usePrivy, WalletWithMetadata } from '@privy-io/react-auth';

const instance = createAxiosInstance();

const TournamentPage = ({ params }: { params: { id: string } }) => {
  const tournamentId = Number(params.id);
  const { user } = usePrivy();
  const solanaWallet =
    user &&
    user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === 'solana'
    );

  const [tournament, setTournament] = useState<
    Tournament & { participationCount: number }
  >();
  const [participation, setParticipation] = useState<
    TournamentParticipation & { score: number }
  >();
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<
    Array<Token | undefined>
  >([]);
  const [isAllCardsSelected, setIsAllCardsSelected] = useState(false);
  const [isAlreadyParticipate, setIsAlreadyParticipate] = useState(false);
  const [isTournamentClosed, setIsTournamentClosed] = useState(false);

  useEffect(() => {
    if (tournament && tournament.startedAt) {
      const checkTournamentStatus = () => {
        const startTime = tournament.startedAt!.getTime();
        const currentTime = new Date().getTime();
        const endTime = startTime + tournament.metadata.openDuration * 1000;
        setIsTournamentClosed(currentTime >= endTime);
      };

      checkTournamentStatus();
      const intervalId = setInterval(checkTournamentStatus, 1000);

      return () => clearInterval(intervalId);
    }
  }, [tournament]);

  useEffect(() => {
    if (solanaWallet) {
      const fetchTokens = async () => {
        try {
          const callerResponse = await instance.get('/callers');
          const response = await instance.get(
            `/portfolio/${solanaWallet?.address}`
          );

          setAvailableTokens(
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
  }, [solanaWallet]);

  useEffect(() => {
    if (solanaWallet && availableTokens.length > 0) {
      const fetchParticipation = async () => {
        try {
          const address = solanaWallet.address;
          const response = await instance.get(
            `/tournament/${tournamentId}/${address}`
          );
          const participation = TournamentParticipationSchema.parse(
            response.data
          );

          setIsAlreadyParticipate(true);
          setParticipation({ ...participation, score: response.data.score });
          setSelectedTokens(
            participation.callers.map((c) =>
              availableTokens.find((t) => t.id.toString() === c)
            )
          );
        } catch (error) {
          console.error('Error fetching user tokens:', error);
        }
      };
      fetchParticipation();
    }
  }, [solanaWallet, availableTokens]);

  useEffect(() => {
    setIsAllCardsSelected(
      selectedTokens.filter((t) => t !== undefined).length === 3
    );
  }, [selectedTokens]);

  useEffect(() => {
    // Initialize selectedTokens with 3 undefined elements
    setSelectedTokens([undefined, undefined, undefined]);

    async function fetchTournament() {
      try {
        const response = await instance.get('/tournament/' + params.id);
        setTournament({
          ...TournamentSchema.parse(response.data),
          participationCount: response.data.participationCount,
        });
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    }
    fetchTournament();
  }, []);

  const selectToken = (token: Token) => {
    const index = selectedTokens.findIndex((t) => t === undefined);
    if (index !== -1) {
      const newSelected = [...selectedTokens];
      newSelected[index] = token;
      setSelectedTokens(newSelected);
    }
  };

  const unselectToken = (token: Token) => {
    const index = selectedTokens.findIndex((t) => t?.id === token.id);
    if (index !== -1) {
      const newSelected = [...selectedTokens];
      newSelected[index] = undefined;
      setSelectedTokens(newSelected);
    }
  };

  const handleJoinTournament = async () => {
    try {
      const response = await instance.post('/tournament/join', {
        tournamentId: Number(params.id),
        walletPubkey: solanaWallet?.address,
        callers: selectedTokens.map((t) => t?.id.toString()),
      });

      console.log('Joined tournament:', response.data);
      const participation = TournamentParticipationSchema.parse(response.data);

      setIsAlreadyParticipate(true);
      setSelectedTokens(
        participation.callers.map((c) =>
          availableTokens.find((t) => t.id === c)
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
          {tournament && (
            <span>
              {isTournamentClosed ? 'Finishing' : 'Starting'} in
              <RemainingTime
                classname="m-2"
                startedAt={tournament.startedAt!}
                durationInSeconds={
                  isTournamentClosed
                    ? tournament.metadata.endDuration
                    : tournament.metadata.openDuration
                }
              />
            </span>
          )}
        </div>
      </div>

      <h1 className="text-xl font-bold mb-4">Available Cards</h1>
      <div className="grid grid-cols-3 gap-4 overflow-y-auto py-4">
        {availableTokens.map((card, index) => (
          <CallerTournamentCard
            key={index}
            {...card}
            onSelect={() => selectToken(card)}
            isSelected={selectedTokens.some((t) => t && t.id === card.id)}
          />
        ))}
      </div>
      <h1 className="text-xl font-bold mb-4">Your Tournament Cards</h1>
      <span>Actual score: {participation?.score}</span>
      <div className="grid grid-cols-3 gap-4 py-4">
        {selectedTokens.map((card, index) => (
          <TournamentSlot key={index} token={card} onUnselect={unselectToken} />
        ))}
      </div>
      <Button
        disabled={
          isTournamentClosed || !isAllCardsSelected || isAlreadyParticipate
        }
        className="w-full"
        onClick={() => handleJoinTournament()}
      >
        {isTournamentClosed
          ? 'Participation closed'
          : isAlreadyParticipate
            ? 'Already participate'
            : 'Participate'}
      </Button>
      <p className="mb-16 w-full text-sm text-neutral-500 text-center mt-3">
        {tournament?.participationCount} players have entered the tournament
      </p>
      <h1 className="text-xl font-bold mb-4">Rewards Breakdown</h1>

      <div className="bg-neutral-700 text-neutral-300 rounded-2xl p-4 mb-4">
        <p className="text-center text-neutral-500 italic">
          Not implemented yet
        </p>
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