'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchCryptosData, fetchCryptoHistoryData, toggleCryptoFavorite } from '../../redux/cryptoSlice';
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

export default function CryptoDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const cryptoId = params.id as string;
  
  const { data: cryptosData, history, status, error } = useAppSelector(state => state.crypto);
  const cryptoData = cryptosData.find(c => c.id === cryptoId);
  const cryptoHistory = history[cryptoId];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCryptosData());
    }
    
    // Fetch historical data for the cryptocurrency
    dispatch(fetchCryptoHistoryData(cryptoId));
  }, [dispatch, cryptoId, status]);

  // Format date for chart
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format currency with commas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format large numbers for market cap, etc.
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  // Prepare chart data
  const chartData = cryptoHistory ? {
    labels: cryptoHistory.prices.map(d => formatDate(d.timestamp)),
    datasets: [
      {
        label: 'Price (USD)',
        data: cryptoHistory.prices.map(d => d.price),
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
        text: 'Price History (Last 7 Days)',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
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
          {status === 'loading' && !cryptoData && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>Error: {error}</p>
            </div>
          )}
          
          {cryptoData && (
            <div>
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold mb-2">{cryptoData.name} ({cryptoData.symbol.toUpperCase()})</h1>
                      <button 
                        onClick={() => dispatch(toggleCryptoFavorite(cryptoData.id))}
                        className="ml-3 text-white hover:text-yellow-300 focus:outline-none"
                        aria-label={cryptoData.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {cryptoData.isFavorite ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-lg opacity-90">Last updated: {new Date(cryptoData.lastUpdated).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{formatCurrency(cryptoData.price)}</div>
                    <div className={`text-lg mt-1 ${cryptoData.priceChangePercentage24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {cryptoData.priceChangePercentage24h >= 0 ? '▲' : '▼'} {Math.abs(cryptoData.priceChangePercentage24h).toFixed(2)}% (24h)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Market Cap</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatLargeNumber(cryptoData.marketCap)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">24h Change</h3>
                    <p className={`text-2xl font-bold ${cryptoData.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cryptoData.priceChange24h)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Symbol</h3>
                    <p className="text-2xl font-bold text-gray-900">{cryptoData.symbol.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Price History</h2>
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
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Historical Data</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cryptoHistory?.prices.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(item.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(item.price)}
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