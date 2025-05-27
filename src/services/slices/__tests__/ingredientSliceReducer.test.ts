import { ingredientsReducer, initialState } from '../ingredientSlice';
import { ingredientsThunk } from '../ingredientSlice';

describe('Тесты редьюсеров слайса Ингредиентов', () => {
  const testIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      __v: 0
    }
  ];
  const errorMessage = 'Тестовая ошибка!';

  test('Тест экшна pending Получения ингредиентов', () => {
    expect(
      ingredientsReducer(initialState, ingredientsThunk.pending('', undefined))
    ).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('Тест экшна fulfilled Получения ингредиентов', () => {
    expect(
      ingredientsReducer(
        initialState,
        ingredientsThunk.fulfilled(testIngredients, '', undefined)
      )
    ).toEqual({
      ...initialState,
      loading: false,
      error: null,
      buns: [testIngredients[0]],
      mains: [testIngredients[1]],
      sauces: [testIngredients[2]]
    });
  });

  test('Тест экшна rejected Получения ингредиентов', () => {
    expect(
      ingredientsReducer(initialState, {
        type: ingredientsThunk.rejected.type,
        error: { message: errorMessage }
      })
    ).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
