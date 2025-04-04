import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CryptoData, CryptoHistory } from '../types/crypto';
import { fetchAllCryptosData, fetchCryptoHistory } from '../services/cryptoService';

interface CryptoState {
  data: CryptoData[];
  history: Record<string, CryptoHistory>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CryptoState = {
  data: [],
  history: {},
  status: 'idle',
  error: null
};

// Async thunks
export const fetchCryptosData = createAsyncThunk(
  'crypto/fetchCryptosData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllCryptosData();
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to fetch cryptocurrency data');
    }
  }
);

export const fetchCryptoHistoryData = createAsyncThunk(
  'crypto/fetchCryptoHistoryData',
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchCryptoHistory(id);
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue(`Failed to fetch history for ${id}`);
    }
  }
);

// Slice for managing cryptocurrency data
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    toggleCryptoFavorite(state, action: PayloadAction<string>) {
      const cryptoId = action.payload;
      const crypto = state.data.find(c => c.id === cryptoId);
      if (crypto) {
        crypto.isFavorite = !crypto.isFavorite;
      }
    },
    updateCryptoPrice(state, action: PayloadAction<{ id: string, price: number }>) {
      const { id, price } = action.payload;
      const crypto = state.data.find(c => c.id === id);
      if (crypto) {
        const oldPrice = crypto.price;
        crypto.priceChange24h = price - oldPrice;
        crypto.priceChangePercentage24h = ((price - oldPrice) / oldPrice) * 100;
        crypto.price = price;
        crypto.lastUpdated = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cryptos data
      .addCase(fetchCryptosData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptosData.fulfilled, (state, action: PayloadAction<CryptoData[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCryptosData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch crypto history
      .addCase(fetchCryptoHistoryData.fulfilled, (state, action: PayloadAction<CryptoHistory>) => {
        const cryptoHistory = action.payload;
        state.history[cryptoHistory.id] = cryptoHistory;
      });
  }
});

export const { toggleCryptoFavorite, updateCryptoPrice } = cryptoSlice.actions;

export default cryptoSlice.reducer;