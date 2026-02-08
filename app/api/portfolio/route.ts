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

  try {
    const response = await axios.get(
  `https://api.1inch.dev/portfolio/v1/portfolio/eth/${address}`, // Updated endpoint
  {
    headers: {
      'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`,
      'Accept': 'application/json',
    },
    params: {
      chainId: 1 // Explicitly set chain ID
    }
  }
);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      '1inch API Error:',
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}