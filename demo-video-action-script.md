# Flare Wallet + Marketplace — Demo Video Action Script
## Flare Summer Signal Hackathon

**Target length:** 3-4 minutes
**Format:** Screen recording, Chrome mobile viewport (375x812), voiceover
**Prerequisites before hitting record:**

### PRE-RECORD SETUP
1. Open Chrome → DevTools → Toggle device toolbar → set to 375x812 (iPhone X)
2. Navigate to http://149.28.37.72:8085
3. Open a second browser tab with https://coston2-explorer.flare.network — keep it ready to show block explorer
4. Verify FTSO proxy is live: the app should show "🔥 Live FTSOv2 Oracle" badge on Wallet tab
5. Close all other tabs — clean browser window

---

## ACTION SCRIPT

### [0:00-0:05] SPLASH → LOGIN
**Action:** App loads, splash screen shows Flare Wallet logo, transitions to login page
**Say:** "Flare Wallet — a wallet and marketplace built on Flare's FTSOv2 oracle, FAssets, and Confidential Compute."

### [0:05-0:08] DEV LOGIN
**Action:** Click "Skip Login (Dev Mode)" at bottom of login screen
**Say:** "Using dev mode for the demo."

### [0:08-0:15] HOME SCREEN — BOTTOM NAV HOVER
**Action:** Home screen loads. Hover mouse over bottom nav tabs (Home, Wallet, Shop, +, Agent, FCC, Profile) without clicking — show all 6 tabs + center FAB
**Say:** "Six tabs plus a quick-action FAB. Everything themed with our Sunkist orange design system."

### [0:15-0:25] WALLET TAB — LIVE FTSOv2 ORACLE
**Action:** Click Wallet tab. Point to "🔥 Live FTSOv2 Oracle" badge at top. Scroll through assets — show prices updating. Point to the on-chain balance status line "✅ On-chain: X FLR · Y FXRP"
**Say:** "Every price here is live from the Flare FTSOv2 oracle on Coston2 — not a third-party API. The wallet queries real on-chain balances for native FLR and FXRP directly from the Coston2 RPC."

**Key shot:** The "🔥 Live FTSOv2 Oracle" badge and the on-chain balance line.

### [0:25-0:35] FLARE BITCOIN DETAIL
**Action:** Click "Flare Bitcoin" (FBTC) in the wallet list. Detail page loads — show price hero with live FTSO price, 24h change, holdings, USD value
**Say:** "Tap any asset for the detail page. Live FTSO price, your holdings, USD value — all computed from the oracle. Price source shows FTSOv2 Oracle."

**Key shot:** The "Price Source: 🔥 FTSOv2 Oracle" line in the About section.

### [0:35-0:45] SWAP WITH LIVE RATES
**Action:** Click "Swap" button. Swap screen loads. Enter "1" in the amount field. Show the live conversion rate updating (1 BTC = X ETH based on real FTSO prices)
**Say:** "The swap uses live FTSO oracle prices for conversion — not hardcoded rates. One BTC equals X ETH based on real-time oracle data."

**Key shot:** The rate line "1 BTC = X.XXXXXX ETH" and "🔥 FTSOv2 Oracle" source badge.

### [0:45-0:55] RECEIVE — QR CODE
**Action:** Go back, click Receive (or use FAB → Receive). Show QR code + wallet address
**Say:** "Receive screen generates a QR code for your Coston2 wallet address."

### [0:55-1:15] MARKETPLACE — SHOP TAB
**Action:** Click Shop tab. Show marketplace with 8 listings, real product images, prices in FLR + USD. Scroll through listings. Toggle categories (Electronics, Collectibles, etc.)
**Say:** "The marketplace lets you buy and sell goods using FLR and FAssets. Every listing shows price in FLR with live USD equivalent via FTSO. One percent fee on every sale — fifty percent burned, fifty percent to Flare philanthropy. eBay charges thirteen to thirty percent. We charge one."

**Key shot:** The "🔥 1% fee · 50% burned" badge on a listing card.

### [1:15-1:30] LISTING DETAIL — FEE BREAKDOWN
**Action:** Click any listing (e.g. MacBook Pro). Detail page loads. Scroll to fee breakdown card. Show the burn/philanthropy split with USD amounts
**Say:** "Each listing shows the full fee breakdown — one percent rake, half burned for deflationary economics, half to the Flare philanthropy fund. Versus eBay's thirteen to thirty percent."

**Key shot:** Fee breakdown card with "🔥 Burned" and "❤️ Flare Philanthropy" lines + "vs eBay 13-30%" comparison.

### [1:30-1:45] CREATE LISTING
**Action:** Go back, click "+ Sell". Show create listing form. Select "Auction", pick 5-day duration, toggle reserve price. Type a price in FLR — show live USD preview
**Say:** "Sellers can create fixed-price listings, auctions with three/five/seven day durations, or hybrid listings. Reserve price is optional at zero-point-five percent extra. All pricing in FLR with live FTSO conversion."

**Key shot:** Auction duration picker (3/5/7 days) + reserve price toggle + live USD preview.

### [1:45-2:05] AGENT TAB — BLOCK SCANNER
**Action:** Click Agent tab. Show AI insights, then scroll to block scanner. Point to live block height, gas price, recent blocks list
**Say:** "The Agent tab includes a live Coston2 block scanner — block height, gas price, and the five most recent blocks with transaction counts. Auto-refreshes every fifteen seconds directly from the Flare RPC."

**Key shot:** Block height number (33M+) and recent blocks list with tx counts.

### [2:05-2:40] FCC TAB — CONFIDENTIAL COMPUTE (Bounty 2)
**Action:** Click FCC tab. Toggle "Secure Enclave" ON. Show TEE session activating (INITIALIZED → PRODUCTION). Click "Register TEE + Generate Attestation" — show attestation hash appearing
**Say:** "The Confidential Compute tab demonstrates Flare's FCC protocol. Toggle the secure enclave to activate a simulated TEE session with the FlareTeeManager contract. Generate a remote attestation — cryptographic proof that your code ran unmodified inside the enclave."

**Key shot:** TEE toggle ON, status changing to PRODUCTION, attestation hash appearing.

### [2:40-3:00] FCC — DISPUTE RESOLUTION
**Action:** Click "⚖️ Disputes" sub-tab. Show the mock dispute cases. Click "⚡ Resolve in Enclave" on the pending case. Show verdict + attestation + confidence score appearing
**Say:** "Marketplace disputes enter TEE arbitration. An AI reviews evidence privately inside the enclave — only the verdict and attestation are published on-chain. Neither party's data is exposed."

**Key shot:** Verdict appearing with confidence score + attestation hash.

### [3:00-3:20] FCC — SEALED-BID AUCTIONS
**Action:** Click "密封 Sealed Bids" sub-tab. Show the sealed-bid auction with 7 encrypted bids (all showing 🔒). Click "🔓 Reveal Winner". Show winner + winning bid + attestation appearing
**Say:** "Sealed-bid auctions collect all bids inside the TEE enclave. Nobody sees competing bids until the reveal. The enclave computes the winner and publishes only the result. Prevents bid sniping, collusion, and price manipulation — impossible on eBay."

**Key shot:** 7 encrypted bid rows → click reveal → winner revealed with attestation.

### [3:20-3:30] Coston2 Explorer Proof (optional but powerful)
**Action:** Switch to the second browser tab with coston2-explorer.flare.network. Show the latest block number matching what the block scanner showed
**Say:** "You can verify everything on the Coston2 block explorer — the block numbers, the FTSOv2 contract, the FXRP token contract. It's all real on-chain data."

### [3:30-3:45] CLOSING
**Action:** Switch back to the app. Slow scroll through all tabs one final time
**Say:** "Flare Wallet — a wallet, marketplace, and confidential compute platform built entirely on Flare's native protocols. FTSOv2 for live prices, FAssets for cross-chain assets, FCC for private computation. One percent marketplace fee, half burned, half to philanthropy. Built on Flare, for Flare."

---

## WINDOWS TO HAVE OPEN DURING RECORDING
1. **Chrome (mobile viewport 375x812)** — the app at http://149.28.37.72:8085
2. **Chrome tab 2** — https://coston2-explorer.flare.network (for the explorer proof shot at 3:20)
3. **Nothing else** — clean desktop, no notifications

## VERIFY BEFORE RECORDING
- [ ] FTSO proxy live: curl http://149.28.37.72:3052/api/ftso-prices → returns 8 prices
- [ ] Block scanner live: curl http://149.28.37.72:3052/api/blockscanner → returns block number
- [ ] App loads: http://149.28.37.72:8085 → splash → login → Skip Login → Home
- [ ] Wallet tab shows "🔥 Live FTSOv2 Oracle" badge (not "Demo Prices")
- [ ] Marketplace has 8 listings with product images loading
- [ ] FCC tab toggle works → attestation generates
