import axios from 'axios';

const EXCHANGE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

export const fetchExchangeRates = async (baseCurrency = 'INR') => {
  const response = await axios.get(`${EXCHANGE_API_BASE}/${baseCurrency}`);
  return response.data;
};
