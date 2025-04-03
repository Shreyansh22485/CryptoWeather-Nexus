export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  lastUpdated: string;
  isFavorite: boolean;
}

export interface CryptoHistory {
  id: string;
  prices: {
    price: number;
    timestamp: number;
  }[];
}

export interface CryptoPriceAlert {
  id: string;
  type: 'price_alert';
  crypto: string;
  oldPrice: number;
  newPrice: number;
  percentageChange: number;
  timestamp: number;
}