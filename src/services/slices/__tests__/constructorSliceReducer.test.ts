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

  describe('Тесты добавления ингредиентов', () => {
    test('Добавление первого ингредиента', () => {
      const action = addItems(testIngredient);
      const newState = constructorReducer(initialState, action);
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(
        expect.objectContaining({ ...testIngredient, id: expect.any(String) })
      );
    });

    test('Добавление нескольких ингредиентов', () => {
      let state = initialState;
      state = constructorReducer(state, addItems(testIngredient));
      state = constructorReducer(state, addItems(testIngredient));
      
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
      expect(state.ingredients[0]).toEqual(
        expect.objectContaining({ ...testIngredient, id: expect.any(String) })
      );
      expect(state.ingredients[1]).toEqual(
        expect.objectContaining({ ...testIngredient, id: expect.any(String) })
      );
    });

    test('Добавление ингредиента в непустой список', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [{ ...testIngredient, id: 'existing-id' }]
      };
      const action = addItems(testIngredient);
      const newState = constructorReducer(stateWithIngredient, action);
      
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].id).toBe('existing-id');
      expect(newState.ingredients[1]).toEqual(
        expect.objectContaining({ ...testIngredient, id: expect.any(String) })
      );
    });
  });

  describe('Тесты удаления ингредиентов', () => {
    test('Удаление единственного ингредиента', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [{ ...testIngredient, id: 'test-id' }]
      };
      const action = removeItems({ ...testIngredient, id: 'test-id' });
      const newState = constructorReducer(stateWithIngredient, action);
      expect(newState.ingredients).toHaveLength(0);
    });

    test('Удаление ингредиента из середины списка', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...testIngredient, id: 'id1' },
          { ...testIngredient, id: 'id2' },
          { ...testIngredient, id: 'id3' }
        ]
      };
      const action = removeItems({ ...testIngredient, id: 'id2' });
      const newState = constructorReducer(stateWithIngredients, action);
      
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0].id).toBe('id1');
      expect(newState.ingredients[1].id).toBe('id3');
    });

    test('Попытка удаления несуществующего ингредиента', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [{ ...testIngredient, id: 'existing-id' }]
      };
      const action = removeItems({ ...testIngredient, id: 'non-existing-id' });
      const newState = constructorReducer(stateWithIngredient, action);
      
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('existing-id');
    });
  });

  describe('Тесты перемещения ингредиентов', () => {
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
});
