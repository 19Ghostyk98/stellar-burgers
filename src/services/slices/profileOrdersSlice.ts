import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async () => await getOrdersApi()
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    setProfileOrdersFromSocket: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка истории заказов';
      });
  },
});

export const { setProfileOrdersFromSocket } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
