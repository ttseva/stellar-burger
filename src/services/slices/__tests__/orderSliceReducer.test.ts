import { ordersReducer, initialState } from '../orderSlice';
import {
  feedThunk,
  ordersThunk,
  orderNumberThunk,
  orderBurgerThunk
} from '../orderSlice';

describe('Тесты редьюсеров слайса Заказов', () => {
  const testFeed = { orders: [], total: 0, totalToday: 0, success: true };
  const testOrder = {
    _id: '1',
    name: 'Test Order',
    ingredients: [],
    status: 'done',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-10',
    number: 1
  };
  const errorMessage = 'Тестовая ошибка!';

  test('Тест экшна pending Получения ленты заказов', () => {
    expect(
      ordersReducer(initialState, feedThunk.pending('', undefined))
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('Тест экшна fulfilled Получения ленты заказов', () => {
    expect(
      ordersReducer(initialState, feedThunk.fulfilled(testFeed, '', undefined))
    ).toEqual({
      ...initialState,
      loading: false,
      error: null,
      orders: testFeed.orders
    });
  });

  test('Тест экшна rejected Получения ленты заказов', () => {
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

  test('Тест экшна pending Получения всех заказов', () => {
    expect(
      ordersReducer(initialState, ordersThunk.pending('', undefined))
    ).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('Тест экшна fulfilled Получения всех заказов', () => {
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

  test('Тест экшна rejected Получения всех заказов', () => {
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

  test('Тест экшна pending Получения заказа по номеру', () => {
    expect(
      ordersReducer(initialState, orderNumberThunk.pending('', 1))
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('Тест экшна fulfilled Получения заказа по номеру', () => {
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

  test('Тест экшна rejected Получения заказа по номеру', () => {
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

  test('Тест экшна pending Создания заказа', () => {
    expect(
      ordersReducer(initialState, orderBurgerThunk.pending('', []))
    ).toEqual({
      ...initialState,
      orderRequest: true,
      loading: true,
      error: null
    });
  });

  test('Тест экшна fulfilled Создания заказа', () => {
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

  test('Тест экшна rejected Создания заказа', () => {
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
