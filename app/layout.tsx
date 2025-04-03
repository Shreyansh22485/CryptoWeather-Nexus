import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './Providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CryptoWeather Nexus',
  description: 'A dashboard combining weather data, cryptocurrency information, and real-time notifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
