# Flare Wallet — Multi-Asset Wallet with FTSO Price Feeds & FAssets

A React Native / Expo mobile crypto wallet built from scratch for Flare blockchain, featuring decentralized price feeds from FTSOv2 and interoperable asset support via FAssets.

**Hackathon:** Flare Summer Signal (DoraHacks) — Bounty 1: Interoperable Asset Products
**Deadline:** August 14, 2026
**Live on:** Coston2 Testnet (Chain ID 114)

## What This Is

A complete production-grade mobile crypto wallet app built for Flare. The app features 18+ token wallets, live market data from Flare's decentralized oracle, send/receive flows, FAssets interoperable asset support, and portfolio tracking — all powered by Flare's native infrastructure.

The entire app — UI, components, screens, navigation, animations — was built from scratch. No third-party wallet code was used.

## What Was Built

### 1. FTSOv2 Price Feed Integration (services/LivePriceService.js)
- Decentralized on-chain price feeds from Flare Time Series Oracle
- Feeds: FLR/USD, BTC/USD, ETH/USD, XRP/USD, DOGE/USD, LTC/USD, SOL/USD, ADA/USD
- Updates every 30 seconds (FTSO updates every ~1.8s at block latency)
- Free to read — no API key, no rate limits, no centralized dependency

### 2. Flare Network Configuration (appConfig.js)
- Coston2 testnet RPC, Chain ID 114, explorer URL
- Mainnet config ready for production deployment

### 3. FAssets Token Support (constants/tokens.js)
- FLR (Flare native token)
- FXRP (Flare XRP — FAsset backed by XRP)
- FBTC (Flare Bitcoin — FAsset backed by BTC)
- FDOGE (Flare Doge — FAsset backed by DOGE)
- Each FAsset tagged with flareNative and fAsset flags with underlying asset reference

### 4. Flare Wallet Service (services/FlareWalletService.js)
- Native FLR/C2FLR balance queries via ethers.js
- ERC-20 FAsset balance queries
- Send native + ERC-20 transactions
- Wallet creation and management
- Gas price and nonce queries
- Connects to Coston2 testnet

### 5. Complete Mobile App
- 18+ token wallets with real market icons
- Markets page with live prices, 24h change, market cap, volume
- Wallet page with All/Crypto/Fiat filters, search
- Send/Receive with QR code
- Portfolio tracking with sparkline charts
- Bottom tab navigation (6 tabs)
- Auth flow, login screen
- Custom animated components (HeroShimmer, GlowPulse, SpringPress, CounterRoll)
- Flare orange/gold branding throughout

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
npm install
npm install ethers @flarenetwork/flare-periphery-contract-artifacts
npx expo start
```

## Roadmap

- FAssets minting UI — guide users through sending XRP → receiving FXRP
- Flare Mainnet deployment
- FDC integration — verify cross-chain transactions in-app
- Flare Confidential Compute — private transaction support
- DeFi integrations — yield farming with FAssets

## License

MIT
