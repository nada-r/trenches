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
import RankingImage from "@/components/ui/RankingImage";



export default function Ranking() {
  const [cards, setCards] = useState<(Card & { power: Power })[]>([]);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL!}/cards`);
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
      <h1>Ranking</h1>
    </div>
    <div>
        <h1>Trending</h1>
    </div>
    <div>
    {/* <>{JSON.stringify(cards)}</> test if data is loading*/} 
    {/* {cards.length > 0 && <DisplayCard card={cards[0]} />} */}
    </div>
    <Table className="bg-background text-foreground border-border">
      <TableCaption className="text-muted-foreground">list</TableCaption>
      <TableHeader className="border-border">
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground border-border">Rank</TableHead> 
          <TableHead className="text-muted-foreground border-border"></TableHead>
          <TableHead className="text-muted-foreground border-border">Name</TableHead>
          <TableHead className="text-muted-foreground border-border">Calling power</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.map((card, index) => (
          <TableRow key={card.id} className="border-border">
            <TableCell className="font-medium text-foreground border-border">{index + 1}</TableCell> 
            <TableCell className="border-border">
              <RankingImage image={card.image}/>
            </TableCell>
            <TableCell className="text-foreground border-border">{card.name}</TableCell>
            <TableCell className="text-foreground border-border">{card.power.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Footer />
    </>
  );
}