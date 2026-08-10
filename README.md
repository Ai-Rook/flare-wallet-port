# 🔥 Flare Wallet — Built on Flare FTSOv2

A mobile-first crypto wallet for the Flare ecosystem. Live FTSOv2 oracle prices, FAsset support, on-chain balances, and a block scanner — all on Coston2 testnet.

**Built for the Flare Summer Signal Hackathon** · Bounty 1: Interoperable Asset Products

## 🌐 Demo

**Live demo:** http://149.28.37.72:8085

**Network:** Flare Coston2 Testnet (Chain ID: 114)

## ✨ Features

### Live FTSOv2 Oracle Integration
- Real-time price feeds for 8 assets: FLR, BTC, ETH, XRP, DOGE, LTC, SOL, ADA
- Prices fetched directly from the FTSOv2 contract on Coston2 via a CORS-safe proxy
- Updates every 30 seconds in the app
- Source badge shows "🔥 Live FTSOv2 Oracle" when connected

### FAsset Support
- FXRP (Flare XRP) token integration via FlareContractsRegistry
- Runtime FAsset resolver — queries registry → AssetManager → fAsset() for any new assets
- Send FAsset functionality wired (sendFAsset helper in FlareWalletService)
- FBTC/FDOGE not yet deployed on Coston2 — app handles this gracefully

### On-Chain Wallet
- Real balance queries from Coston2 RPC (native FLR + ERC-20 tokens)
- Block scanner with live block height, gas price, and recent blocks
- Transaction history via RPC log queries (ERC-20 Transfer events)
- Demo wallet address for hackathon testing

### Sunkist Orange Soda Design System
- Custom orange pencil-outline token icons (zero clip art)
- Warm cream backgrounds, orange gradients, fizz bubble animations
- Consistent across all 7 tab screens + 12 stack screens

## 🔧 Technical Architecture

### Smart Contracts (Coston2)
| Contract | Address |
|----------|---------|
| FTSOv2 | `0x3d893C53D9e8056135C26C8c638B76C8b60Df726` |
| FlareContractsRegistry | `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` |
| FXRP Token | `0x0b6A3645c240605887a5532109323A3E12273dc7` |

### Backend Proxy (VPS)
- **Port 3052** — standalone Express server (pm2 managed)
- `/api/ftso-prices` — FTSOv2 price feed relay
- `/api/balance/:address` — on-chain balance queries (native + ERC-20)
- `/api/blockscanner` — live block data (height, gas, recent blocks)
- `/api/txs/:address` — transaction history via Transfer event logs

### Frontend
- React Native + Expo (web export)
- ethers.js v6 for blockchain interaction
- LivePriceService React Context — manages price state, balance hooks, block scanner
- Single source of truth: `constants/holdings.js` for wallet data reconciliation

## 📋 How It Uses Flare

1. **FTSOv2 Oracle** — The core price feed. We call `getFeedsById(bytes21[])` on the FTSOv2 contract to get live USD prices for 8 assets. This is not a fallback or demo — the proxy queries the actual Coston2 oracle every 30 seconds.

2. **FAssets** — We resolve FAsset contract addresses via the FlareContractsRegistry, then query ERC-20 balances directly. FXRP is the only FAsset currently on Coston2; the app is built to handle FBTC/FDOGE when they deploy.

3. **Coston2 Testnet** — All on-chain reads (balances, block scanner, transaction history) hit the Coston2 RPC directly. The block scanner shows real block heights and gas prices from the network.

## 🆕 What Was Built During the Hackathon

This project was forked from a base wallet template. The following were built entirely during the hackathon:

- **FTSOv2 integration** — proxy server, feed ID encoding, live price context
- **FAsset resolver** — runtime contract address resolution via FlareContractsRegistry
- **Block scanner** — live block data endpoint + UI with auto-refresh
- **On-chain balance queries** — native + ERC-20 balance endpoint
- **Transaction history** — Transfer event log queries
- **Sunkist orange soda design system** — colors, icons, animations, all custom
- **All 7 tab screens** — Wallet, Agentic AI, Markets, Cards, Rewards, Profile, Home
- **Stack screens** — Send, Receive, BuySell, WalletDetail (all rebuilt with Sunkist theme)

## 🗺️ Roadmap

1. **Wallet connect** — let users import their own wallet via private key / seed phrase / WalletConnect
2. **Real FAsset minting** — XRPL payment to Core Vault with 32-byte memo for FXRP minting
3. **FTSO delegation** — delegate FLR vote power to data providers from within the app
4. **Mainnet deployment** — deploy on Flare Mainnet when FAssets go live
5. **Mobile native** — Expo → iOS/Android native builds
6. **Confidential Compute** — explore Flare's FCC for private transactions

## 📦 GitHub

**Repo:** https://github.com/Ai-Rook/flare-wallet-port

## 🏆 Hackathon

- **Event:** Flare Summer Signal
- **Bounty:** Interoperable Asset Products ($4,000 1st prize)
- **Deadline:** August 14, 2026
- **Platform:** DoraHacks

---

🔥 Built on Flare · FTSOv2 Oracle · FAssets · Coston2 Testnet
