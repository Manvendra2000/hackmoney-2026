import axios, { AxiosError } from 'axios';

export const getEthGasPrice = async () => {
  const url = 'https://api.1inch.dev/gas-price/v1.5/1';
  
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${process.env.ONEINCH_API_KEY}`
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("1inch API Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error occurred");
    }
    throw error;
  }
};