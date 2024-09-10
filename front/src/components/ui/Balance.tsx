// components/Balance.tsx

interface BalanceProps {
  balance: number | undefined;
}

export function Balance({ balance }: BalanceProps) {
  if (balance === undefined) return <span>-</span>;

  if (balance < 1000) return <span>{balance.toFixed(0)}</span>;

  const formatter = (num: number | undefined): string => {
    if (num === undefined) return '-';

    if (num >= 1e9) {
      return Math.floor(num / 1e9) + 'b';
    } else if (num >= 1e6) {
      return Math.floor(num / 1e6) + 'm';
    } else if (num >= 1e3) {
      return Math.floor(num / 1e3) + 'k';
    } else {
      return Math.floor(num).toString();
    }
  }

  return <span>{formatter(balance)}</span>;
}
