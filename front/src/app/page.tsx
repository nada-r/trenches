'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';


import Logo from '~/svg/Logo.svg';
import DisplayCard from '@/components/DisplayCard';

export default function HomePage() {

  
  console.log(process.env)
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
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
