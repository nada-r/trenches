'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Token } from '@/app/portfolio/page';
import { Button } from '@/components/ui/button';
import TournamentSlot from '@/components/trenches/TournamentSlot';
import CallerTournamentCard from '@/components/trenches/CallerTournamentCard';
import { createAxiosInstance } from '@/utils/createAxiosInstance';
import { Tournament, TournamentSchema } from '@/models';
import RemainingTime from '@/components/utils/RemainingTime';

const instance = createAxiosInstance();

const TournamentPage = ({ params }: { params: { id: string } }) => {
  const [tournament, setTournament] = useState<Tournament>();
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<
    Array<Token | undefined>
  >([]);
  const [isAllCardsSelected, setIsAllCardsSelected] = useState(false);

  useEffect(() => {
    setIsAllCardsSelected(
      selectedTokens.filter((t) => t !== undefined).length === 3
    );
  }, [selectedTokens]);

  useEffect(() => {
    async function fetchTournament() {
      try {
        const response = await instance.get('/tournament/' + params.id);
        setTournament(TournamentSchema.parse(response.data));
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    }
    fetchTournament();

    // Temporary function to generate 4 random tokens
    function generateRandomTokens() {
      // prettier-ignore
      const fakeTokens: Token[] = [
        { id: '1', rank: 1, name: 'greg', marketCap: 430000, balance: 13000000, image: 'https://assets.api.uizard.io/api/cdn/stream/ddcabbc0-9002-4ebc-8bfc-2a47b3f636b1.png' },
        { id: '2', rank: 2, name: 'Ansem', marketCap: 430000, balance: 3000000, image: 'https://assets.api.uizard.io/api/cdn/stream/848ade87-3e76-42a4-9842-ebacf29c9749.png' },
        { id: '3', rank: 3, name: 'bqsed16z', marketCap: 430000, balance: 1000000, image: 'https://assets.api.uizard.io/api/cdn/stream/e53ae5aa-f673-43e7-b711-a691a3603a64.png' },
        { id: '4', rank: 4, name: 'wallstreetbets', marketCap: 430000, balance: 100000, image: 'https://assets.api.uizard.io/api/cdn/stream/5d1295d1-654a-47cd-a559-f4eea99a0f7c.png' },
      ];
      setAvailableTokens(fakeTokens);
    }

    generateRandomTokens();
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

  // Initialize selectedTokens with 3 undefined elements
  useEffect(() => {
    setSelectedTokens([undefined, undefined, undefined]);
  }, []);

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
              Starting in
              <RemainingTime
                classname="m-2"
                startedAt={tournament.startedAt!}
                durationInSeconds={tournament.metadata.endDuration}
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
      <div className="grid grid-cols-3 gap-4 py-4">
        {selectedTokens.map((card, index) => (
          <TournamentSlot key={index} token={card} onUnselect={unselectToken} />
        ))}
      </div>
      <h1 className="text-xl font-bold mb-4">Rewards Breakdown</h1>
      <div className="bg-neutral-700 text-neutral-300 rounded-2xl p-4 mb-4">
        <p>The top 10 winners will receive the following</p>
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
        </p>
      </div>
      <Button disabled={!isAllCardsSelected} className="w-full">
        Participate
      </Button>
      <p className="mb-16 w-full text-sm text-neutral-500 text-center mt-3">
        234 players have entered the tournament
      </p>
    </>
  );
};

export default TournamentPage;