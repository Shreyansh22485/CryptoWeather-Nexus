import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NewsItem } from '../types/news';
import { fetchCryptoNews } from '../services/newsService';

interface NewsState {
  items: NewsItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NewsState = {
  items: [],
  status: 'idle',
  error: null
};

// Async thunk for fetching news
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCryptoNews();
    } catch (_error) {
      return rejectWithValue('Failed to fetch crypto news');
    }
  }
);

// News slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default newsSlice.reducer;