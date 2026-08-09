// AppContext — Global state for the Flare wallet app
// Provides simple { isLoggedIn, user, setLoggedIn, setUser, setToken, balances }
// matching what all screen components expect
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const DEMO_USER = {
  name: 'Flare User',
  email: 'demo@flarewallet.app',
  kycStatus: true,
};

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem('accessToken');
        if (savedToken) {
          setToken(savedToken);
          // In production, validate with /user/me
          // For now, restore demo user
          const savedUser = await AsyncStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
          }
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  // Persist on login
  const handleSetLoggedIn = (val) => {
    setIsLoggedIn(val);
    if (!val) {
      setUser(null);
      setToken(null);
      AsyncStorage.multiRemove(['accessToken', 'user']);
    }
  };

  const handleSetUser = (u) => {
    setUser(u);
    if (u) AsyncStorage.setItem('user', JSON.stringify(u));
  };

  const handleSetToken = (t) => {
    setToken(t);
    if (t) AsyncStorage.setItem('accessToken', t);
  };

  // DEV MODE: skip login for demo purposes
  const enableDevMode = () => {
    setUser(DEMO_USER);
    setIsLoggedIn(true);
    setToken('dev-token');
  };

  if (loading) return null; // splash placeholder

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      setLoggedIn: handleSetLoggedIn,
      user,
      setUser: handleSetUser,
      token,
      setToken: handleSetToken,
      balances,
      setBalances,
      enableDevMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
export default AppContext;
