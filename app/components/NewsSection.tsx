'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchNews } from '../redux/newsSlice';

export default function NewsSection() {
  const dispatch = useAppDispatch();
  const { items: newsItems, status, error } = useAppSelector(state => state.news);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNews());
    }

    // Refresh news every 30 minutes
    const interval = setInterval(() => {
      dispatch(fetchNews());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, status]);

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crypto News</h2>
      </div>

      {status === 'loading' && newsItems.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="space-y-4">
        {newsItems.map((news) => (
          <div key={news.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              {news.source} • {formatDate(news.publishedAt)}
            </p>
            <p className="text-gray-600 line-clamp-2">{news.description}</p>
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}