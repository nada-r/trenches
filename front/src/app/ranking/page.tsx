"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Power } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DisplayCard from "@/components/DisplayCard";




export default function Ranking() {
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
    <>
    <div>
      <h1>Homepage</h1>
    </div>
    <div>
        <h1>Trending</h1>
    </div>
    <div>
    <>{JSON.stringify(cards)}</>
    {cards.length > 0 && <DisplayCard card={cards[0]} />}
        <h1>Top Movers</h1>
    </div>
    <Table>
  <TableCaption>list</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Rank</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Calling power</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
        {cards.map((card, index) => (
          <TableRow key={card.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{card.name}</TableCell>
            <TableCell>{card.power.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
</Table>

    <Footer />
    </>
  );
}