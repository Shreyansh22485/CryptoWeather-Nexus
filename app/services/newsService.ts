import axios from 'axios';
import { NewsItem } from '../types/news';

// Interface for NewsData.io API response
interface NewsDataItem {
  article_id: string;
  title: string;
  description: string;
  link: string;
  source_id: string;
  pubDate: string;
  image_url?: string;
}

interface NewsDataResponse {
  results: NewsDataItem[];
}

// Replace with your actual NewsData.io API key
const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY || '';
const NEWS_API_URL = 'https://newsdata.io/api/1/news';

export const fetchCryptoNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get<NewsDataResponse>(NEWS_API_URL, {
      params: {
        apikey: API_KEY,
        q: 'cryptocurrency OR bitcoin OR ethereum OR blockchain',
        language: 'en',
        category: 'business,technology',
        size: 5, // We only need the top 5 headlines
      },
    });

    return response.data.results.map((item: NewsDataItem) => ({
      id: item.article_id,
      title: item.title,
      description: item.description,
      url: item.link,
      source: item.source_id,
      publishedAt: item.pubDate,
      imageUrl: item.image_url,
    }));
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    
    // Return mock data as fallback if the API fails
    return getMockNews();
  }
};

// Mock news data for fallback or development
const getMockNews = (): NewsItem[] => {
  return [
    {
      id: '1',
      title: 'Bitcoin Surges Past $100,000, Setting New All-Time High',
      description: 'The world\'s largest cryptocurrency has reached a new milestone, surpassing $100,000 for the first time in its history.',
      url: 'https://example.com/bitcoin-new-ath',
      source: 'CryptoNews',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Upgrade Completes: What You Need to Know',
      description: 'The long-awaited Ethereum 2.0 upgrade has finally completed, bringing significant improvements to the network.',
      url: 'https://example.com/ethereum-upgrade',
      source: 'BlockchainToday',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Regulatory Clarity: New Framework for Cryptocurrency Announced',
      description: 'Global regulators have announced a new regulatory framework for cryptocurrencies, providing much-needed clarity for the industry.',
      url: 'https://example.com/crypto-regulations',
      source: 'CoinDesk',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'DeFi Market Cap Exceeds $500 Billion as Adoption Grows',
      description: 'The Decentralized Finance market has reached a new milestone, with its total market cap surpassing $500 billion.',
      url: 'https://example.com/defi-growth',
      source: 'DeFiPulse',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Top Financial Institutions Now Offering Crypto Custody Services',
      description: 'Major banks and financial institutions have started offering cryptocurrency custody services to meet growing client demand.',
      url: 'https://example.com/crypto-custody',
      source: 'FinancialTimes',
      publishedAt: new Date().toISOString(),
    },
  ];
};