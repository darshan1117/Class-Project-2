import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRates } from '../services/api';
import { formatCurrency as formatCurrencyUtil } from '../utils/currencyFormatter';

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [rates, setRates] = useState({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 });
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState(null);

  useEffect(() => {
    const loadRates = async () => {
      setLoadingRates(true);
      setRatesError(null);
      try {
        const data = await fetchExchangeRates('INR');
        setRates(data.rates);
      } catch {
        setRatesError('Could not fetch live rates. Using fallback.');
      } finally {
        setLoadingRates(false);
      }
    };
    loadRates();
  }, []);

  const convertAmount = useCallback((amountInINR, toCurrency = selectedCurrency) => {
    if (toCurrency === 'INR') return amountInINR;
    const rate = rates[toCurrency];
    return rate ? amountInINR * rate : amountInINR;
  }, [rates, selectedCurrency]);

  const formatCurrency = useCallback((amountInINR) => {
    const converted = convertAmount(amountInINR, selectedCurrency);
    return formatCurrencyUtil(converted, selectedCurrency);
  }, [convertAmount, selectedCurrency]);

  return {
    formatCurrency,
    convertAmount,
    selectedCurrency,
    setSelectedCurrency,
    rates,
    loadingRates,
    ratesError,
    currencies: ['INR', 'USD', 'EUR', 'GBP'],
  };
};
