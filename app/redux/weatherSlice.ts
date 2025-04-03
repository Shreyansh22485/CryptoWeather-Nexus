import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, WeatherHistory, City } from '../types/weather';
import { fetchAllCitiesWeather, fetchWeatherHistory } from '../services/weatherService';

interface WeatherState {
  data: WeatherData[];
  history: Record<string, WeatherHistory>;
  cities: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  data: [],
  history: {},
  cities: [
    { id: 'new-york', name: 'New York', isFavorite: false },
    { id: 'london', name: 'London', isFavorite: false },
    { id: 'tokyo', name: 'Tokyo', isFavorite: false }
  ],
  status: 'idle',
  error: null
};

// Async thunks
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllCitiesWeather();
    } catch (error) {
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

export const fetchCityWeatherHistory = createAsyncThunk(
  'weather/fetchCityWeatherHistory',
  async (city: string, { rejectWithValue }) => {
    try {
      return await fetchWeatherHistory(city);
    } catch (error) {
      return rejectWithValue(`Failed to fetch weather history for ${city}`);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    toggleCityFavorite(state, action: PayloadAction<string>) {
      const cityId = action.payload;
      const city = state.cities.find(c => c.id === cityId);
      if (city) {
        city.isFavorite = !city.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch weather data
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<WeatherData[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch city weather history
      .addCase(fetchCityWeatherHistory.fulfilled, (state, action: PayloadAction<WeatherHistory>) => {
        const cityHistory = action.payload;
        state.history[cityHistory.city] = cityHistory;
      });
  }
});

export const { toggleCityFavorite } = weatherSlice.actions;

export default weatherSlice.reducer;