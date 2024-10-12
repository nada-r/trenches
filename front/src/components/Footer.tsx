import React from "react";
import Link from "next/link";
import RankIcon from "./icons/RankIcon";
import PortfolioIcon from "./icons/PortfolioIcon";
import MarketIcon from "./icons/MarketIcon";
import TournamentIcon from "./icons/TournamentIcon";
import CallIcon from "@/components/icons/CallIcon";

const menulist = [
  {
    icon: <RankIcon />,
    name: "Ranking",
    href: "/ranking",
  },
  {
    icon: <PortfolioIcon />,
    name: "Portfolio",
    href: "/portfolio",
  },
  {
    icon: <CallIcon />,
    name: "Calls",
    href: "/call",
  },
  // {
  //   icon: <MarketIcon />,
  //   name: "Market",
  //   href: "/market",
  // },
  // {
  //   icon: <TournamentIcon />,
  //   name: "Tournament",
  //   href: "/tournament",
  // },
];

const Footer: React.FC = () => {
  return (
    <footer className="sticky z-[999] bottom-0 w-full flex justify-center bg-background text-foreground border-t border-border py-2">
      {menulist.map((menu) => (
        <Link href={menu.href} className="text-foreground no-underline mx-4">
          <div className="flex flex-col items-center">
            <div className="shrink-0">{menu.icon}</div>
            <p className="m-0 text-xs">{menu.name}</p>
          </div>
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
