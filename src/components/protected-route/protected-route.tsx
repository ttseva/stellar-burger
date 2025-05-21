import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { getIsAuthChecked } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement; // children — дочерний элемент, который будет отображён при выполнении условий
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const checkAuthenticated = useSelector(getIsAuthChecked);
  const user = useSelector((state) => state.user.data);

  // Если проверка авторизации ещё не завершена — показ прелоадера
  if (!checkAuthenticated) {
    return <Preloader />;
  }

  // Если маршрут требует авторизации, а пользователь не авторизован — редирект на страницу логина
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для НЕавторизованных, а пользователь уже авторизован — редирект на предыдущую страницу или на главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' }; // Куда перемещать
    const backgroundLocation = location.state?.from?.state || null; // Для поддержки background location для модалок
    return <Navigate replace to={from} state={{ backgroundLocation }} />;
  }

  return children;
};
