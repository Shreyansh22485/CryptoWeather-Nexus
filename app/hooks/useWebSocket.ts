import { useEffect } from 'react';
import { useAppDispatch } from './reduxHooks';
import { addAlert } from '../redux/notificationsSlice';
import { updateCryptoPrice } from '../redux/cryptoSlice';
import webSocketService from '../services/webSocketService';
import { CryptoPriceAlert } from '../types/crypto';

export const useWebSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Connect to the WebSocket service when component mounts
    webSocketService.connect();

    // Subscribe to alerts
    const unsubscribe = webSocketService.subscribe((alert) => {
      // Add the alert to notifications
      dispatch(addAlert(alert));

      // If it's a price alert, also update the crypto price
      if (alert.type === 'price_alert') {
        const priceAlert = alert as CryptoPriceAlert;
        dispatch(updateCryptoPrice({
          id: priceAlert.crypto,
          price: priceAlert.newPrice,
        }));
      }
    });

    // Set up an interval to simulate weather alerts
    const weatherAlertInterval = setInterval(() => {
      const cities = ['New York', 'London', 'Tokyo'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      webSocketService.simulateWeatherAlert(randomCity);
    }, 30000); // Every 30 seconds

    // Clean up on unmount
    return () => {
      unsubscribe();
      clearInterval(weatherAlertInterval);
      webSocketService.disconnect();
    };
  }, [dispatch]);

  return null;
};