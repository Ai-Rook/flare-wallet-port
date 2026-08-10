# Flare Wallet — DoraHacks Submission
## Flare Summer Signal Hackathon

---

## Project Name
Flare Wallet

## Selected Bounties
- **Bounty 1: Interoperable Asset Products** ($4,000 1st prize)
- **Bounty 2: Confidential Compute Apps** ($4,000 1st prize)

## Short Product Description

Flare Wallet is a mobile-first crypto wallet built entirely on Flare's native protocols. It uses FTSOv2 for live decentralized price feeds, FAssets for trust-minimized cross-chain asset wrappers, and Flare Confidential Compute (FCC) for verifiable private execution — all in a single app with a custom Sunkist orange soda design system.

The wallet fetches real-time prices from the FTSOv2 oracle contract on Coston2, queries on-chain balances for native FLR and FXRP (the only FAsset currently deployed on testnet), includes a live block scanner, and features a Confidential Compute tab demonstrating TEE-based secure enclave execution with remote attestations.

## Target User

Crypto users and traders who want a Flare-native wallet that leverages the network's unique enshrined protocols — FTSO for trustless price discovery, FAssets for wrapping non-smart-contract assets like XRP, and FCC for private/verifiable computation. The app is designed for mobile-first users who value real on-chain data over third-party APIs.

## Demo Link

**Live demo:** http://149.28.37.72:8085

**Demo video:** [To be added — script ready, recording tomorrow]

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

### On-Chain Integration (Bounty 1 — Technical Execution)
- Native FLR balance via `eth_getBalance`
- ERC-20 balance via `balanceOf()` on FXRP contract
- Block scanner: live block height, gas price, recent 5 blocks with tx counts + hashes
- Transaction history: queries ERC-20 Transfer event logs from Coston2 RPC
- Swap screen: conversion rates computed from live FTSOv2 oracle prices (not hardcoded)

### Flare Confidential Compute (Bounty 2 — FCC Integration)
- FCC tab demonstrates the full FCC workflow:
  - Secure Enclave toggle simulates activating a TEE session (Intel TDX on GCP Confidential Space)
  - Remote attestation generator produces a cryptographic proof hash
  - Private AI Agent prompt input — strategies execute inside the enclave
  - 4 FCC capabilities showcased: Protocol Managed Wallets, Verifiable AI Agents, Private Transaction Screening, Multi-Agent Consensus
  - "How FCC Works" explainer: TEE → attestation → on-chain proof → private inputs → consensus validation
- Built with reference to Flare AI Kit (github.com/flare-foundation/flare-ai-kit)

## What Was Built During the Hackathon

This project was forked from a base wallet template. The following were built entirely during the hackathon period (June 29 – August 10, 2026):

### Smart Contract Integration
- FTSOv2 oracle proxy (4 endpoints: prices, balances, block scanner, transaction history)
- FAsset contract resolution via FlareContractsRegistry
- FXRP ERC-20 balance queries on Coston2
- Transaction history via Transfer event log queries

### Frontend (All New)
- LivePriceService React Context — manages price state, balance hooks, block scanner, tx history
- FlareTokenIcon — custom orange pencil-outline token icons (zero clip art, zero third-party icon libraries)
- Sunkist orange soda design system — colors, fizz bubble animations, gradient headers
- All 8 tab screens: Home, Wallet, Agent (block scanner), FCC (Confidential Compute), Markets, Cards, Rewards, Profile
- All stack screens rebuilt: Send, Receive (QR code), BuySell, Swap (live FTSO rates), WalletDetail
- Portfolio math reconciliation — single source of truth in `constants/holdings.js`

### Backend
- Standalone Node.js proxy server (pm2 managed, port 3052)
- 4 API endpoints with CORS headers
- Raw ABI encoding for FTSOv2 `getFeedsById` with correct bytes21[] padding
- ERC-20 balance + Transfer event log queries

### What Existed Before (Base Template)
- App.js navigation structure (tab bar, stack navigation, auth flow)
- Login/Signup/KYC screens (kept as-is)
- Splash screen
- Basic component library (SpringPress, PulseFAB, ScreenHeader)
- Context architecture (AppContext)

## Smart Contract Addresses (Coston2)

| Contract | Address |
|----------|---------|
| FTSOv2 | `0x3d893C53D9e8056135C26C8c638B76C8b60Df726` |
| FlareContractsRegistry | `0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019` |
| FXRP Token (ERC-20) | `0x0b6A3645c240605887a5532109323A3E12273dc7` |

## Network

- **Deployed on:** Coston2 Testnet (Chain ID: 114)
- **RPC:** `https://coston2-api.flare.network/ext/C/rpc`
- **Explorer:** `https://coston2-explorer.flare.network`
- **Faucet:** `https://faucet.flare.network/coston2`

## Roadmap / Next Steps

1. **WalletConnect** — let users import their own wallet via WalletConnect protocol
2. **Real FAsset minting** — XRPL payment to Core Vault with 32-byte memo for FXRP minting
3. **FTSO delegation** — delegate FLR vote power to data providers from within the app
4. **Real TEE deployment** — deploy the FCC tab with actual GCP Confidential Space integration
5. **Mainnet deployment** — deploy on Flare Mainnet when FAssets go live
6. **Mobile native** — Expo → iOS/Android native builds
7. **Multi-agent consensus** — implement the A2A protocol for multi-agent trade voting

## Tech Stack

- **Frontend:** React Native + Expo (web export), ethers.js v6
- **Backend:** Node.js + Express (standalone proxy on VPS)
- **Blockchain:** Flare Coston2 testnet (EVM-compatible)
- **Design:** Custom Sunkist orange soda theme — no third-party UI kits

## Traction Signals

- Working live demo accessible 24/7 at http://149.28.37.72:8085
- Live FTSOv2 oracle integration verified (prices updating in real-time)
- On-chain balance queries confirmed working against Coston2 RPC
- Block scanner showing live block data (block 33.8M+ at time of submission)
- GitHub repo with full commit history showing hackathon development
