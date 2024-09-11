'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Homepage() {
  return (
    <>
      <div className="bg-neutral-800 border border-gray-500 rounded-2xl p-4">
        <div className="text-lg font-bold mb-2">Tournament</div>
        <div className="mb-2">Time remaining: 1 hours 37 minutes</div>
        <div className="mb-2">Price: 50 SOL</div>
        <div className="mb-4">Supply burn: 5%</div>
        <Button asChild className="w-full">
          <Link href="/tournament/1" className="w-full">
            View
          </Link>
        </Button>
      </div>
    </>
  );
}