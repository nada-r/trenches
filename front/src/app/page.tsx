'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Power } from '@prisma/client';

import Logo from '~/svg/Logo.svg';
import DisplayCard from '@/components/DisplayCard';

export default function HomePage() {

  const [cards, setCards] = useState<(Card & { power: Power })[]>([]);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axios.get("http://localhost:3000/cards");
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    }
    fetchCards();
  }, []);

  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <>{JSON.stringify(cards)}</>
      {cards.length > 0 && <DisplayCard card={cards[0]} />}
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Welcome to trenches.top</h1>
          <p className='mt-2 text-sm text-gray-800'>
            Find alpha, discover the best callers, make it out of the trenches{' '}
          </p>


          <ButtonLink className='mt-6' href='/ranking' variant='light'>
            connect wallet
          </ButtonLink>

          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://trenches.top'>
              trenches.top
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
