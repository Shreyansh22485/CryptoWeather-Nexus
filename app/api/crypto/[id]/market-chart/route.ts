import axios from 'axios';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days') || '7';
  const interval = searchParams.get('interval') || 'daily';

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching historical data for ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency historical data' },
      { status: 500 }
    );
  }
}