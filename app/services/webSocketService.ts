import { CryptoPriceAlert } from '../types/crypto';
import { WeatherAlert } from '../types/weather';

type AlertCallback = (alert: CryptoPriceAlert | WeatherAlert) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private alertCallbacks: AlertCallback[] = [];
  private isConnected = false;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    try {
      // Connect to CoinCap WebSocket for BTC and ETH price updates
      this.socket = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum');
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;
        
        // Clear any reconnect timer
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
      
      this.socket.onmessage = this.onMessage;
      this.socket.onerror = this.onError;
      this.socket.onclose = this.onClose;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  public subscribe(callback: AlertCallback): () => void {
    this.alertCallbacks.push(callback);
    
    // Return an unsubscribe function
    return () => {
      this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback);
    };
  }

  private onMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      // Process cryptocurrency price updates
      if (data.bitcoin || data.ethereum) {
        Object.entries(data).forEach(([crypto, price]) => {
          // Create a price alert if the change is significant (e.g., > 0.5%)
          // In a real app, you would compare with previous prices
          const mockPreviousPrice = Number(price) * (1 - (Math.random() * 0.02));
          const percentageChange = ((Number(price) - mockPreviousPrice) / mockPreviousPrice) * 100;
          
          if (Math.abs(percentageChange) > 0.5) {
            const alert: CryptoPriceAlert = {
              id: `price-alert-${crypto}-${Date.now()}`,
              type: 'price_alert',
              crypto,
              oldPrice: mockPreviousPrice,
              newPrice: Number(price),
              percentageChange,
              timestamp: Date.now(),
            };
            
            // Notify all subscribers
            this.alertCallbacks.forEach(callback => callback(alert));
          }
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  private onError(error: Event): void {
    console.error('WebSocket error:', error);
    this.isConnected = false;
  }

  private onClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    this.isConnected = false;
    this.socket = null;
    
    // Attempt to reconnect
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        this.connect();
      }, 5000); // Try to reconnect after 5 seconds
    }
  }

  // Simulate weather alerts
  public simulateWeatherAlert(city: string): void {
    const severities: Array<'info' | 'warning' | 'danger'> = ['info', 'warning', 'danger'];
    const messages = [
      'Heavy rain expected',
      'High winds advisory',
      'Extreme heat warning',
      'Flash flood warning',
      'Thunderstorm expected',
    ];
    
    const alert: WeatherAlert = {
      id: `weather-alert-${city}-${Date.now()}`,
      type: 'weather_alert',
      city,
      message: messages[Math.floor(Math.random() * messages.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: Date.now(),
    };
    
    // Notify all subscribers
    this.alertCallbacks.forEach(callback => callback(alert));
  }
}

// Export as a singleton
const webSocketService = new WebSocketService();
export default webSocketService;