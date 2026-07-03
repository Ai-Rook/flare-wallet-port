import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { AppContext } from '../context/AppContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotScreen from '../screens/auth/ForgotScreen';
import KYCScreen from '../screens/auth/KYCScreen';

// Tab screens
import HomeScreen from '../screens/tabs/HomeScreen';
import CardsScreen from '../screens/tabs/CardsScreen';
import WalletScreen from '../screens/tabs/WalletScreen';
import MarketsScreen from '../screens/tabs/MarketsScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

// Stack screens
import BuySellScreen from '../screens/stack/BuySellScreen';
import ExchangeScreen from '../screens/stack/ExchangeScreen';
import SendScreen from '../screens/stack/SendScreen';
import ReceiveScreen from '../screens/stack/ReceiveScreen';
import CardDetailScreen from '../screens/stack/CardDetailScreen';
import LendScreen from '../screens/stack/LendScreen';
import BankLinkScreen from '../screens/stack/BankLinkScreen';
import ReferralScreen from '../screens/stack/ReferralScreen';
import WalletDetailScreen from '../screens/stack/WalletDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Spend tab bar icons
const TAB_ICONS = {
  Home: {
    active: require('../assets/tab-icons/home-active.png'),
    inactive: require('../assets/tab-icons/home-inactive.png'),
  },
  Wallet: {
    active: require('../assets/tab-icons/wallet-active.png'),
    inactive: require('../assets/tab-icons/wallet-inactive.png'),
  },
  Cards: {
    active: require('../assets/tab-icons/card-active.png'),
    inactive: require('../assets/tab-icons/card-inactive.png'),
  },
  Markets: {
    active: require('../assets/tab-icons/trophy-active.png'),
    inactive: require('../assets/tab-icons/trophy-inactive.png'),
  },
  Profile: {
    active: require('../assets/tab-icons/profile-active.png'),
    inactive: require('../assets/tab-icons/profile-inactive.png'),
  },
};

function TabIcon({ name, focused }) {
  const icons = TAB_ICONS[name];
  if (!icons) return null;
  return (
    <Image
      source={focused ? icons.active : icons.inactive}
      style={{ width: 28, height: 28 }}
      resizeMode="contain"
    />
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 0.5,
          paddingBottom: 6,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 9, fontWeight: '600', marginTop: 2 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Cards" component={CardsScreen} options={{ tabBarLabel: 'Cards' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: 'Wallet' }} />
      <Tab.Screen name="Markets" component={MarketsScreen} options={{ tabBarLabel: 'Prices' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="Forgot" component={ForgotScreen} />
      <AuthStack.Screen name="KYC" component={KYCScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="BuySell" component={BuySellScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Exchange" component={ExchangeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Send" component={SendScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Receive" component={ReceiveScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CardDetail" component={CardDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Lend" component={LendScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BankLink" component={BankLinkScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Referral" component={ReferralScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WalletDetail" component={WalletDetailScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
