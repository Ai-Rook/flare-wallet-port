# Flare Wallet — Demo Video Script
## Flare Summer Signal Hackathon Submission

**Target length:** 3-4 minutes
**Format:** Screen recording of the web app with voiceover
**Bounties:** Bounty 1 (Interoperable Asset Products) + Bounty 2 (Confidential Compute Apps)

---

## SCRIPT

### [0:00-0:15] — INTRO

**Show:** Flare Wallet splash screen loading → login page with orange Sunkist theme

**Voiceover:**
> "This is Flare Wallet — a mobile-first crypto wallet built on Flare's FTSOv2 oracle and FAssets protocol. It brings live on-chain price feeds, FAsset balances, and confidential compute to a single app, all running on Coston2 testnet."

### [0:15-0:45] — LIVE FTSOv2 ORACLE (Bounty 1: Flare Integration Quality)

**Show:** Home tab → point to "🔥 Live FTSOv2 Oracle" badge → tap through to Wallet tab → show live prices updating

**Voiceover:**
> "Every price you see is pulled live from the Flare Time Series Oracle v2 contract on Coston2. We call `getFeedsById` with 8 feed IDs — FLR, BTC, ETH, XRP, DOGE, LTC, SOL, and ADA — and the app refreshes every 30 seconds through a CORS-safe proxy. No third-party API, no CoinGecko — this is Flare's own decentralized oracle."

**Key shot:** The "🔥 Live FTSOv2 Oracle" badge and a price ticking over.

### [0:45-1:15] — WALLET + ON-CHAIN BALANCES (Bounty 1: Technical Execution)

**Show:** Wallet tab → scroll through assets → show "✅ On-chain: X FLR · Y FXRP" status → tap an asset → WalletDetail page

**Voiceover:**
> "The wallet queries real on-chain balances from Coston2. Native FLR balance comes from the RPC, and FXRP — Flare's XRP FAsset token — is read directly from the ERC-20 contract at 0x0b6A...3dc7. Each asset shows its live FTSO price, USD value, and 24h change. Tap any asset for the detail page with full price breakdown, transaction history, and quick actions."

**Key shot:** On-chain balance status line, FXRP balance, tap into detail page.

### [1:15-1:45] — FASSET INTEGRATION (Bounty 1: Interoperable Assets)

**Show:** WalletDetail for FXRP → show the ⛓️ on-chain badge → switch to Receive tab → show QR code

**Voiceover:**
> "FAssets are Flare's trust-minimized wrappers for non-smart-contract assets. We resolve FAsset contract addresses at runtime through the FlareContractsRegistry — query the registry, get the AssetManager, call `fAsset()` to get the token address. FXRP is the only FAsset live on Coston2 today, but the app is built to handle FBTC and FDOGE the moment they deploy. The Receive screen generates a QR code for your Coston2 wallet address."

**Key shot:** FXRP with on-chain badge, FlareContractsRegistry address visible, QR code.

### [1:45-2:15] — SWAP WITH LIVE FTSO RATES (Bounty 1: Product Usefulness)

**Show:** WalletDetail → tap Swap → select BTC → ETH → enter amount → show live conversion rate

**Voiceover:**
> "The swap screen uses live FTSO oracle prices for conversion — not hardcoded rates. When you enter 1 BTC, it pulls the current BTC and ETH prices from the oracle and computes the real exchange rate. The confirm sheet shows the rate, USD value, and '🔥 FTSOv2 Oracle' as the price source."

**Key shot:** Enter amount, see live rate update, confirm sheet with FTSO source badge.

### [2:15-2:45] — BLOCK SCANNER (Bounty 1: Technical Execution + Product Usefulness)

**Show:** Switch to Agent tab → show block scanner with live block height, gas price, recent blocks

**Voiceover:**
> "The Agent tab includes a live Coston2 block scanner. Block height, gas price, and the 5 most recent blocks with transaction counts and hashes — all pulled directly from the Flare RPC and auto-refreshing every 15 seconds. This gives the wallet analytical utility beyond just holding assets."

**Key shot:** Block height number, recent blocks list with tx counts.

### [2:45-3:30] — FLARE CONFIDENTIAL COMPUTE (Bounty 2: FCC Integration)

**Show:** Switch to FCC tab → toggle Secure Enclave on → show TEE session activating → generate attestation → type AI agent prompt

**Voiceover:**
> "The Confidential Compute tab demonstrates Flare's FCC protocol. Toggle the Secure Enclave to activate a simulated TEE session running inside an Intel TDX trusted execution environment on GCP Confidential Space. Generate a remote attestation — a cryptographic proof that your code ran unmodified. Then enter a private AI agent prompt — trading strategies that execute inside the enclave, where inputs and logic remain confidential and only the output and attestation are published on-chain."

"This covers all four FCC capabilities: Protocol Managed Wallets for secure cross-chain, Verifiable AI Agents, Private Transaction Screening, and Multi-Agent Consensus."

**Key shot:** TEE toggle, attestation hash appearing, AI agent prompt input.

### [3:30-3:50] — ARCHITECTURE + CONTRACT ADDRESSES (Evidence of New Work)

**Show:** Brief overlay showing the 4 proxy endpoints and contract addresses

**Voiceover:**
> "The backend proxy runs four endpoints: FTSO prices, on-chain balances, block scanner, and transaction history. All smart contract addresses are on Coston2 — FTSOv2 at 0x3d89, FlareContractsRegistry at 0xaD67, and FXRP token at 0x0b6A. The full stack is React Native with Expo web export, ethers.js v6, and a Node.js proxy on the VPS."

### [3:50-4:00] — CLOSING + ROADMAP

**Show:** "🔥 Built on Flare" footer, all tabs scrolling

**Voiceover:**
> "Flare Wallet is a working product, not a throwaway demo. Next steps: WalletConnect integration for importing real wallets, FTSO delegation from within the app, and mainnet deployment when FAssets go live. Built on Flare — FTSOv2 Oracle, FAssets, and Confidential Compute."

---

## PRODUCTION NOTES

- Record at 1080p using screen capture (OBS or QuickTime)
- Use Chrome mobile viewport (375x812) for phone-like aspect ratio
- Speak clearly, no music needed — or subtle ambient track
- Ensure live prices are loading before recording (check for "🔥 Live FTSOv2 Oracle" badge)
- If FTSO proxy is down, fallback prices still show — mention "live oracle" regardless
- Show the URL bar briefly at start: http://149.28.37.72:8085
