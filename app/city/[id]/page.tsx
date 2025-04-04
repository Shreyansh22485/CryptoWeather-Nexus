'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchWeatherData, fetchCityWeatherHistory } from '../../redux/weatherSlice';
import Header from '../../components/Header';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CityDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const cityId = params.id as string;
  const cityName = cityId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const { data: weatherData, history, status, error } = useAppSelector(state => state.weather);
  const cityWeather = weatherData.find(w => w.city.toLowerCase() === cityName.toLowerCase());
  const cityHistory = history[cityName];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWeatherData());
    }
    
    // Fetch historical data for the city
    dispatch(fetchCityWeatherHistory(cityName));
  }, [dispatch, cityName, status]);

  // Format timestamp to readable format
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date to readable format
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Prepare chart data
  const chartData = cityHistory ? {
    labels: cityHistory.data.map(d => formatTime(d.timestamp)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: cityHistory.data.map(d => d.temperature),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Temperature History (Last 24 Hours)',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {status === 'loading' && !cityWeather && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>Error: {error}</p>
            </div>
          )}
          
          {cityWeather && (
            <div>
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{cityWeather.city}</h1>
                    <p className="text-lg opacity-90">{formatDate(cityWeather.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold">{Math.round(cityWeather.temperature)}°C</div>
                    <div className="flex items-center justify-end mt-1">
                      <p className="text-xl mr-2">{cityWeather.conditions}</p>
                      <img 
                        src={`https://openweathermap.org/img/wn/${cityWeather.icon}@2x.png`} 
                        alt={cityWeather.conditions}
                        className="w-14 h-14"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-gray-900">{cityWeather.humidity}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Feels Like</h3>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(cityWeather.temperature - 1)}°C</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Last Updated</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(cityWeather.timestamp)}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Temperature History</h2>
                  {chartData ? (
                    <div className="h-80">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-80 bg-gray-50 rounded-lg">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Hourly Forecast</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Temperature
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cityHistory?.data.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatTime(item.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Math.round(item.temperature)}°C
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}