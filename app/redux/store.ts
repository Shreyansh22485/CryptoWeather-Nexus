import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import cryptoReducer from './cryptoSlice';
import newsReducer from './newsSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;