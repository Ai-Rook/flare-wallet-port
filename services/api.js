// ============================================================
// services/api.js — Rain API client wired to port 4000
// ============================================================
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../appConfig';

// ── Axios instance ────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: inject Bearer token ───────────────
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  } catch {}
  return config;
});

// ── Response interceptor: handle 401 → redirect to login ───
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────────────────
export const authApi = {
  login: (username, password, rememberMe) =>
    api.post('/auth/login', { username, password, rememberMe }),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
  forgotUsername: (email) =>
    api.post('/auth/forgot-username', { email }),
  forgotPassword: (usernameOrEmail) =>
    api.post('/auth/forgot-password', { usernameOrEmail }),
  resetPassword: (resetToken, newPassword) =>
    api.post('/auth/reset-password', { resetToken, newPassword }),
  mfaVerify: (method, code) =>
    api.post('/auth/mfa/verify', { method, code }),
};

// ── User ────────────────────────────────────────────────────
export const userApi = {
  me: () => api.get('/user/me'),
  profile: () => api.get('/user/profile'),
  securityStatus: () => api.get('/user/security-status'),
  verificationStatus: () => api.get('/user/verification-status'),
  phones: () => api.get('/user/phones'),
  addPhone: (countryCode, phoneNumber) =>
    api.post('/user/phones', { countryCode, phoneNumber }),
  verifyPhone: (phoneId, code) =>
    api.post(`/user/phones/${phoneId}/verify`, { code }),
  enableMfa: (method, phoneId) =>
    api.post('/user/mfa/enable', { method, phoneId }),
  updatePersonal: (data) => api.put('/user/personal-details', data),
  updateAddress: (data) => api.put('/user/address', data),
  changeEmail: (newEmail) => api.post('/user/email/change', { newEmail }),
  changePassword: (currentPassword, newPassword) =>
    api.post('/user/password/change', { currentPassword, newPassword }),
  applyReferral: (referralCode) => api.post('/user/referral', { referralCode }),
};

// ── Wallets ─────────────────────────────────────────────────
export const walletApi = {
  list: () => api.get('/wallets'),
  create: (type, currency) =>
    api.post('/wallets', { type, currency }),
  depositAddress: (walletId) =>
    api.get(`/wallets/${walletId}/deposit-address`),
};

// ── Cards ───────────────────────────────────────────────────
export const cardApi = {
  list: () => api.get('/cards'),
  get: (cardId) => api.get(`/cards/${cardId}`),
  activate: (cardId, pin) =>
    api.post(`/cards/${cardId}/activate`, { pin }),
  setPin: (cardId, pin, confirmPin) =>
    api.post(`/cards/${cardId}/set-pin`, { pin, confirmPin }),
  lock: (cardId) => api.post(`/cards/${cardId}/lock`),
  unlock: (cardId) => api.post(`/cards/${cardId}/unlock`),
  order: (tier, type) => api.post('/cards/order', { tier, type }),
  setCoinPaymentsingLimit: (cardId, dailyLimit) =>
    api.put(`/cards/${cardId}/spending-limit`, { dailyLimit }),
};

// ── Market / Prices ─────────────────────────────────────────
export const marketApi = {
  prices: () => api.get('/market/prices'),
  ticker: (pair) => api.get(`/market/ticker/${pair}`),
  history: (pair, timeframe) =>
    api.get('/market/history', { params: { pair, timeframe } }),
};

// ── Orders (Buy/Sell) ────────────────────────────────────────
export const orderApi = {
  list: (status) => api.get('/orders', { params: { status } }),
  create: (data) => api.post('/orders', data),
  cancel: (orderId) => api.post(`/orders/${orderId}/cancel`),
  details: (orderId) => api.get(`/orders/${orderId}`),
};

// ── Transfers (Send/Receive) ────────────────────────────────
export const transferApi = {
  list: (status) => api.get('/transfers', { params: { status } }),
  create: (data) => api.post('/transfers', data),
  details: (transferId) => api.get(`/transfers/${transferId}`),
  feeEstimate: (fromWallet, toAddress, amount) =>
    api.get('/transfers/fee-estimate', { params: { fromWallet, toAddress, amount } }),
};

// ── Exchange (conversion) ────────────────────────────────────
export const exchangeApi = {
  pairs: () => api.get('/exchange/pairs'),
  quote: (fromCurrency, toCurrency, amount) =>
    api.post('/exchange/quote', { fromCurrency, toCurrency, amount }),
  execute: (quoteId) => api.post('/exchange/execute', { quoteId }),
};

// ── KYC ──────────────────────────────────────────────────────
export const kycApi = {
  startSession: (level, reason) =>
    api.post('/kyc/session', { level, reason }),
  status: () => api.get('/kyc/status'),
  uploadDocument: (documentType, side, base64Image) =>
    api.post('/kyc/document/upload', { documentType, side, image: base64Image }),
  uploadSelfie: (sessionId, base64Image) =>
    api.post('/kyc/selfie/upload', { sessionId, image: base64Image }),
};

// ── Bank ─────────────────────────────────────────────────────
export const bankApi = {
  list: () => api.get('/bank/accounts'),
  link: (data) => api.post('/bank/link', data),
  unlink: (accountId) => api.delete(`/bank/accounts/${accountId}`),
  setDefault: (accountId) => api.put(`/bank/accounts/${accountId}/default`),
  transactions: (accountId) =>
    api.get(`/bank/accounts/${accountId}/transactions`),
};

// ── Loans / Lend ─────────────────────────────────────────────
export const loanApi = {
  list: () => api.get('/loans'),
  apply: (amount, collateral, term) =>
    api.post('/loans/apply', { amount, collateral, term }),
  details: (loanId) => api.get(`/loans/${loanId}`),
  repay: (loanId, amount) =>
    api.post(`/loans/${loanId}/repay`, { amount }),
};

// ── Rewards ──────────────────────────────────────────────────
export const rewardsApi = {
  balance: () => api.get('/rewards/balance'),
  history: () => api.get('/rewards/history'),
  claim: (amount) => api.post('/rewards/claim', { amount }),
};

export default api;