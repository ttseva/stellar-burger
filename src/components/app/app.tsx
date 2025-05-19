import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

// Вспомогательная функция для проверки авторизации (пример: по токену)
const isAuth = Boolean(localStorage.getItem('accessToken'));

// Компонент защищённого роута для неавторизованных
const ProtectedRoute = ({ children }: { children: JSX.Element }) =>
  !isAuth ? children : <Navigate to='/' replace />;
const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
