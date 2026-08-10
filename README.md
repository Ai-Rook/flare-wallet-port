# 🔥 Flare Wallet + Marketplace — Built on Flare FTSOv2

A mobile-first crypto wallet and marketplace built on Flare's native protocols. Live FTSOv2 oracle prices, FAsset support, on-chain balances, a block scanner, a P2P marketplace with 1% burn/philanthropy fees, and Flare Confidential Compute (FCC) for dispute resolution and sealed-bid auctions.

**Built for the Flare Summer Signal Hackathon** · Bounty 1: Interoperable Asset Products + Bounty 2: Confidential Compute Apps

## 🌐 Demo

**Live demo:** http://149.28.37.72:8085

**Network:** Flare Coston2 Testnet (Chain ID: 114)

## ✨ Features

### Wallet (Bounty 1 — Interoperable Asset Products)
- **Live FTSOv2 Oracle** — real-time price feeds for 8 assets (FLR, BTC, ETH, XRP, DOGE, LTC, SOL, ADA) via `getFeedsById()` on the FTSOv2 contract
- **FAsset Support** — FXRP token integration via FlareContractsRegistry runtime resolver
- **On-Chain Balances** — native FLR + ERC-20 balance queries from Coston2 RPC
- **Block Scanner** — live block height, gas price, recent 5 blocks with tx counts
- **Swap** — live conversion rates computed from FTSOv2 oracle prices
- **QR Code Receive** — wallet address QR with finder patterns

### Marketplace (Bounty 1 — Product Usefulness)
- **Browse + Search** — 8 demo listings across 6 categories with real product images
- **3 Listing Types** — Fixed Price, Auction (3/5/7 day), Hybrid (Buy It Now + Auction)
- **Reserve Price** — optional, costs 0.5% extra listing fee
- **1% Fee Rake** — 50% burned (deflationary), 50% to Flare philanthropy fund
- **Live FTSO Pricing** — every listing shows price in FLR + live USD equivalent
- **Create Listing Flow** — full seller form with type, duration, reserve, live USD preview
- **eBay Comparison** — "eBay 13-30% · we charge 1% · save 29%+"

### Confidential Compute (Bounty 2 — FCC Integration)
- **FlareTeeManager** — references live contract `0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE`
- **SIMULATED_TEE** — accepted for Coston2 judging per sponsor confirmation
- **TEE Dispute Resolution** — marketplace disputes arbitrated inside enclave, only verdict + attestation published
- **Sealed-Bid Auctions** — bids collected in TEE, winner computed privately, prevents sniping/collusion
- **Private AI Agent** — trading strategy execution inside enclave with RA-TLS attestation
- **4 FCC Capabilities** — Protocol Managed Wallets, Verifiable AI Agents, Private Screening, Multi-Agent Consensus

### Design
- **Sunkist Orange Soda Theme** — custom orange pencil-outline token icons (zero clip art)
- **FizzBubbles** — animated rising carbonation bubbles in headers
- **PulseFAB** — glossy soda button with carbonation press effect
- **Consistent** — all 8 tab screens + 14 stack screens use the same palette

## 🔧 Technical Architecture

### Smart Contracts (Coston2)
| Contract | Address |
|----------|---------|
| FTSOv2 | `0x3d893C53D9e8056135C26C8c638B76C8b60Df726` |
| FlareContractsRegistry | `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` |
| FXRP Token (ERC-20) | `0x0b6A3645c240605887a5532109323A3E12273dc7` |
| FlareTeeManager (FCC) | `0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE` |

### Backend Proxy (VPS — port 3052, pm2 managed)
- `/api/ftso-prices` — FTSOv2 price feed relay (8 assets)
- `/api/balance/:address` — native + ERC-20 balance queries
- `/api/blockscanner` — live block data (height, gas, recent blocks)
- `/api/txs/:address` — transaction history via Transfer event logs

### Frontend
- React Native + Expo (web export)
- ethers.js v6 for blockchain interaction
- LivePriceService React Context — prices, balances, block scanner, tx history hooks
- Single source of truth: `constants/holdings.js` for wallet data reconciliation
- `constants/marketplace.js` — listing types, fee structure, mock data

## 📋 How It Uses Flare

1. **FTSOv2 Oracle** — Core price feed. `getFeedsById(bytes21[])` called on the FTSOv2 contract. 8 live feeds, 30-second refresh, CORS-safe VPS proxy.
2. **FAssets** — Runtime contract resolution via FlareContractsRegistry → AssetManager → `fAsset()` → ERC-20 `balanceOf()`. FXRP live on Coston2.
3. **Coston2 Testnet** — All on-chain reads (balances, block scanner, tx history) hit Coston2 RPC directly.
4. **Flare Confidential Compute** — FlareTeeManager integration, SIMULATED_TEE mode, dispute resolution + sealed-bid auctions as marketplace features.
5. **Marketplace Economics** — 1% rake per sale, 50% burned to deflationary address, 50% to Flare philanthropy fund. All pricing in FLR with live FTSO USD conversion.

## 🆕 What Was Built During the Hackathon

### Smart Contract Integration
- FTSOv2 oracle proxy (4 endpoints)
- FAsset contract resolution via FlareContractsRegistry
- FXRP ERC-20 balance queries
- Block scanner + transaction history via RPC

### Wallet (All New)
- LivePriceService React Context
- FlareTokenIcon — custom orange pencil-outline icons
- Sunkist design system (colors, fizz bubbles, gradient headers)
- All wallet screens: Home, Wallet, WalletDetail, Send, Receive, BuySell, Swap
- Block scanner on Agent tab
- On-chain balance display with live FTSO prices

### Marketplace (All New)
- MarketplaceScreen — browse, search, category filters
- ListingDetailScreen — bid history, fee breakdown, payment options
- CreateListingScreen — full seller flow with auction types + reserve
- Fee mechanism — 1% rake, 50/50 burn/philanthropy split

### FCC Tab (All New)
- Secure Enclave toggle with INITIALIZED → PRODUCTION status
- RA-TLS attestation generator
- TEE Dispute Resolution — arbitration cases with AI verdict + attestation
- Sealed-Bid Auctions — encrypted bids, reveal winner, comparison table
- Private AI Agent prompt

## 🗺️ Roadmap

1. **Escrow smart contract** — deploy on Coston2 for real Buy Now transactions
2. **WalletConnect** — import user wallets
3. **FTSO delegation** — delegate FLR vote power from the app
4. **Real TEE deployment** — GCP Confidential Space integration
5. **Mainnet deployment** — when FAssets go live
6. **Mobile native** — iOS/Android builds
7. **Multi-agent consensus** — A2A protocol for trade voting

## 📦 GitHub

**Repo:** https://github.com/Ai-Rook/flare-wallet-port

## 🏆 Hackathon

- **Event:** Flare Summer Signal (DoraHacks)
- **Bounties:** Interoperable Asset Products + Confidential Compute Apps
- **Deadline:** August 14, 2026
- **Network:** Coston2 Testnet

---

🔥 Built on Flare · FTSOv2 Oracle · FAssets · Confidential Compute · Marketplace
