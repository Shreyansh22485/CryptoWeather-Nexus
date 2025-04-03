'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchWeatherData, toggleCityFavorite } from '../redux/weatherSlice';

export default function WeatherSection() {
  const dispatch = useAppDispatch();
  const { data: weatherData, status, error, cities } = useAppSelector(state => state.weather);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWeatherData());
    }

    // Refresh weather data every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchWeatherData());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, status]);

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weather</h2>
        <Link href="/cities" className="text-blue-600 hover:text-blue-800 text-sm">
          View All Cities
        </Link>
      </div>

      {status === 'loading' && weatherData.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData.map((weather) => {
          const city = cities.find(c => c.name === weather.city);
          return (
            <div key={weather.city} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{weather.city}</h3>
                  <div className="flex items-center mt-1">
                    <div className="text-3xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                      alt={weather.conditions}
                      className="w-12 h-12 ml-2"
                    />
                  </div>
                  <p className="text-gray-600">{weather.conditions}</p>
                  <p className="text-gray-500 text-sm mt-2">Humidity: {weather.humidity}%</p>
                </div>
                <button 
                  onClick={() => dispatch(toggleCityFavorite(city?.id || ''))}
                  className="text-gray-400 hover:text-yellow-500 focus:outline-none"
                  aria-label={city?.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {city?.isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-4">
                <Link 
                  href={`/city/${weather.city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}