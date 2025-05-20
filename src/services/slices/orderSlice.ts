/**
 * данные создания заказа
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

import { TOrder } from '@utils-types';

type OrdersState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  loading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
  loading: false
};

/**
 * Получение ленты заказов
 */
export const feedThunk = createAsyncThunk('feed/feedThunk', async () => {
  const data = await getFeedsApi();
  return data;
});

/**
 * Получение всех заказов
 */
export const ordersThunk = createAsyncThunk('orders/orders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

/**
 * Получение заказа по номеру
 */
export const orderNumberThunk = createAsyncThunk(
  'orders/orderNumber',
  async (number: number) => {
    const order = getOrderByNumberApi(number);
    return order;
  }
);

/**
 * Создание нового заказа
 */
export const orderBurgerThunk = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => {
    const order = await orderBurgerApi(data);
    return order;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    close: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /** Лента заказов */
      .addCase(feedThunk.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = null;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      /** Все заказы */
      .addCase(ordersThunk.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(ordersThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(ordersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      /** Заказ по номеру */
      .addCase(orderNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.orders[0];
        state.error = null;
      })
      .addCase(orderNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      /** Создание заказа */
      .addCase(orderBurgerThunk.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.error = null;
        state.loading = false;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export const { close } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
