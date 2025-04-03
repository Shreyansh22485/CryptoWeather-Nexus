import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoPriceAlert } from '../types/crypto';
import { WeatherAlert } from '../types/weather';

type Alert = CryptoPriceAlert | WeatherAlert;

interface NotificationsState {
  alerts: Alert[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  alerts: [],
  unreadCount: 0
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<Alert>) {
      // Add new alert at the beginning of the array
      state.alerts.unshift(action.payload);
      
      // Limit alerts to 20 to avoid memory issues
      if (state.alerts.length > 20) {
        state.alerts = state.alerts.slice(0, 20);
      }
      
      // Increment unread count
      state.unreadCount += 1;
    },
    markAllAsRead(state) {
      state.unreadCount = 0;
    },
    clearAlerts(state) {
      state.alerts = [];
      state.unreadCount = 0;
    }
  }
});

export const { addAlert, markAllAsRead, clearAlerts } = notificationsSlice.actions;

export default notificationsSlice.reducer;