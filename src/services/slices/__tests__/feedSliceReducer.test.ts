import { feedReducer, initialState } from '../feedSlice';
import { feedThunk } from '../feedSlice';

describe('feedSlice reducer', () => {
  const testFeed = { orders: [], total: 0, totalToday: 0, success: true };
  const errorMessage = 'Test error message';

  test('pending', () => {
    expect(feedReducer(initialState, feedThunk.pending('', undefined))).toEqual(
      {
        ...initialState,
        loading: true,
        error: null
      }
    );
  });

  test('fulfilled', () => {
    expect(
      feedReducer(initialState, feedThunk.fulfilled(testFeed, '', undefined))
    ).toEqual({
      ...initialState,
      loading: false,
      error: null,
      feed: testFeed
    });
  });

  test('rejected', () => {
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
