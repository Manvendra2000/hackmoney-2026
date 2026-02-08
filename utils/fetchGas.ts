import axios from 'axios';

export const getEthGasPrice = async () => {
  const url = 'https://api.1inch.dev/gas-price/v1.5/1'; // '1' is the Chain ID for Ethereum
  
  try {
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ONEINCH_API_KEY}`
      }
    });
    console.log("Current Gas Prices:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Connection Failed:", error);
  }
};