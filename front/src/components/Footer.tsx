import React from "react";
import Link from "next/link";
import RankIcon from "./icons/RankIcon";
import PortfolioIcon from "./icons/PortfolioIcon";
import MarketIcon from "./icons/MarketIcon";
import TournamentIcon from "./icons/TournamentIcon";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full flex justify-around bg-background text-foreground border-t border-border py-2"> {/* Apply global background, text color, and border */}
      <Link href="/ranking" className="text-foreground no-underline">
        <div className="flex flex-col items-center">
          <span className="text-2xl"><RankIcon /></span>
          <p className="m-0 text-xs">Ranking</p>
        </div>
      </Link>
      <Link href="/portfolio" className="text-foreground no-underline">
        <div className="flex flex-col items-center">
          <span className="text-2xl"><PortfolioIcon /></span>
          <p className="m-0 text-xs">Portfolio</p>
        </div>
      </Link>
      <Link href="/market" className="text-foreground no-underline">
        <div className="flex flex-col items-center">
          <span className="text-2xl"><MarketIcon /></span>
          <p className="m-0 text-xs">Market</p>
        </div>
      </Link>
      <Link href="/tournament" className="text-foreground no-underline">
        <div className="flex flex-col items-center">
          <span className="text-2xl"><TournamentIcon /></span>
          <p className="m-0 text-xs">Tournament</p>
        </div>
      </Link>
    </footer>
  );
};

export default Footer;
