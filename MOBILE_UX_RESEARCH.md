# Mobile UX Research — 2026 Patterns for Rain App

## Key Patterns to Implement

### 1. AI-Native Adaptive Interfaces
- **Layout personalization**: Home screen reorders based on usage patterns
  - If user checks wallet balance most → Wallet section rises to top
  - If user trades frequently → Markets/Exchange section surfaces
  - Time-of-day triggers: spending summary in evening, market alerts in morning
- **Spotify pattern**: content types stay familiar, but position adapts
- **For Rain**: Agentic tab could surface most-active agent based on usage

### 2. Micro-Interactions & Haptic Feedback
- `expo-haptics` package — already available in Expo SDK
- **Selection haptic** on tab switch (light tap feeling)
- **Success haptic** on transaction complete (pleasant double-tap)
- **Error haptic** on failed payment
- **Impact haptic** on button press (medium weight)
- Button scale animation on press (scale to 0.96, spring back)

### 3. Gesture-Based Navigation
- Swipe right from edge → go back (already standard iOS)
- Pull-to-refresh with custom spinner
- Swipe on transaction row → reveal actions (delete, copy)
- Long-press on token → quick actions menu

### 4. Bare-Bones / Minimal UI
- Remove visual clutter — more whitespace, fewer borders
- Content-first design: let the data breathe
- Subtle shadows instead of hard borders
- SF Symbols for tab bar icons (replace emoji with proper icons)

### 5. Dark Mode
- Essential for fintech apps — users check balances at night
- Use semantic colors: `Colors.text` not `#1A1A1A`
- Override with `useColorScheme()` hook
- Respects system setting by default

### 6. Context-Aware Authentication
- Biometric prompt only when needed (sending >$100, changing wallet)
- Face ID / Touch ID for transaction confirmation
- No password re-entry for low-risk actions (checking balance)

### 7. Sheet-Based Patterns (iOS 18 style)
- Half-sheet modals for confirmations instead of full-screen push
- Bottom sheet for "Send" flow — keeps context visible
- Detent heights: medium (preview) and large (full form)

## Quick Wins for Tomorrow

1. **Install expo-haptics** — add haptic feedback to tab switches and buttons
2. **Replace emoji tab icons with SF Symbols** — use `@expo/vector-icons`
3. **Button press animation** — scale down on pressIn, spring back on pressOut
4. **Pull-to-refresh** on Home and Markets screens
5. **Dark mode** — semantic colors + system preference
6. **Bottom sheet** for Send/Receive confirmations

## Packages to Add
- `expo-haptics` — haptic feedback (already in Expo SDK)
- `@expo/vector-icons` — SF Symbols / Material Icons for tab bar
- `@gorhom/bottom-sheet` — iOS-style bottom sheets with detents
- `react-native-gesture-handler` — swipe gestures

## Advanced Transitions for Rain (Edge/Modern)

### Hero Morph / Shared Element
- Tap a token card → the icon smoothly expands from list position into detail header
- `react-native-reanimated` + `react-native-shared-element` or manual layout animation
- Biggest visual impact — makes the app feel next-gen

### Spring Physics
- `withSpring()` from react-native-reanimated
- Buttons: scale to 0.94 → spring back past 1.0 to 1.02 → settle at 1.0
- Tab switches: slight overshoot on slide
- Feels physical, like tapping a real object

### Liquid Glass (Apple WWDC 2026)
- Blur + transparency that pours between states
- Navigation bars become translucent with backdrop blur
- Content slides under frosted glass headers
- `expo-blur` for backdrop effect

### Container Transform (Material 3)
- Card morphs into full screen — border expands, corners change, content fades in
- Perfect for card tiers → CardDetail flow

### Parallax Scroll
- Background layers move slower than foreground
- Balance card scrolls at 0.8x, list at 1.0x
- Adds depth without being flashy

### Implementation Priority for Rain
1. Hero morph on token tap (biggest wow factor)
2. Spring physics on all button presses
3. Frosted glass header on scroll
4. Container transform for cards → detail
5. Parallax on home screen balance card
