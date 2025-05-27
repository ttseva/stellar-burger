import { ordersReducer, initialState } from '../orderSlice';
import {
  feedThunk,
  ordersThunk,
  orderNumberThunk,
  orderBurgerThunk
} from '../orderSlice';

describe('orderSlice reducer', () => {
  const testFeed = { orders: [], total: 0, totalToday: 0, success: true };
  const testOrder = {
    _id: '1',
    name: 'Test Order',
    ingredients: [],
    status: 'done',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    number: 1
  };
  const errorMessage = 'Test error message';

  test('feedThunk pending', () => {
    expect(
      ordersReducer(initialState, feedThunk.pending('', undefined))
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('feedThunk fulfilled', () => {
    expect(
      ordersReducer(initialState, feedThunk.fulfilled(testFeed, '', undefined))
    ).toEqual({
      ...initialState,
      loading: false,
      error: null,
      orders: testFeed.orders
    });
  });

  test('feedThunk rejected', () => {
    expect(
      ordersReducer(initialState, {
        type: feedThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('ordersThunk pending', () => {
    expect(
      ordersReducer(initialState, ordersThunk.pending('', undefined))
    ).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('ordersThunk fulfilled', () => {
    expect(
      ordersReducer(
        initialState,
        ordersThunk.fulfilled([testOrder], '', undefined)
      )
    ).toEqual({
      ...initialState,
      orderRequest: false,
      loading: false,
      orders: [testOrder],
      error: null
    });
  });

  test('ordersThunk rejected', () => {
    expect(
      ordersReducer(initialState, {
        type: ordersThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('orderNumberThunk pending', () => {
    expect(
      ordersReducer(initialState, orderNumberThunk.pending('', 1))
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('orderNumberThunk fulfilled', () => {
    expect(
      ordersReducer(
        initialState,
        orderNumberThunk.fulfilled(
          { orders: [testOrder], success: true },
          '',
          1
        )
      )
    ).toEqual({
      ...initialState,
      loading: false,
      orderModalData: testOrder,
      error: null
    });
  });

  test('orderNumberThunk rejected', () => {
    expect(
      ordersReducer(initialState, {
        type: orderNumberThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  test('orderBurgerThunk pending', () => {
    expect(
      ordersReducer(initialState, orderBurgerThunk.pending('', []))
    ).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('orderBurgerThunk fulfilled', () => {
    expect(
      ordersReducer(
        initialState,
        orderBurgerThunk.fulfilled(
          { order: testOrder, name: 'Test Order', success: true },
          '',
          []
        )
      )
    ).toEqual({
      ...initialState,
      orderRequest: false,
      orderModalData: testOrder,
      error: null,
      loading: false
    });
  });

  test('orderBurgerThunk rejected', () => {
    expect(
      ordersReducer(initialState, {
        type: orderBurgerThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      orderRequest: false,
      loading: false,
      error: errorMessage
    });
  });
});
