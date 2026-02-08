'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiCopy, FiExternalLink } from 'react-icons/fi';
import { getEthGasPrice } from '@/utils/fetchGas';

export default function PortfolioTracker() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<number | null>(null);

  // Fetch gas price on component mount
  useEffect(() => {
    const fetchGas = async () => {
      try {
        const gasData = await getEthGasPrice();
        setGasPrice(gasData?.standard); // Assuming standard gas price
      } catch (err) {
        console.error("Failed to fetch gas price", err);
      }
    };
    fetchGas();
  }, []);

  const fetchPortfolio = async () => {
    if (!address || !address.startsWith('0x')) {
      setError('Please enter a valid Ethereum wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolio?address=${address}`);
      if (!res.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Crypto Portfolio Tracker
          </h1>
          <p className="text-gray-400">Track your Ethereum wallet's token balances and values</p>
        </header>

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Ethereum wallet address (0x...)"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value.trim());
                  setError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && fetchPortfolio()}
              />
            </div>
            <button
              onClick={fetchPortfolio}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Track Portfolio'
              )}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>

        {gasPrice && (
          <div className="text-center text-sm text-gray-400 mb-8">
            Current Gas Price: {gasPrice} Gwei
          </div>
        )}

        {/* Portfolio Overview */}
        {data && (
          <div className="space-y-8">
            {/* Total Value Card */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 shadow-lg">
              <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Portfolio Value</h2>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold">
                    ${data.totalValueUsd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-green-400 mt-1">
                    +0.00% (24h)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tokens</p>
                  <p className="text-xl font-semibold">{data.tokens?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Token List */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.tokens?.map((token: any) => {
                      const balance = Number(token.balance) / 10 ** token.decimals;
                      const valueUsd = balance * token.priceToUsd;
                      const priceChange24h = 0; // Replace with actual 24h change if available

                      return (
                        <tr key={token.address} className="hover:bg-gray-750 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {token.logoURI ? (
                                <img
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  className="w-8 h-8 rounded-full mr-3"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://cryptoicons.org/api/icon/${token.symbol.toLowerCase()}/20`;
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  {token.symbol[0]}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{token.name}</div>
                                <div className="text-sm text-gray-400">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div>{balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                            <div className="text-sm text-gray-400">
                              ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div>${token.priceToUsd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                            <div className={`text-sm ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(priceChange24h)}%
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="font-medium">
                              ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-gray-800 hover:bg-gray-750 p-4 rounded-xl transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <FiCopy className="text-blue-400" />
                  </div>
                  <span>Copy Address</span>
                </div>
                <FiExternalLink className="text-gray-400" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-750 p-4 rounded-xl transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                    <FiExternalLink className="text-green-400" />
                  </div>
                  <span>View on Etherscan</span>
                </div>
                <FiExternalLink className="text-gray-400" />
              </button>
              <button className="bg-gray-800 hover:bg-gray-750 p-4 rounded-xl transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  </div>
                  <span>Dark Mode</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded-full flex items-center p-0.5">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md transform translate-x-3"></div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Data provided by 1inch API • {new Date().getFullYear()} Crypto Portfolio Tracker</p>
        </footer>
      </div>
    </div>
  );
}