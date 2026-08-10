# Flare Sunkist — DoraHacks Submission
## Flare Summer Signal Hackathon

---

## Project Name
Flare Sunkist — Wallet, Marketplace & Confidential Compute

## Selected Bounties
- **Bounty 1: Interoperable Asset Products** ($4,000 1st prize)
- **Bounty 2: Confidential Compute Apps** ($4,000 1st prize)

## Short Product Description

Flare Sunkist is a mobile-first Flare ecosystem app combining a wallet, marketplace, and confidential compute platform — all built on Flare's native protocols. Live prices from FTSOv2 oracle, cross-chain assets via FAssets, a marketplace with 1% fee (50% burned, 50% philanthropy), and Flare Confidential Compute (FCC) for TEE-based dispute resolution and sealed-bid auctions.

The wallet fetches real-time prices from the FTSOv2 oracle contract on Coston2, queries on-chain balances for native FLR and FXRP, includes a live block scanner, and features a full marketplace where users can buy/sell goods with FLR and FAssets. The FCC tab demonstrates TEE-based secure enclave execution with remote attestations, AI-arbitrated marketplace disputes, and sealed-bid auctions that prevent sniping and collusion.

## Target User

Crypto users, traders, and marketplace participants who want a Flare-native app that leverages the network's unique enshrined protocols — FTSO for trustless price discovery, FAssets for wrapping non-smart-contract assets like XRP, and FCC for private/verifiable computation. The marketplace targets anyone selling goods with crypto who's tired of eBay's 13%+ fees. The app is designed for mobile-first users who value real on-chain data over third-party APIs.

## Demo Link

**Live demo:** http://149.28.37.72:8085

**Demo video:** https://youtu.be/P37SZs68Ebc

## GitHub Repo

https://github.com/Ai-Rook/flare-wallet-port

## How the Project Uses Flare

### FTSOv2 Oracle (Bounty 1 — Core Integration)
- Calls `getFeedsById(bytes21[])` on the FTSOv2 contract (`0x3d893C53D9e8056135C26C8c638B76C8b60Df726`) to fetch live USD prices for 8 assets: FLR, BTC, ETH, XRP, DOGE, LTC, SOL, ADA
- A CORS-safe proxy on the VPS relays the RPC call to Coston2 and returns prices to the browser
- App refreshes prices every 30 seconds; every screen that shows prices uses the live oracle data
- Source badge shows "🔥 Live FTSOv2 Oracle" when connected, "📊 Demo Prices" when fallback

### FAssets (Bounty 1 — Interoperable Assets)
- Resolves FAsset contract addresses at runtime via FlareContractsRegistry (`0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019`)
- Registry → AssetManager → `fAsset()` → ERC-20 token address
- FXRP token on Coston2: `0x0b6A3645c240605887a5532109323A3E12273dc7`
- Queries ERC-20 `balanceOf()` for real on-chain wallet balances
- `sendFAsset()` helper wired for FAsset transfers
- Handles FBTC/FDOGE gracefully (not yet deployed on Coston2)

### Marketplace (Bounty 1 — Interoperable Asset Products)
- Full buy/sell marketplace using FLR and FAssets as payment
- 8 mock listings with real product images across categories (Electronics, Collectibles, Art, Fashion, Home)
- Listing types: Fixed Price, Auction (3/5/7 day), Hybrid (Buy Now + Auction)
- Reserve price support with 0.5% fee
- **1% marketplace fee** on every sale — 50% burned (deflationary token economics), 50% to Flare philanthropy fund
- eBay charges 13%+ before upsells — Flare Sunkist charges 1%
- Live FTSOv2 oracle prices for FLR→USD conversion on every listing
- Fee breakdown visible on every listing detail page (burn vs philanthropy vs eBay comparison)
- Create listing flow with live USD preview via FTSO oracle

### On-Chain Integration (Bounty 1 — Technical Execution)
- Native FLR balance via `eth_getBalance`
- ERC-20 balance via `balanceOf()` on FXRP contract
- Block scanner: live block height, gas price, recent 5 blocks with tx counts + hashes
- Transaction history: queries ERC-20 Transfer event logs from Coston2 RPC
- Swap screen: conversion rates computed from live FTSOv2 oracle prices (not hardcoded)
- Receive screen: QR code generation for Coston2 wallet address

### Flare Confidential Compute (Bounty 2 — FCC Integration)
- FCC tab demonstrates the full FCC workflow with FlareTeeManager contract (`0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE`):
  - Secure Enclave toggle simulates activating a TEE session (SIMULATED_TEE mode accepted for judging)
  - Remote attestation generator produces a cryptographic proof hash (RA-TLS)
  - Private AI Agent prompt input — strategies execute inside the enclave
  - 4 FCC capabilities showcased: Protocol Managed Wallets, Verifiable AI Agents, Private Transaction Screening, Multi-Agent Consensus
  - "How FCC Works" explainer: TEE → attestation → on-chain proof → private inputs → consensus validation
- **TEE Dispute Resolution:**
  - Marketplace disputes enter TEE arbitration
  - AI reviews evidence privately inside the enclave — shipping logs, photos, messages
  - Only the verdict and attestation are published on-chain — neither party's data is exposed
  - Mock dispute cases with "⚡ Resolve in Enclave" → verdict + confidence score + attestation hash
- **Sealed-Bid Auctions:**
  - All bids collected inside the TEE enclave — nobody sees competing bids until reveal
  - Enclave computes the winner and publishes only the result
  - Prevents bid sniping, collusion, and price manipulation — impossible on eBay
  - 7 encrypted bid rows with "🔓 Reveal Winner" → winner + winning bid + attestation
  - Comparison table: Flare Sunkist (1% fee, sealed bids, TEE arbitration) vs eBay (13%+ fees, public bids, no arbitration)
- Built with reference to Flare AI Kit (github.com/flare-foundation/flare-ai-kit)

## What Was Built During the Hackathon

This project was built from scratch during the hackathon period. The following were built entirely during the hackathon:

### Smart Contract Integration
- FTSOv2 oracle proxy (4 endpoints: prices, balances, block scanner, transaction history)
- FAsset contract resolution via FlareContractsRegistry
- FXRP ERC-20 balance queries on Coston2
- Transaction history via Transfer event log queries

### Frontend (All New)
- LivePriceService React Context — manages price state, balance hooks, block scanner, tx history
- FlareTokenIcon — custom orange pencil-outline token icons (zero clip art, zero third-party icon libraries)
- Sunkist orange soda design system — colors, fizz bubble animations, gradient headers, glossy FAB
- All 8 tab screens: Home, Wallet, Shop (Marketplace), Agent (block scanner), FCC (Confidential Compute), Markets, Cards, Rewards, Profile
- All stack screens: Send, Receive (QR code), BuySell, Swap (live FTSO rates), WalletDetail, ListingDetail, CreateListing
- Marketplace: browse/search/categories, listing detail with fee breakdown + bid history, create listing with fixed/auction/hybrid types
- FCC: TEE toggle, attestation generator, dispute resolution with AI verdicts, sealed-bid auctions with reveal mechanism
- Portfolio math reconciliation — single source of truth in `constants/holdings.js`

### Backend
- Standalone Node.js proxy server (pm2 managed, port 3052)
- 4 API endpoints with CORS headers
- Raw ABI encoding for FTSOv2 `getFeedsById` with correct bytes21[] padding
- ERC-20 balance + Transfer event log queries

## Smart Contract Addresses (Coston2)

| Contract | Address |
|----------|---------|
| FTSOv2 | `0x3d893C53D9e8056135C26C8c638B76C8b60Df726` |
| FlareContractsRegistry | `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` |
| FXRP Token (ERC-20) | `0x0b6A3645c240605887a5532109323A3E12273dc7` |
| FlareTeeManager | `0x1a9C4A0f9D76c0b1D91d22E24E573a9b377618aE` |

## Network

- **Deployed on:** Coston2 Testnet (Chain ID: 114)
- **RPC:** `https://coston2-api.flare.network/ext/C/rpc`
- **Explorer:** `https://coston2-explorer.flare.network`
- **Faucet:** `https://faucet.flare.network/coston2`

## Roadmap / Next Steps

1. **Escrow smart contract** — deploy on-chain escrow for real Buy Now transactions with automatic fee splitting (burn + philanthropy)
2. **WalletConnect** — let users import their own wallet via WalletConnect protocol
3. **Real FAsset minting** — XRPL payment to Core Vault with 32-byte memo for FXRP minting
4. **FTSO delegation** — delegate FLR vote power to data providers from within the app
5. **Real TEE deployment** — deploy the FCC tab with actual GCP Confidential Space integration
6. **Mainnet deployment** — deploy on Flare Mainnet when FAssets go live
7. **Mobile native** — Expo → iOS/Android native builds
8. **Multi-agent consensus** — implement the A2A protocol for multi-agent trade voting

## Tech Stack

- **Frontend:** React Native + Expo (web export), ethers.js v6
- **Backend:** Node.js + Express (standalone proxy on VPS)
- **Blockchain:** Flare Coston2 testnet (EVM-compatible)
- **Design:** Custom Sunkist orange soda theme — no third-party UI kits

## Traction Signals

- Working live demo accessible 24/7 at http://149.28.37.72:8085
- Demo video on YouTube: https://youtu.be/P37SZs68Ebc
- Live FTSOv2 oracle integration verified (prices updating in real-time)
- On-chain balance queries confirmed working against Coston2 RPC
- Block scanner showing live block data (block 33.8M+ at time of submission)
- GitHub repo with full commit history showing hackathon development
