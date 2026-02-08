// app/api/portfolio/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  if (!process.env.ONEINCH_API_KEY) {
    console.error('1inch API key is not configured');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `https://api.1inch.dev/portfolio/v1/portfolio/eth/${address}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`,
          'Accept': 'application/json',
        },
        params: {
          chainId: 1
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('1inch API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio',
        details: error.response?.data || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}