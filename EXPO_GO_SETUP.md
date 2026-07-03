# Expo Go Setup — Rain App

## Install Expo Go on iPhone

1. Open the **App Store** on your iPhone
2. Search for **"Expo Go"** by Expo Project
3. Install it (free, ~100MB)

## Connect to the Dev Server

The Expo dev server is running on **Queen** (M3 Ultra Mac Studio).

### Option A: Same WiFi Network (fastest)

1. Make sure your iPhone is on the same WiFi as Queen
2. Open Expo Go
3. It should auto-discover the server — tap **"rain-app"** when it appears

### Option B: Manual URL Entry

1. Open Expo Go
2. Tap the **scan icon** (top right) but don't scan — instead:
3. Tap **"Enter URL manually"**
4. Enter: `exp://hull7rw-anonymous-8081.exp.direct`
5. Tap **Connect**

### Option C: Scan QR Code

1. Open your computer browser to `http://localhost:8081` on Queen
2. The Expo dev tools page shows a QR code
3. Open Expo Go → point camera at the QR code

## Troubleshooting

### "Cannot connect to server"
- Make sure Expo is still running on Queen:
  - SSH to Queen: `ps aux | grep expo | grep -v grep`
  - If not running: `cd ~/rain-app && PATH=$HOME/.brew/bin:$PATH npx expo start --tunnel`
- Check the tunnel URL hasn't changed — restart Expo if needed

### "Bundle is taking forever"
- First load compiles ~300 modules — give it 30-60 seconds
- Subsequent loads are fast (hot reload)
- If stuck: shake phone → tap **"Reload"**

### White screen / blank app
- Shake the phone → **"Reload"**
- Check Metro logs on Queen for errors: `tail -20 /tmp/expo-queen.log`

### App crashes on a specific screen
- This is a dev build with a debug nav bar — some screens may have issues
- Shake phone → **"Toggle Dev Menu"** → **"Reload"** to restart

### Tunnel URL expired
- Expo tunnel URLs change on restart
- SSH to Queen: `curl -s http://localhost:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); [print(t['public_url']) for t in d['tunnels']]"`
- Use the new `exp://` URL in Expo Go

## The Dev Nav Bar

The app has a **blue navigation bar at the top** for development — tap any screen name to jump to that screen:

Login · Signup · KYC · Home · Cards · Wallet · Markets · Profile · Buy/Sell · Exchange · Lend · Send · Receive · Card · Bank · Referral

## Showcase Page (Web)

Open `showcase.html` on Queen's browser for the Apple Store phone mockup display:
- `open ~/rain-app/showcase.html`
- Or drag the file into Chrome
- The app loads inside a realistic iPhone frame with 3D tilt effects
