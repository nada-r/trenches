import React from "react";
import { Token } from "@/models";

const TokenLinks = ({ token }: { token: Token }) => {
  const isPumpfun = token.data?.type === "pumpfun";
  const isDexScreener = !isPumpfun || token.data.poolAddress;

  return (
    <div className="flex flex-row gap-2">
      {isPumpfun ? (
        <a
          href={`https://pump.fun/${token.address}`}
          target="_blank"
          className="w-4 h-4"
        >
          <img src="/images/dexscreener.png" alt="pumpfun" />
        </a>
      ) : (
        <a
          href={`https://dexscreener.com/solana/${token.address}`}
          target="_blank"
          className="w-4 h-4"
        >
          <img src="/images/dexscreener.png" alt="dexscreener" />
        </a>
      )}
      {isDexScreener && token.data.poolAddress && (
        <a
          href={`https://dexscreener.com/solana/${token.data.poolAddress}`}
          target="_blank"
          className="w-4 h-4"
        >
          <img src="/images/dexscreener.png" alt="dexscreener" />
        </a>
      )}
    </div>
  );
};

export default TokenLinks;
