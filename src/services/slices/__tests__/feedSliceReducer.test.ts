import { feedReducer, initialState } from '../feedSlice';
import { feedThunk } from '../feedSlice';

describe('Тесты редьюсеров слайса Ленты заказов', () => {
  const testFeed = { orders: [], total: 0, totalToday: 0, success: true };
  const errorMessage = 'Тестовая ошибка!';

  test('Тест экшна pending Получения ленты заказов', () => {
    expect(feedReducer(initialState, feedThunk.pending('', undefined))).toEqual(
      {
        ...initialState,
        loading: true,
        error: null
      }
    );
  });

  test('Тест экшна fulfilled Получения ленты заказов', () => {
    expect(
      feedReducer(initialState, feedThunk.fulfilled(testFeed, '', undefined))
    ).toEqual({
      ...initialState,
      loading: false,
      error: null,
      feed: testFeed
    });
  });

  test('Тест экшна rejected Получения ленты заказов', () => {
    expect(
      feedReducer(initialState, {
        type: feedThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
