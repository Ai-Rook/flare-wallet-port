# Flare Wallet — Multi-Asset Wallet with FTSO Price Feeds & FAssets

A React Native / Expo mobile crypto wallet ported from CoinPayments to Flare blockchain, featuring decentralized price feeds from FTSOv2 and interoperable asset support via FAssets.

**Hackathon:** Flare Summer Signal (DoraHacks) — Bounty 1: Interoperable Asset Products
**Deadline:** August 14, 2026
**Live on:** Coston2 Testnet (Chain ID 114)

## What This Is

This is an existing production mobile crypto wallet app (originally built for CoinPayments) that has been ported to Flare. The app was a complete, working wallet with 18 token wallets, live market data, send/receive flows, and portfolio tracking — all of which have been rewired to Flare's native infrastructure.

## What Was Built During the Hackathon

### 1. FTSOv2 Price Feed Integration (services/LivePriceService.js)
- **Replaced:** CoinGecko API + CoinPayments rates API
- **With:** Flare Time Series Oracle (FTSOv2) — decentralized, on-chain price feeds
- Feeds: FLR/USD, BTC/USD, ETH/USD, XRP/USD, DOGE/USD, LTC/USD, SOL/USD, ADA/USD
- Updates every 30 seconds (FTSO updates every ~1.8s at block latency)
- Free to read — no API key, no rate limits, no centralized dependency
- Original CoinGecko/CoinPayments code preserved as comments

### 2. Flare Network Configuration (appConfig.js)
- Coston2 testnet RPC, Chain ID 114, explorer URL
- Mainnet config ready for production deployment
- CoinPayments API URL commented out (not deleted)

### 3. FAssets Token Support (constants/tokens.js)
- Added FLR (Flare native token)
- Added FXRP (Flare XRP — FAsset backed by XRP)
- Added FBTC (Flare Bitcoin — FAsset backed by BTC)
- Added FDOGE (Flare Doge — FAsset backed by DOGE)
- Each FAsset tagged with `flareNative: true` and `fAsset: true` with underlying asset reference

### 4. Flare Wallet Service (services/FlareWalletService.js)
- Native FLR/C2FLR balance queries via ethers.js
- ERC-20 FAsset balance queries
- Send native + ERC-20 transactions
- Wallet creation and management
- Gas price and nonce queries
- Connects to Coston2 testnet

## What Existed Before the Hackathon

- Complete React Native / Expo mobile wallet app (230 files)
- 18 crypto token wallets with real CoinMarketCap icons
- Markets page with live prices, 24h/7d change, market cap, volume
- Wallet page with All/Crypto/Fiat filters, search
- Send/Receive with QR code
- Portfolio tracking with sparkline charts
- Bottom tab navigation (6 tabs)
- Auth flow, login screen, KYC flow
- Custom animated components (HeroShimmer, GlowPulse, SpringPress, CounterRoll, etc.)
- Card tiers (Simple/Signature/Black)
- Originally connected to CoinPayments API on VPS

## Flare Integration Architecture

```
┌─────────────────────────────────────────┐
│           React Native / Expo            │
│              Mobile Wallet               │
├─────────────┬───────────┬───────────────┤
│  HomeScreen │ Markets   │  WalletScreen  │
│  (portfolio)│ (prices)  │  (balances)    │
├─────────────┴───────────┴───────────────┤
│         LivePriceService.js              │
│    (FTSOv2 decentralized price feeds)    │
├─────────────────────────────────────────┤
│         FlareWalletService.js            │
│    (ethers.js → Coston2 testnet RPC)     │
├─────────────────────────────────────────┤
│              Flare Blockchain             │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐ │
│  │ FTSOv2  │  │ FAssets  │  │   FLR   │ │
│  │ (prices)│  │(FXRP/BTC)│  │ (native)│ │
│  └─────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** React Native, Expo, React Context API
- **Blockchain:** Flare (Coston2 testnet), ethers.js v6
- **Price Feeds:** Flare FTSOv2 (enshrined oracle, free, decentralized)
- **Interoperable Assets:** Flare FAssets (trustless bridge for XRP, BTC, DOGE)
- **NPM Packages:** ethers, @flarenetwork/flare-periphery-contract-artifacts

## Network Configuration

| Network | Chain ID | RPC | Native Token |
|---------|----------|-----|--------------|
| Coston2 (testnet) | 114 | `https://coston2-api.flare.network/ext/C/rpc` | C2FLR |
| Flare Mainnet | 14 | `https://flare-api.flare.network/ext/C/rpc` | FLR |

**Testnet Faucet:** https://faucet.flare.network/coston2 (C2FLR, FXRP, USDT0)

## Setup

```bash
# Install dependencies
npm install

# Install Flare packages
npm install ethers @flarenetwork/flare-periphery-contract-artifacts

# Run the app
npx expo start
```

## Roadmap

- **FAssets minting UI** — guide users through sending XRP → receiving FXRP
- **Flare Mainnet deployment** — move from Coston2 to production
- **FDC integration** — verify cross-chain transactions in-app
- **Flare Confidential Compute** — private transaction support (Bounty 2 track)
- **DeFi integrations** — yield farming with FAssets on Flare DeFi protocols

## Original Project

This app was originally built as a CoinPayments mobile wallet. The original codebase is preserved at [Ai-Rook/rain-coinpayments-app](https://github.com/Ai-Rook/rain-coinpayments-app) (private). All CoinPayments references in this fork are commented out, not deleted.

## License

MIT
