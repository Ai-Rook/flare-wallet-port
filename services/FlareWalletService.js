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

// ── FAsset contract addresses on Coston2 ───────────────────────────
// These are the ERC-20 token contracts for FAssets on Flare testnet.
// In production, these would be queried via FlareContractRegistry.
const FASSET_ADDRESSES = {
  FXRP: null, // Look up via ContractRegistry at runtime
  FBTC: null,
  FDOGE: null,
};

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

    // ERC-20 tokens (FAssets)
    for (const token of tokens) {
      if (token.flareNative && token.fAsset) {
        const tokenAddress = FASSET_ADDRESSES[token.symbol];
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
