'use client';
import { useState } from 'react';

export default function PortfolioLoader() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // const fetchPortfolio = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/portfolio?address=${address}`);
  //     const result = await res.json();
  //     setData(result.result); // 👈 important
  //   } catch (err) {
  //     console.error("Fetch failed", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPortfolio = async () => {
  if (!address || !address.startsWith('0x')) {
    alert('Please enter a valid wallet address');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/portfolio?address=${address}`);
    const result = await res.json();
    setData(result.result);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter Wallet Address (0x...)"
          className="p-2 text-black rounded-lg w-full max-w-md"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={fetchPortfolio}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          {loading ? 'Analyzing...' : 'Load Portfolio'}
        </button>
      </div>

      {/* Total Value */}
      {data?.totalValueUsd && (
        <h2 className="mt-8 text-3xl font-bold">
          Total Value: ${data.totalValueUsd.toFixed(2)}
        </h2>
      )}

      {/* Tokens */}
      <div className="mt-6 grid gap-4">
        {data?.tokens?.map((token: any) => {
          const balance =
            Number(token.balance) / 10 ** token.decimals;
          const valueUsd = balance * token.priceToUsd;

          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between bg-slate-800 p-4 rounded-xl"
            >
              <div className="flex items-center gap-4">
                {token.logoURI && (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-10 h-10"
                  />
                )}
                <div>
                  <p className="font-semibold">{token.name}</p>
                  <p className="text-sm text-slate-400">
                    {balance.toFixed(4)} {token.symbol}
                  </p>
                </div>
              </div>

              <p className="font-bold">
                ${valueUsd.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}