import axios from 'axios';
import { CryptoData, CryptoHistory } from '../types/crypto';

// Use local API proxy routes instead of direct CoinGecko calls
const API_BASE_URL = '/api/crypto';

// List of cryptocurrencies we want to track
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'ripple'];

export const fetchCryptoData = async (id: string): Promise<CryptoData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    const data = response.data;
    
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      price: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_24h,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      lastUpdated: data.market_data.last_updated,
      isFavorite: false, // Default value, will be managed by redux state
    };
  } catch (error) {
    console.error(`Error fetching crypto data for ${id}:`, error);
    throw error;
  }
};

export const fetchAllCryptosData = async (): Promise<CryptoData[]> => {
  try {
    const cryptoPromises = CRYPTO_IDS.map(id => fetchCryptoData(id));
    return await Promise.all(cryptoPromises);
  } catch (error) {
    console.error('Error fetching all crypto data:', error);
    throw error;
  }
};

export const fetchCryptoHistory = async (id: string): Promise<CryptoHistory> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/market-chart`, {
      params: {
        days: 7, // Get data for the past week
        interval: 'daily',
      },
    });
    
    const priceData = response.data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1],
    }));
    
    return {
      id,
      prices: priceData,
    };
  } catch (error) {
    console.error(`Error fetching historical data for ${id}:`, error);
    throw error;
  }
};