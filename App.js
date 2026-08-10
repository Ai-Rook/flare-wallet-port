import React, { useState, useContext, Component, useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Animated, Easing } from 'react-native';
import { AppProvider, AppContext } from './context/AppContext';
import { LivePriceProvider } from './services/LivePriceService';
import SpringPress from './components/SpringPress';
import PulseFAB from './components/PulseFAB';
import { HeroProvider, useHero, HeroIcon } from './components/HeroMorph';
import { Colors } from './constants/colors';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#E74C3C', marginBottom: 8 }}>Render Error</Text>
          <Text style={{ fontSize: 13, color: '#333' }}>{String(this.state.error)}</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false, error: null })} style={{ marginTop: 16, padding: 12, backgroundColor: '#007AFF', borderRadius: 8 }}>
            <Text style={{ color: '#FFF', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

// ── Screens ──────────────────────────────────────────────
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import KYCScreen from './screens/auth/KYCScreen';
import HomeScreen from './screens/tabs/HomeScreen';
import CardsScreen from './screens/tabs/CardsScreen';
import WalletScreen from './screens/tabs/WalletScreen';
import MarketsScreen from './screens/tabs/MarketsScreen';
import RewardsScreen from './screens/tabs/RewardsScreen';
import ProfileScreen from './screens/tabs/ProfileScreen';
import AgenticScreen from './screens/tabs/AgenticScreen';
import ConfidentialScreen from './screens/tabs/ConfidentialScreen';
import MarketplaceScreen from './screens/tabs/MarketplaceScreen';
import ListingDetailScreen from './screens/stack/ListingDetailScreen';
import CreateListingScreen from './screens/stack/CreateListingScreen';
import BuySellScreen from './screens/stack/BuySellScreen';
import CardDetailScreen from './screens/stack/CardDetailScreen';
import ExchangeScreen from './screens/stack/ExchangeScreen';
import LendScreen from './screens/stack/LendScreen';
import SendScreen from './screens/stack/SendScreen';
import ReceiveScreen from './screens/stack/ReceiveScreen';
import CardSettingsScreen from './screens/stack/CardSettingsScreen';
import CardOrderScreen from './screens/stack/CardOrderScreen';
import BankLinkScreen from './screens/stack/BankLinkScreen';
import ReferralScreen from './screens/stack/ReferralScreen';
import WalletDetailScreen from './screens/stack/WalletDetailScreen';
import MarketDetailScreen from './screens/stack/MarketDetailScreen';
import PricesScreen from './screens/stack/PricesScreen';
import ForgotScreen from './screens/auth/ForgotScreen';
import SplashScreen from './screens/splash/SplashScreen';

// ── Navigation config ────────────────────────────────────
const TAB_SCREENS = {
  home: HomeScreen,
  cards: CardsScreen,
  wallet: WalletScreen,
  markets: PricesScreen,
  agentic: AgenticScreen,
  confidential: ConfidentialScreen,
  marketplace: MarketplaceScreen,
  rewards: RewardsScreen,
  profile: ProfileScreen,
};

const STACK_SCREENS = {
  login: LoginScreen, signup: SignupScreen, kyc: KYCScreen, forgot: ForgotScreen,
  buysell: BuySellScreen, exchange: ExchangeScreen, lend: LendScreen,
  send: SendScreen, receive: ReceiveScreen, carddetail: CardDetailScreen,
  cardsettings: CardSettingsScreen,
  cardorder: CardOrderScreen,
  banklink: BankLinkScreen, referral: ReferralScreen, walletdetail: WalletDetailScreen,
  // Aliases matching screen navigate() names
  BuySell: BuySellScreen, Send: SendScreen, Exchange: ExchangeScreen,
  Lend: LendScreen, CardDetail: CardDetailScreen, CardSettings: CardSettingsScreen,
  BankLink: BankLinkScreen, WalletDetail: WalletDetailScreen, MarketDetail: MarketDetailScreen, Prices: PricesScreen, Receive: ReceiveScreen, Forgot: ForgotScreen, KYC: KYCScreen,
  Login: LoginScreen, Signup: SignupScreen, Profile: ProfileScreen, Referral: ReferralScreen, CardOrder: CardOrderScreen,
  ListingDetail: ListingDetailScreen, CreateListing: CreateListingScreen, Marketplace: MarketplaceScreen,
};

const TAB_ICONS = {
  home: { active: require('./assets/tab-icons/home-active.png'), inactive: require('./assets/tab-icons/home-inactive.png') },
  wallet: { active: require('./assets/tab-icons/wallet-active.png'), inactive: require('./assets/tab-icons/wallet-inactive.png') },
  cards: { active: require('./assets/tab-icons/card-active.png'), inactive: require('./assets/tab-icons/card-inactive.png') },
  markets: { active: require('./assets/tab-icons/trophy-active.png'), inactive: require('./assets/tab-icons/trophy-inactive.png') },
  rewards: { active: require('./assets/tab-icons/trophy-active.png'), inactive: require('./assets/tab-icons/trophy-inactive.png') },
  confidential: { active: require('./assets/tab-icons/agentic-active.png'), inactive: require('./assets/tab-icons/agentic-inactive.png') },
  marketplace: { active: require('./assets/tab-icons/card-active.png'), inactive: require('./assets/tab-icons/card-inactive.png') },
  agentic: { active: require('./assets/tab-icons/agentic-active.png'), inactive: require('./assets/tab-icons/agentic-inactive.png') },
  profile: { active: require('./assets/tab-icons/profile-active.png'), inactive: require('./assets/tab-icons/profile-inactive.png') },
};

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'wallet', label: 'Wallet' },
  { key: 'marketplace', label: 'Shop' },
  { key: 'agentic', label: 'Agent' },
  { key: 'confidential', label: 'FCC' },
  { key: 'profile', label: 'Profile' },
];

import { Image } from 'react-native';
function TabBar({ activeTab, onTabPress, onFABPress }) {
  // Split tabs: first 2, center FAB, last 3
  const leftTabs = TABS.slice(0, 3);
  const rightTabs = TABS.slice(3);

  return (
    <View style={tabStyles.outerContainer}>
      <View style={tabStyles.shadowStrip} />
      <View style={tabStyles.container}>
        {leftTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <SpringPress key={tab.key} onPress={() => onTabPress(tab.key)} activeScale={0.92} style={tabStyles.tab}>
              <View style={tabStyles.tabContent}>
                <Image
                  source={isActive ? TAB_ICONS[tab.key]?.active : TAB_ICONS[tab.key]?.inactive}
                  style={{ width: 22, height: 22, tintColor: isActive ? '#FF6300' : '#9E8E83' }}
                  resizeMode="contain"
                />
                <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>{tab.label}</Text>
              </View>
            </SpringPress>
          );
        })}

        {/* Center FAB — opens quick actions */}
        <View style={tabStyles.fabWrap}>
          <PulseFAB
            icon="+"
            color="#FF6300"
            size={44}
            onPress={onFABPress}
          />
        </View>

        {rightTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <SpringPress key={tab.key} onPress={() => onTabPress(tab.key)} activeScale={0.92} style={tabStyles.tab}>
              <View style={tabStyles.tabContent}>
                <Image
                  source={isActive ? TAB_ICONS[tab.key]?.active : TAB_ICONS[tab.key]?.inactive}
                  style={{ width: 22, height: 22, tintColor: isActive ? '#FF6300' : '#9E8E83' }}
                  resizeMode="contain"
                />
                <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>{tab.label}</Text>
                {isActive && <View style={tabStyles.underline} />}
              </View>
            </SpringPress>
          );
        })}
      </View>
      <View style={tabStyles.safeArea} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#FFF8F0', // Warm cream to match Sunkist theme
  },
  shadowStrip: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 52,
    alignItems: 'center',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
  },
  fabWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18, // Pop up above the bar
    marginHorizontal: 4,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabContent: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, color: '#8E8E93', marginBottom: 2 },
  iconActive: { color: '#007AFF' },
  label: { fontSize: 9, color: '#8E8E93', fontWeight: '500' },
  labelActive: { color: '#FF6300', fontWeight: '600' },
  underline: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FF6300',
    marginTop: 3,
  },
  safeArea: {
    height: 20,
    backgroundColor: '#FFFFFF',
  },
});

// ── Screen wrapper with transitions ─────────────────────
function AnimatedScreen({ children, animValue, slideValue, type }) {
  if (type === 'tab') {
    return (
      <Animated.View style={{ flex: 1, opacity: animValue }}>
        {children}
      </Animated.View>
    );
  }
  // Stack: slide from right — absolute positioned to cover tab bar
  return (
    <Animated.View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10,
      opacity: animValue,
      transform: [{ translateX: slideValue }],
      backgroundColor: '#F2F2F7',
    }}>
      {children}
    </Animated.View>
  );
}

// ── Main app ─────────────────────────────────────────────
function AppContent() {
  const { isLoggedIn } = useContext(AppContext);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [stack, setStack] = useState([]);  // [{screen, params}, ...]
  const [renderingStack, setRenderingStack] = useState([]);  // [{screen, params}, ...]
  const [fabOpen, setFabOpen] = useState(false);

  // Animation values
  const tabOpacity = useRef(new Animated.Value(1)).current;
  const stackOpacity = useRef(new Animated.Value(0)).current;
  const stackSlide = useRef(new Animated.Value(0)).current;

  const navigate = (screen, params = {}) => {
    if (screen === 'Profile' || screen === 'profile') {
      setActiveTab('profile');
      setStack([]);
      setRenderingStack([]);
      return;
    }
    if (screen === 'Agentic' || screen === 'agentic') {
      setActiveTab('agentic');
      setStack([]);
      setRenderingStack([]);
      return;
    }
    // Animate: slide new screen in from right
    stackSlide.setValue(300);
    stackOpacity.setValue(0);
    setStack(prev => [...prev, { screen, params }]);
    setRenderingStack(prev => [...prev, { screen, params }]);

    // Spring push — overshoot then settle (feels more iOS-native)
    Animated.parallel([
      Animated.spring(stackOpacity, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.spring(stackSlide, { toValue: 0, friction: 9, tension: 50, overshootClamping: false, useNativeDriver: true }),
    ]).start();
  };

  const goBack = () => {
    // Smooth slide-out — faster, reveals tab underneath
    Animated.parallel([
      Animated.timing(stackOpacity, { toValue: 0, duration: 150, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      Animated.timing(stackSlide, { toValue: 300, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => {
      setStack(prev => prev.slice(0, -1));
      setRenderingStack(prev => prev.slice(0, -1));
    });
  };

  const handleTabPress = (tab) => {
    if (tab === activeTab) return;
    setFabOpen(false);
    // Crossfade: fade out current, fade in new
    Animated.sequence([
      Animated.timing(tabOpacity, { toValue: 0, duration: 150, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start(() => {
      setActiveTab(tab);
      setStack([]);
      setRenderingStack([]);
      Animated.timing(tabOpacity, { toValue: 1, duration: 150, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    });
  };

  const handleFABPress = () => {
    setFabOpen(!fabOpen);
  };

  const handleFABAction = (screen) => {
    setFabOpen(false);
    navigate(screen);
  };

  // ── Splash screen ──────────────────────────────────────
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // ── Auth gate ──────────────────────────────────────────
  if (!isLoggedIn) {
    const authNav = { navigate, goBack: () => {}, setParams: () => {} };
    if (stack.length > 0) {
      const currentScreen = stack[stack.length - 1];
      const AuthScreen = STACK_SCREENS[currentScreen];
      if (AuthScreen) {
        return (
          <View style={{ flex: 1, backgroundColor: '#FFF8F0' }}>
            <AnimatedScreen animValue={stackOpacity} slideValue={stackSlide} type="stack">
              <ErrorBoundary>
                <AuthScreen navigation={authNav} route={{ params: {} }} />
              </ErrorBoundary>
            </AnimatedScreen>
          </View>
        );
      }
    }
    return (
      <ErrorBoundary>
        <LoginScreen navigation={authNav} route={{ params: {} }} />
      </ErrorBoundary>
    );
  }

  // ── Stack screen with slide transition ─────────────────
  if (renderingStack.length > 0) {
    const current = renderingStack[renderingStack.length - 1];
    const currentScreen = current.screen || current;
    const currentParams = current.params || {};
    const ScreenComponent = STACK_SCREENS[currentScreen] || TAB_SCREENS[currentScreen];
    const screenTitle = currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1);
    const fakeNav = { navigate, goBack, setParams: () => {} };

    return (
      <View style={{ flex: 1, backgroundColor: '#FFF8F0' }}>
        {/* Tab screen always underneath so back animation reveals it */}
        <Animated.View style={{ flex: 1, opacity: tabOpacity }}>
          <ErrorBoundary>
            {React.createElement(TAB_SCREENS[activeTab], { navigation: { navigate, goBack: () => {}, setParams: () => {} }, route: { params: {} } })}
          </ErrorBoundary>
          <TabBar activeTab={activeTab} onTabPress={handleTabPress} onFABPress={handleFABPress} />
        </Animated.View>
        {/* Stack screen slides on top */}
        <AnimatedScreen animValue={stackOpacity} slideValue={stackSlide} type="stack">
          <ErrorBoundary>
            <ScreenComponent navigation={fakeNav} route={{ params: currentParams }} />
          </ErrorBoundary>
        </AnimatedScreen>
      </View>
    );
  }

  // ── Tab screen with crossfade transition ───────────────
  const TabScreen = TAB_SCREENS[activeTab];
  const fakeNav = { navigate, goBack: () => {}, setParams: () => {} };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF8F0' }}>
      <AnimatedScreen animValue={tabOpacity} type="tab">
        <ErrorBoundary>
          <TabScreen navigation={fakeNav} route={{ params: {} }} />
        </ErrorBoundary>
      </AnimatedScreen>
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} onFABPress={handleFABPress} />

      {/* Quick action overlay from FAB */}
      {fabOpen && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setFabOpen(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 20 }}
          />
          <View style={{ position: 'absolute', bottom: 90, alignSelf: 'center', zIndex: 21, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, minWidth: 180 }}>
            {[
              { key: 'Send', icon: require('./assets/action-icons/send.png'), label: 'Send' },
              { key: 'Exchange', icon: require('./assets/action-icons/exchange.png'), label: 'Exchange' },
              { key: 'BuySell', icon: require('./assets/action-icons/buysell.png'), label: 'Buy / Sell' },
              { key: 'Receive', icon: require('./assets/action-icons/receive.png'), label: 'Receive' },
            ].map(action => (
              <SpringPress key={action.key} onPress={() => handleFABAction(action.key)} activeScale={0.95}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10 }}>
                  <Image source={action.icon} style={{ width: 22, height: 22, tintColor: '#FF6300', marginRight: 14 }} resizeMode="contain" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1C1C1E' }}>{action.label}</Text>
                </View>
              </SpringPress>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <LivePriceProvider>
          <AppContent />
        </LivePriceProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
