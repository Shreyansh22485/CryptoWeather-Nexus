'use client';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useWebSocket } from './hooks/useWebSocket';

// Component to handle WebSocket connection
const WebSocketHandler = () => {
  useWebSocket();
  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WebSocketHandler />
      {children}
    </Provider>
  );
}