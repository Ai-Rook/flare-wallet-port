// constants/marketplace.js — Mock listings + categories + helpers
import { Colors } from './colors';

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'collectibles', label: 'Collectibles', icon: '🎴' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'fashion', label: 'Fashion', icon: '👕' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'other', label: 'Other', icon: '📦' },
];

export const LISTING_TYPES = {
  fixed: 'Buy It Now',
  auction: 'Auction',
  hybrid: 'Buy It Now + Auction',
};

export const AUCTION_DURATIONS = [
  { days: 3, label: '3 Days' },
  { days: 5, label: '5 Days' },
  { days: 7, label: '7 Days' },
];

export const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'MacBook Pro M4 Max 128GB',
    description: 'Mint condition Mac Studio M4 Max. 128GB unified memory. Original box included. Less than 3 months old.',
    category: 'electronics',
    type: 'fixed',
    priceFlr: 92500, // ~$560 at $0.006/FLR
    image: '💻',
    seller: { name: 'TechFlare', rating: 4.9, sales: 127 },
    timeLeft: null,
    bids: [],
    reserve: null,
  },
  {
    id: 2,
    title: 'Rare Pokemon Charizard 1st Edition',
    description: 'PSA 9 Mint. 1999 Base Set Charizard. One of the most iconic collectible cards.',
    category: 'collectibles',
    type: 'auction',
    priceFlr: 18500, // starting price
    image: '🔥',
    seller: { name: 'CardKing', rating: 5.0, sales: 43 },
    timeLeft: '2d 14h',
    bids: [
      { bidder: 'FlareFan', amount: 18500, time: '2h ago' },
      { bidder: 'NFTNomad', amount: 19200, time: '1h ago' },
    ],
    reserve: 25000,
  },
  {
    id: 3,
    title: 'Original Digital Art — Flare Sunset',
    description: '1-of-1 digital artwork. Orange gradient sunset over Flare network nodes. High-res PNG + NFT receipt.',
    category: 'art',
    type: 'hybrid',
    priceFlr: 4200, // auction start
    buyNowFlr: 8500,
    image: '🎨',
    seller: { name: 'ArtOnFlare', rating: 4.7, sales: 12 },
    timeLeft: '5d 3h',
    bids: [
      { bidder: 'CollectorX', amount: 4200, time: '3h ago' },
    ],
    reserve: null,
  },
  {
    id: 4,
    title: 'Vintage Rolex Submariner 16610',
    description: '2005 Rolex Submariner. Serial verified. Recently serviced. Box and papers included.',
    category: 'fashion',
    type: 'fixed',
    priceFlr: 1250000, // ~$7,500
    image: '⌚',
    seller: { name: 'LuxFlare', rating: 4.95, sales: 89 },
    timeLeft: null,
    bids: [],
    reserve: null,
  },
  {
    id: 5,
    title: 'Sony A7RV Camera Body',
    description: 'Like new Sony A7R V. 61MP full frame. Shutter count under 500. Comes with original battery and charger.',
    category: 'electronics',
    type: 'auction',
    priceFlr: 52000,
    image: '📷',
    seller: { name: 'PhotoPro', rating: 4.8, sales: 34 },
    timeLeft: '6d 22h',
    bids: [
      { bidder: 'CameraGuy', amount: 52000, time: '5h ago' },
      { bidder: 'ShutterBug', amount: 53500, time: '2h ago' },
    ],
    reserve: 60000,
  },
  {
    id: 6,
    title: 'Handmade Ceramic Vase Set',
    description: 'Set of 3 handmade ceramic vases. Unique glaze pattern inspired by Flare network topology.',
    category: 'home',
    type: 'fixed',
    priceFlr: 3800,
    image: '🏺',
    seller: { name: 'CraftFlare', rating: 4.6, sales: 8 },
    timeLeft: null,
    bids: [],
    reserve: null,
  },
  {
    id: 7,
    title: 'BTC Cold Storage Wallet (Titanium)',
    description: 'Handmade titanium cold storage wallet. Engraved seed phrase backup. Fireproof, waterproof, indestructible.',
    category: 'other',
    type: 'hybrid',
    priceFlr: 6200,
    buyNowFlr: 12000,
    image: '🔑',
    seller: { name: 'HODLware', rating: 4.85, sales: 56 },
    timeLeft: '4d 8h',
    bids: [
      { bidder: 'SatoshiFan', amount: 6200, time: '1h ago' },
      { bidder: 'ColdStorageKing', amount: 6800, time: '30m ago' },
    ],
    reserve: null,
  },
  {
    id: 8,
    title: 'Sneaker Collection — Jordan 1-12',
    description: 'Complete Air Jordan 1 through 12 collection. All DS (deadstock). Sizes 10-10.5. Certified authentic.',
    category: 'fashion',
    type: 'auction',
    priceFlr: 310000,
    image: '👟',
    seller: { name: 'SoleFlare', rating: 4.9, sales: 23 },
    timeLeft: '1d 2h',
    bids: [
      { bidder: 'SneakerHead', amount: 310000, time: '6h ago' },
      { bidder: 'Jumpman23', amount: 325000, time: '3h ago' },
      { bidder: 'KicksCollector', amount: 342000, time: '1h ago' },
    ],
    reserve: 400000,
  },
];

// Helper: format FLR amount with USD equivalent
export function formatFlrPrice(flrAmount, flrUsdPrice) {
  const usd = flrAmount * flrUsdPrice;
  if (flrAmount >= 1000000) {
    return {
      flr: (flrAmount / 1000000).toFixed(2) + 'M FLR',
      usd: '$' + (usd / 1000).toFixed(1) + 'k',
    };
  }
  if (flrAmount >= 1000) {
    return {
      flr: (flrAmount / 1000).toFixed(1) + 'k FLR',
      usd: '$' + usd.toFixed(0),
    };
  }
  return {
    flr: flrAmount.toLocaleString() + ' FLR',
    usd: '$' + usd.toFixed(2),
  };
}

// Helper: get listing type badge color
export function getTypeColor(type) {
  switch (type) {
    case 'fixed': return Colors.primary;
    case 'auction': return Colors.deepOrange;
    case 'hybrid': return Colors.amber;
    default: return Colors.primary;
  }
}
