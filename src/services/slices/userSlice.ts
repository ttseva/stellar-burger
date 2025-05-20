/**
 * данные профиля пользователя
 */

import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected
} from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { RootState } from '../store';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const sliceName = 'user';

const enum StatusRequest {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

export type UserDto = {
  email: string;
  name: string;
};

export interface TUserState {
  isAuth: boolean;
  data: UserDto | null;
  statusRequest: StatusRequest;
  error?: string | null | undefined;
}

const initialState: TUserState = {
  isAuth: false,
  data: null,
  statusRequest: StatusRequest.Idle,
  error: null
};

/**
 * Проверка авторизации пользователя
 */
export const checkUserAuth = createAsyncThunk(
  `${sliceName}/checkUserAuth`,
  async (_, { dispatch }) => {
    // Проверка наличия accessToken в cookie
    if (getCookie('accessToken')) {
      getUserApi()
        .then((response) => {
          // Сохранение пользователя в store
          dispatch(checkUser(response.user));
        })
        .finally(() => {
          // Проверка авторизации завершена
          dispatch(authCheck());
        });
    } else {
      dispatch(authCheck());
    }
  }
);

/**
 * Регистрация
 */
export const registerUser = createAsyncThunk<UserDto, TRegisterData>(
  `${sliceName}/registerUser`,
  async (dataUser, { rejectWithValue }) => {
    // Отправка данных пользователя на сервер для регистрации
    const data = await registerUserApi(dataUser);
    // Если регистрация неуспешна - ошибка
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

/**
 * Вход
 */
export const loginUser = createAsyncThunk<UserDto, TLoginData>(
  `${sliceName}/loginUser`,
  async (dataUser, { rejectWithValue }) => {
    // Отправка данных пользователя на сервер для входа
    const data = await loginUserApi(dataUser);
    // Если вход неуспешен - ошибка
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

/**
 * Обновление данных
 */
export const updateUser = createAsyncThunk<UserDto, Partial<UserDto>>(
  `${sliceName}/updateUser`,
  async (userData) => {
    // Отправка обновлённых данных пользователя на сервер
    const data = await updateUserApi(userData);
    return data.user;
  }
);

/**
 * Выход
 */
export const logoutUser = createAsyncThunk<void, void>(
  `${sliceName}/logoutUser`,
  async (_, { dispatch }) => {
    // Запрос на сервер для выхода пользователя
    await logoutApi().then(() => {
      // Удалние  accessToken и refreshToken
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      // Вызов экшена выхода пользователя
      dispatch(logout());
    });
  }
);

export const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    /** Авторизация подтверждена */
    authCheck: (state) => {
      state.isAuth = true;
    },
    /** Выход  */
    logout: (state) => {
      state.isAuth = false;
    },
    /** Установка данных пользователя */
    checkUser: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      /** Проверка авторизации */
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.statusRequest = StatusRequest.Success;
      })
      /** Регистрация  */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      /** Вход */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      /** Выход */
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.data = null;
        state.statusRequest = StatusRequest.Success;
      })
      /** Обновление данных */
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      /** Ошибка обновления данных  */
      .addCase(updateUser.rejected, (state, action) => {
        state.statusRequest = StatusRequest.Failed;
        state.error =
          action.error.message || 'Ошибка обновления данных пользователя';
      })
      /** Любой pending экшен */
      .addMatcher(isPending, (state) => {
        state.statusRequest = StatusRequest.Loading;
      })
      /** Любой rejected экшен */
      .addMatcher(isRejected, (state) => {
        state.statusRequest = StatusRequest.Failed;
      });
  }
});

export const { authCheck, logout, checkUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const getUser = (state: RootState) => state.user.data;
export const getIsAuthChecked = (state: RootState) =>
  state.user.statusRequest !== StatusRequest.Idle;
export const getRegisteredUser = (state: RootState) => state.user.data;
export const getLoggedInUser = (state: RootState) => {
  const user = state.user.data;
  const isAuth = state.user.isAuth;

  return isAuth ? user : null;
};
