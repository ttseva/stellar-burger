import { userReducer, initialState, UserDto } from '../userSlice';
import { loginUser, registerUser, updateUser } from '../userSlice';

describe('userSlice reducer', () => {
  const testUser: UserDto = {
    email: 'test@example.com',
    name: 'Test User'
  };
  const errorMessage = 'Test error message';

  test('pending', () => {
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

  test('fulfilled', () => {
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

  test('rejected', () => {
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
        error: { message: 'Test error message' }
      })
    ).toEqual({
      ...initialState,
      statusRequest: 'Failed',
      error: 'Test error message'
    });
  });
});
