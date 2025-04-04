import axios, { AxiosRequestConfig } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache with expiration
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute cache

// Mock data for fallback
const mockCryptoData = {
  bitcoin: {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    market_data: {
      current_price: { usd: 65000 },
      price_change_24h: 1200,
      price_change_percentage_24h: 1.8,
      market_cap: { usd: 1250000000000 },
      last_updated: new Date().toISOString()
    }
  },
  ethereum: {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    market_data: {
      current_price: { usd: 3200 },
      price_change_24h: 75,
      price_change_percentage_24h: 2.3,
      market_cap: { usd: 380000000000 },
      last_updated: new Date().toISOString()
    }
  },
  ripple: {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    market_data: {
      current_price: { usd: 0.52 },
      price_change_24h: 0.01,
      price_change_percentage_24h: 1.5,
      market_cap: { usd: 27000000000 },
      last_updated: new Date().toISOString()
    }
  }
};

// Function to attempt API request with retries
async function fetchWithRetry(url: string, options: AxiosRequestConfig, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios.get(url, options);
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // If rate limited, wait before retrying
        console.log(`Rate limited. Retrying in ${(attempt + 1) * 2}s...`);
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000));
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
  throw lastError;
}

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const id = params.id;
  
  // Check cache first
  const cacheKey = `crypto_${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached data for ${id}`);
    return NextResponse.json(cachedData.data);
  }
  
  try {
    const response = await fetchWithRetry(`${COINGECKO_API_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    // Store in cache
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching crypto data for ${id}:`, error);
    
    // Return mock data if available
    if (mockCryptoData[id as keyof typeof mockCryptoData]) {
      console.log(`Returning mock data for ${id}`);
      return NextResponse.json(mockCryptoData[id as keyof typeof mockCryptoData]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}