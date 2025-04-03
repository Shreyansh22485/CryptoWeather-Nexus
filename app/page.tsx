'use client';

import Header from './components/Header';
import WeatherSection from './components/WeatherSection';
import CryptoSection from './components/CryptoSection';
import NewsSection from './components/NewsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">CryptoWeather Nexus Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <WeatherSection />
          <CryptoSection />
          <NewsSection />
        </div>
      </div>
    </main>
  );
}
