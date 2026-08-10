/**
 * FlareWalletService — Wallet balance queries and transactions on Flare.
 * Connects to Coston2 testnet via ethers.js.
 *
 * Supports:
 * - Native FLR/C2FLR balance
 * - ERC-20 token balances (FAssets: FXRP, FBTC, FDOGE)
 * - Transaction history (via explorer API)
 * - Send transactions (native + ERC-20)
 *
 * Usage:
 *   import { flareWallet } from '../services/FlareWalletService';
 *   const balance = await flareWallet.getBalance(address, 'FLR');
 */

import { ethers } from 'ethers';
import { FLARE_RPC, FLARE_CHAIN_ID, FLARE_EXPLORER } from '../appConfig';

// ── Provider ────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(FLARE_RPC, {
  chainId: FLARE_CHAIN_ID,
  name: 'coston2',
});

// ── ERC-20 ABI (minimal) ───────────────────────────────────────────
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

// ── FlareContractsRegistry (same on all Flare networks) ────────────
const FLARE_REGISTRY = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019';
const REGISTRY_ABI = [
  'function getContractAddressByName(string) view returns (address)',
];
const ASSET_MGR_ABI = [
  'function fAsset() view returns (address)',
];

// ── FAsset contract addresses on Coston2 ───────────────────────────
// Resolved via FlareContractsRegistry at runtime.
// FXRP is the only FAsset currently deployed on Coston2.
// FBTC/FDOGE are not yet available on testnet.
const FASSET_ADDRESSES = {
  FXRP: '0x0b6A3645c240605887a5532109323A3E12273dc7',
  FBTC: null,  // Not deployed on Coston2
  FDOGE: null, // Not deployed on Coston2
};

// ── Runtime FAsset resolver (proper pattern) ───────────────────────
async function resolveFAssetAddress(symbol) {
  // Return cached if available
  if (FASSET_ADDRESSES[symbol]) return FASSET_ADDRESSES[symbol];
  try {
    const reg = new ethers.Contract(FLARE_REGISTRY, REGISTRY_ABI, provider);
    const mgrAddr = await reg.getContractAddressByName('AssetManager' + symbol);
    if (mgrAddr && mgrAddr !== ethers.ZeroAddress) {
      const mgr = new ethers.Contract(mgrAddr, ASSET_MGR_ABI, provider);
      const tokenAddr = await mgr.fAsset();
      if (tokenAddr && tokenAddr !== ethers.ZeroAddress) {
        FASSET_ADDRESSES[symbol] = tokenAddr; // cache for subsequent calls
        return tokenAddr;
      }
    }
  } catch (e) {
    console.warn('[FlareWallet] Could not resolve FAsset ' + symbol + ':', e.message);
  }
  return null;
}

// ── FlareWalletService singleton ───────────────────────────────────
class FlareWalletService {
  constructor() {
    this.provider = provider;
    this.initialized = true;
  }

  /**
   * Get native FLR/C2FLR balance
   * @param {string} address - wallet address
   * @returns {Promise<string>} balance in ETH format (e.g., "1.5")
   */
  async getNativeBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (e) {
      console.error('[FlareWallet] Native balance failed:', e.message);
      return '0';
    }
  }

  /**
   * Get ERC-20 token balance
   * @param {string} address - wallet address
   * @param {string} tokenAddress - ERC-20 contract address
   * @param {number} decimals - token decimals (default 18)
   * @returns {Promise<string>} balance in human-readable format
   */
  async getERC20Balance(address, tokenAddress, decimals = 18) {
    if (!tokenAddress) return '0';
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatUnits(balance, decimals);
    } catch (e) {
      console.error('[FlareWallet] ERC20 balance failed:', e.message);
      return '0';
    }
  }

  /**
   * Get all balances for a wallet
   * @param {string} address - wallet address
   * @param {Array} tokens - token list from constants/tokens.js
   * @returns {Promise<Object>} { FLR: "1.5", FXRP: "100", ... }
   */
  async getAllBalances(address, tokens = []) {
    const balances = {};

    // Native FLR
    balances.FLR = await this.getNativeBalance(address);

    // ERC-20 tokens (FAssets) — resolve addresses at runtime
    for (const token of tokens) {
      if (token.flareNative && token.fAsset) {
        const tokenAddress = await resolveFAssetAddress(token.symbol);
        balances[token.symbol] = await this.getERC20Balance(address, tokenAddress, token.decimals);
      }
    }

    return balances;
  }

  /**
   * Send native FLR
   * @param {string} privateKey - sender private key
   * @param {string} toAddress - recipient
   * @param {string} amount - amount in ETH (e.g., "0.5")
   * @returns {Promise<Object>} transaction receipt
   */
  async sendNative(privateKey, toAddress, amount) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount),
    });
    return {
      hash: tx.hash,
      explorerUrl: `${FLARE_EXPLORER}/tx/${tx.hash}`,
      wait: () => tx.wait(),
    };
  }

  /**
   * Send ERC-20 token
   * @param {string} privateKey - sender private key
   * @param {string} tokenAddress - ERC-20 contract
   * @param {string} toAddress - recipient
   * @param {string} amount - human-readable amount
   * @param {number} decimals - token decimals
   * @returns {Promise<Object>} transaction info
   */
  async sendERC20(privateKey, tokenAddress, toAddress, amount, decimals = 18) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    const parsedAmount = ethers.parseUnits(amount, decimals);
    const tx = await contract.transfer(toAddress, parsedAmount);
    return {
      hash: tx.hash,
      explorerUrl: `${FLARE_EXPLORER}/tx/${tx.hash}`,
      wait: () => tx.wait(),
    };
  }

  /**
   * Send FAsset token (resolves address via registry)
   * @param {string} privateKey - sender private key
   * @param {string} symbol - FAsset symbol (FXRP, FBTC, FDOGE)
   * @param {string} toAddress - recipient
   * @param {string} amount - human-readable amount
   * @param {number} decimals - token decimals
   * @returns {Promise<Object>} transaction info
   */
  async sendFAsset(privateKey, symbol, toAddress, amount, decimals = 18) {
    const tokenAddress = await resolveFAssetAddress(symbol);
    if (!tokenAddress) throw new Error('FAsset ' + symbol + ' not available on this network');
    return this.sendERC20(privateKey, tokenAddress, toAddress, amount, decimals);
  }

  /**
   * Get transaction count (nonce) for address
   * @param {string} address
   * @returns {Promise<number>}
   */
  async getTransactionCount(address) {
    return await this.provider.getTransactionCount(address);
  }

  /**
   * Get current gas price
   * @returns {Promise<string>} gas price in Gwei
   */
  async getGasPrice() {
    const feeData = await this.provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('0', 'gwei');
    return ethers.formatUnits(gasPrice, 'gwei');
  }

  /**
   * Create a new random wallet
   * @returns {Object} { address, privateKey, mnemonic }
   */
  createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
  }

  /**
   * Get wallet from private key
   * @param {string} privateKey
   * @returns {ethers.Wallet}
   */
  getWallet(privateKey) {
    return new ethers.Wallet(privateKey, this.provider);
  }
}

// Export singleton
export const flareWallet = new FlareWalletService();
export default flareWallet;
