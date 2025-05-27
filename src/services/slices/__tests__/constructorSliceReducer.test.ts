import { constructorReducer, initialState } from '../constructorSlice';
import { addItems, removeItems, moveItems } from '../constructorSlice';

describe('Тесты редьюсеров слайса Конструктора', () => {
  const testIngredient = {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
    __v: 0
  };

  test('Тест экшна добавления ингредиента', () => {
    const action = addItems(testIngredient);
    const newState = constructorReducer(initialState, action);
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(
      expect.objectContaining({ ...testIngredient, id: expect.any(String) })
    );
  });

  test('Тест экшна удаления ингредиента', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [{ ...testIngredient, id: '643d69a5c3f7b9001cfa0948' }]
    };
    const action = removeItems(testIngredient);
    const newState = constructorReducer(stateWithIngredient, action);
    expect(newState.ingredients).toHaveLength(0);
  });

  test('Тест экшна перемещения ингредиента вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...testIngredient, id: 'id1' },
        { ...testIngredient, id: 'id2' }
      ]
    };
    const action = moveItems({ index: 1, direction: 'up' });
    const newState = constructorReducer(stateWithIngredients, action);
    expect(newState.ingredients[0].id).toBe('id2');
    expect(newState.ingredients[1].id).toBe('id1');
  });

  test('Тест экшна перемещения ингредиента вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...testIngredient, id: 'id1' },
        { ...testIngredient, id: 'id2' }
      ]
    };
    const action = moveItems({ index: 0, direction: 'down' });
    const newState = constructorReducer(stateWithIngredients, action);
    expect(newState.ingredients[0].id).toBe('id2');
    expect(newState.ingredients[1].id).toBe('id1');
  });
});
