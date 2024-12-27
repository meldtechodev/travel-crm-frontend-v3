import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../apiConfig/config';

// Thunk for fetching users
export const fetchCountry = createAsyncThunk('country/fetchCountry', async () => {
  const response = await axios.get(`${api.baseUrl}/country/getallcountry`);
  return response.data;
});

const countrySlice = createSlice({
  name: 'country',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default countrySlice.reducer;
