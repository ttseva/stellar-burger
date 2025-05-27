import { userReducer, initialState, UserDto } from '../userSlice';
import {
  loginUser,
  registerUser,
  updateUser,
  checkUserAuth,
  logoutUser
} from '../userSlice';

describe('Тесты редьюсеров слайса Пользователей', () => {
  const testUser: UserDto = {
    email: 'test@test.ru',
    name: 'test_user'
  };
  const errorMessage = 'Тестовая ошибка!';

  test('Тесты экшнов pending', () => {
    expect(
      userReducer(
        initialState,
        loginUser.pending('', { email: '', password: '' })
      )
    ).toEqual({
      ...initialState,
      statusRequest: 'Loading'
    });

    expect(
      userReducer(
        initialState,
        registerUser.pending('', { email: '', name: '', password: '' })
      )
    ).toEqual({
      ...initialState,
      statusRequest: 'Loading'
    });

    expect(
      userReducer(initialState, updateUser.pending('', { email: '', name: '' }))
    ).toEqual({
      ...initialState,
      statusRequest: 'Loading'
    });
  });

  test('Тесты экшнов fulfilled', () => {
    expect(
      userReducer(
        initialState,
        loginUser.fulfilled(testUser, '', { email: '', password: '' })
      )
    ).toEqual({
      ...initialState,
      data: testUser,
      statusRequest: 'Success'
    });

    expect(
      userReducer(
        initialState,
        registerUser.fulfilled(testUser, '', {
          email: '',
          name: '',
          password: ''
        })
      )
    ).toEqual({
      ...initialState,
      data: testUser,
      statusRequest: 'Success'
    });

    expect(
      userReducer(
        initialState,
        updateUser.fulfilled(testUser, '', { email: '', name: '' })
      )
    ).toEqual({
      ...initialState,
      data: testUser,
      statusRequest: 'Success'
    });
  });

  test('Тесты экшнов rejected', () => {
    expect(
      userReducer(
        initialState,
        loginUser.rejected(new Error(errorMessage), '', {
          email: '',
          password: ''
        })
      )
    ).toEqual({
      ...initialState,
      statusRequest: 'Failed'
    });

    expect(
      userReducer(
        initialState,
        registerUser.rejected(new Error(errorMessage), '', {
          email: '',
          name: '',
          password: ''
        })
      )
    ).toEqual({
      ...initialState,
      statusRequest: 'Failed'
    });

    expect(
      userReducer(initialState, {
        type: updateUser.rejected.type,
        error: { message: 'Тестовая ошибка!' }
      })
    ).toEqual({
      ...initialState,
      statusRequest: 'Failed',
      error: 'Тестовая ошибка!'
    });
  });

  test('Тест экшна fulfilled Проверки авторизации', () => {
    const action = checkUserAuth.fulfilled(undefined, '');
    const newState = userReducer(initialState, action);
    expect(newState.statusRequest).toBe('Success');
  });

  test('Тест экшна fulfilled Регистрации', () => {
    const action = registerUser.fulfilled(testUser, '', {
      email: 'test@test.ru',
      name: 'test_user',
      password: 'password'
    });
    const newState = userReducer(initialState, action);
    expect(newState.data).toEqual(testUser);
    expect(newState.statusRequest).toBe('Success');
  });

  test('Тест экшна fulfilled Входа', () => {
    const action = loginUser.fulfilled(testUser, '', {
      email: 'test@test.ru',
      password: 'password'
    });
    const newState = userReducer(initialState, action);
    expect(newState.data).toEqual(testUser);
    expect(newState.statusRequest).toBe('Success');
  });

  test('Тест экшна fulfilled Выхода', () => {
    const action = logoutUser.fulfilled(undefined, '');
    const newState = userReducer(initialState, action);
    expect(newState.isAuth).toBe(false);
    expect(newState.data).toBeNull();
    expect(newState.statusRequest).toBe('Success');
  });

  test('Тест экшна fulfilled Обновления пользователя', () => {
    const action = updateUser.fulfilled(testUser, '', {
      email: 'test@test.ru',
      name: 'test_user'
    });
    const newState = userReducer(initialState, action);
    expect(newState.data).toEqual(testUser);
    expect(newState.statusRequest).toBe('Success');
  });

  test('Тест экшна rejected Обновления пользователя', () => {
    const errorMessage = 'Ошибка обновления данных пользователя';
    const action = updateUser.rejected(new Error(errorMessage), '', {
      email: 'test@test.ru',
      name: 'test_user'
    });
    const newState = userReducer(initialState, action);
    expect(newState.statusRequest).toBe('Failed');
    expect(newState.error).toBe(errorMessage);
  });

  test('Тест экшна Проверка авторизации', () => {
    const state = { ...initialState, isAuth: false };
    const action = { type: 'user/authCheck' };
    const newState = userReducer(state, action);
    expect(newState.isAuth).toBe(true);
  });

  test('Тест экшна Выход', () => {
    const state = {
      ...initialState,
      isAuth: true,
      data: { email: 'test@test.ru', name: 'test_user' }
    };
    const action = { type: 'user/logout' };
    const newState = userReducer(state, action);
    expect(newState.isAuth).toBe(false);
    expect(newState.data).toBeNull();
  });

  test('Тест экшна checkUser', () => {
    const state = { ...initialState, data: null };
    const user = { email: 'test@test.ru', name: 'test_user' };
    const action = { type: 'user/checkUser', payload: user };
    const newState = userReducer(state, action);
    expect(newState.data).toEqual(user);
  });

  test('Тест неизвестного экшна (не изменяет состояние)', () => {
    const state = { ...initialState };
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = userReducer(state, action);
    expect(newState).toEqual(state);
  });
});
