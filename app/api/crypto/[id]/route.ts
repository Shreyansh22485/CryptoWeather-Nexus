import axios from 'axios';
import { NextResponse } from 'next/server';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}`, {
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

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching crypto data for ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}