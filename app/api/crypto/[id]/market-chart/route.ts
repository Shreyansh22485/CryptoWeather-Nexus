import axios, { AxiosRequestConfig } from 'axios';
import { NextResponse } from 'next/server';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache with expiration
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5-minute cache for historical data

// Mock data for fallback
const generateMockHistoricalData = (id: string, days: number) => {
  const now = Date.now();
  const result = { prices: [] as [number, number][] };
  
  // Start prices (approximations)
  const startPrices: { [key: string]: number } = {
    bitcoin: 64000,
    ethereum: 3100,
    ripple: 0.50
  };
  
  const price = startPrices[id] || 100;
  const volatility = 0.02; // 2% volatility for mock data
  
  // Generate mock data points
  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - i) * 24 * 60 * 60 * 1000;
    const randomChange = 1 + (Math.random() * volatility * 2 - volatility);
    const newPrice = i === 0 ? price : result.prices[i-1][1] * randomChange;
    
    result.prices.push([timestamp, newPrice]);
  }
  
  return result;
};

// Function to attempt API request with retries
async function fetchWithRetry(url: string, options: AxiosRequestConfig, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios.get(url, options);
    } catch (error: unknown) {
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Properly await the entire params object
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days') || '7';
  const interval = searchParams.get('interval') || 'daily';

  // Check cache first
  const cacheKey = `crypto_history_${id}_${days}_${interval}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached historical data for ${id}`);
    return NextResponse.json(cachedData.data);
  }
  
  try {
    const response = await fetchWithRetry(`${COINGECKO_API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval,
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
    console.error(`Error fetching historical data for ${id}:`, error);
    
    // Return mock historical data
    const mockData = generateMockHistoricalData(id, parseInt(days));
    return NextResponse.json(mockData);
  }
}