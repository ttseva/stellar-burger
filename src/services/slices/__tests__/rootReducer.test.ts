import { rootReducer } from '../../store';
import { initialState as ingredientsInitialState } from '../ingredientSlice';
import { initialState as feedInitialState } from '../feedSlice';
import { initialState as userInitialState } from '../userSlice';
import { initialState as ordersInitialState } from '../orderSlice';
import { initialState as constructorInitialState } from '../constructorSlice';

const expectedInitialState = {
  ingredients: ingredientsInitialState,
  feed: feedInitialState,
  user: userInitialState,
  orders: ordersInitialState,
  constructorBurger: constructorInitialState
};

describe('Тест инициализации rootReducer', () => {
  test('Тест правильной настройки', () => {
    expect(rootReducer(undefined, { type: '@@INIT' })).toEqual(
      expectedInitialState
    );
    expect(
      rootReducer(expectedInitialState, { type: 'UNKNOWN_ACTION' })
    ).toEqual(expectedInitialState);
  });
});
