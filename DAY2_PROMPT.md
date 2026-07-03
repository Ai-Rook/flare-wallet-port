# Rain App — Day 2 Continuation Prompt

## Project Path
`/root/.openclaw/workspace/projects/rain/rain-app/`

## Queen Dev Server
- SSH: `ssh -i /root/.openclaw/workspace/id_rook_container root@149.28.37.72` → then `ssh queen@100.120.56.104`
- Queen node: `export PATH=$HOME/.brew/bin:$PATH` before any node/npx commands
- Expo: `cd ~/rain-app && npx expo start --web --port 8081 --clear --tunnel`
- Tunnel URL changes on every restart — check ngrok API: `curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'])"`

## Day 1 Done ✅
- Spend → CoinPayments rebrand (all files, card images, SPND → Tokens)
- 18 real CoinMarketCap token icons downloaded (128x128 PNG)
- SpringPress component (spring physics on buttons/tabs/rows)
- FrostedHeader (blur bar that appears on scroll)
- HeroMorph component wired — detail screen token icon springs in from 30% scale with overshoot
- Spring-based screen transitions (push/pop use springs instead of linear timing)
- Bundle compiles clean (419+ modules)

## Day 2 Priorities
1. **Hero morph polish** — make the icon in the list fade out briefly while the detail icon springs in (cross-screen shared element feel)
2. **Container transform** — cards → CardDetail should morph the card border/shape into the full screen
3. **Parallax scroll** — home screen balance card scrolls at 0.8x speed
4. **Replace emoji tab icons** with `@expo/vector-icons` (Ionicons) for proper SF Symbols style
5. **Dark mode** — semantic colors + system preference detection
6. **Pull-to-refresh** — Home and Markets screens
7. **Bottom sheets** — `@gorhom/bottom-sheet` for Send/Receive confirmations
8. **Wire real card images** from original Spend design (`/root/.openclaw/workspace/projects/rain/screens/`) into CardsScreen
9. **Button press scale animation** — SpringPress is in, but verify it works on native (expo-go)
10. **Get Expo Go working** on BDubs' actual iPhone (not just Safari)

## Key Architecture Notes
- Custom navigation (not React Navigation) — useState + Animated in App.js
- 6 tabs: Home/Cards/Wallet/Markets/Agentic/Profile
- SpringPress wraps children in Animated.View — width/flex styles must go on SpringPress `style` prop
- HeroIcon: `isDetail=true` triggers spring scale from 0.3→1.0 on mount
- iconMap exported from `components/TokenIcon.js` for use in HeroIcon
- `react-native-reanimated`, `expo-blur`, `react-native-worklets` installed
- Reanimated babel plugin in babel.config.js: `plugins: ['react-native-reanimated/plugin']`

## Known Issues
- Ngrok tunnel URL changes on every Expo restart — must get new URL from ngrok API
- SpringPress wrapping broke layout on first attempt — fixed by passing width/flex to SpringPress style prop
- `useRef` was missing from HomeScreen React import — fixed
- Original Spend design files at `/root/.openclaw/workspace/projects/rain/screens/` — hundreds of mockups, card images, tab bar icons available for reference

## Ngrok Tunnel Instability (known issue)
- Expo `--tunnel` uses ngrok free tier — tunnels die after inactivity
- URL changes every restart — must get new URL from ngrok API
- Day 2 fix: switch to `--localhost` + port forward via Tailscale, or use a paid ngrok reserved domain
- Get tunnel URL: `curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'])"`

## Navigation Params Fix (done Day 1)
- navigate() now accepts (screen, params) — params stored as {screen, params} in stack array
- route.params properly passed to rendered screen components
- WalletDetail now shows correct token (not always BTC)
- Markets/Home/Wallet taps all pass symbol through

## Dead End Screens (Day 2 TODO)
- Several stack screens are stubs with no real content: BuySell, Exchange, Lend, Send, Receive, BankLink, Referral, KYC, Forgot
- Each should at minimum have a back button and placeholder content
- Eventually all need real flows
