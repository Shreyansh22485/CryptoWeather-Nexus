import axios from 'axios';
import { WeatherData, WeatherHistory } from '../types/weather';

// Replace with your actual API key
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// List of cities we want to track
const CITIES = ['New York', 'London', 'Tokyo'];

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    
    return {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      conditions: data.weather[0].main,
      icon: data.weather[0].icon,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    throw error;
  }
};

export const fetchAllCitiesWeather = async (): Promise<WeatherData[]> => {
  try {
    const weatherPromises = CITIES.map(city => fetchWeatherData(city));
    return await Promise.all(weatherPromises);
  } catch (error) {
    console.error('Error fetching weather for all cities:', error);
    throw error;
  }
};

export const fetchWeatherHistory = async (city: string): Promise<WeatherHistory> => {
  try {
    // For demo purposes, we'll generate mock historical data
    // In a real app, you would use an API that provides historical data
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      temperature: 15 + Math.random() * 10, // Random temperature between 15-25
      timestamp: Date.now() - (23 - i) * 3600000, // Last 24 hours, hourly
    }));
    
    return {
      city,
      data: mockData,
    };
  } catch (error) {
    console.error(`Error fetching weather history for ${city}:`, error);
    throw error;
  }
};