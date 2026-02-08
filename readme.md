NetValue: The Gas-Adjusted Portfolio Tracker
"Stop looking at what you have; start looking at what you can actually keep."

🚩 The Problem: The "DeFi Illusion"
Most portfolio trackers show you a "Gross Balance." If you have $100 in a random token on Ethereum, but it costs $80 in gas to swap it, you don't actually have $100—you have $20. For retail users and "small fish," DeFi math is brutal. High gas fees create "Dust," where assets are technically in your wallet but economically impossible to move.

💡 The Solution: NetValue
NetValue is a minimalist DeFi dashboard powered by 1inch APIs that calculates your Net Liquidity in real-time. It subtracts the real-time cost of exit (swapping to stables/ETH) from your balance, giving you a brutally honest view of your wealth.

🛠 How it Works (1inch Integration)
1inch Portfolio API: To fetch real-time multi-chain balances and token metadata.

1inch Gas Price API: To pull live Gwei across 10+ chains (Ethereum, Base, Arbitrum, etc.).

1inch Spot Price API: To get the most accurate valuation of assets before gas subtraction.

🚀 Key Features
Net Reality Toggle: Instantly see your portfolio value after estimated transaction costs.

Dust Detection: Automatically flags tokens that are "locked" by current gas prices.

Cross-Chain Comparison: Shows you exactly how much cheaper your current portfolio management would be on L2s versus Mainnet.

🏗 Tech Stack
Frontend: Next.js, Tailwind CSS, Lucide Icons, Framer Motion.

Data: 1inch Developer Portal (Portfolio & Gas APIs).

UI/UX: Built with Lovable.dev for a premium, aesthetic finish.