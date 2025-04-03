'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { markAllAsRead, clearAlerts } from '../redux/notificationsSlice';

export default function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { alerts, unreadCount } = useAppSelector(state => state.notifications);
  const dispatch = useAppDispatch();

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      dispatch(markAllAsRead());
    }
  };

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          CryptoWeather Nexus
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/favorites" className="hover:text-blue-300 transition-colors">
            Favorites
          </Link>
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="flex items-center hover:text-blue-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    onClick={() => dispatch(clearAlerts())}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </button>
                </div>
                
                {alerts.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <div>
                    {alerts.map(alert => (
                      <div key={alert.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        {alert.type === 'price_alert' ? (
                          <div>
                            <p className="text-sm font-medium">
                              {alert.crypto.charAt(0).toUpperCase() + alert.crypto.slice(1)} Price Alert
                            </p>
                            <p className="text-xs text-gray-500">
                              Price changed by {alert.percentageChange.toFixed(2)}% to ${alert.newPrice.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium">
                              {alert.city} Weather Alert
                            </p>
                            <p className="text-xs text-gray-500">
                              {alert.message}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                              alert.severity === 'info' ? 'bg-blue-100 text-blue-800' :
                              alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <button className="md:hidden flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}