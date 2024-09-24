import React from "react";
import Link from "next/link";
import RankIcon from "./icons/RankIcon";
import PortfolioIcon from "./icons/PortfolioIcon";
import MarketIcon from "./icons/MarketIcon";
import TournamentIcon from "./icons/TournamentIcon";

const menulist=[{
  icon: <RankIcon />,
  name: "Ranking",
},{
  icon: <PortfolioIcon />,
  name: "Portfolio",
},{
  icon: <MarketIcon />,
  name: "Market",
},{
  icon: <TournamentIcon />,
  name: "Tournament",
}]

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full flex justify-around bg-background text-foreground border-t border-border py-2 items-baseline"> {/* Apply global background, text color, and border */}
      {menulist.map(menu=> <Link href="/ranking" className="text-foreground no-underline">
        <div className="flex flex-col items-center">
          <div className="shrink-0">{menu.icon}</div>
          <p className="m-0 text-xs">{menu.name}</p>
        </div>
      </Link>)}
    </footer>
  );
};

export default Footer;
