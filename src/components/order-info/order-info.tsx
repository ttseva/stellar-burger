import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { getIngredients } from '../../services/slices/ingredientSlice';
import { useParams } from 'react-router-dom';
import { orderNumberThunk } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { buns, mains, sauces } = useSelector(getIngredients);
  const ingredients: TIngredient[] = [...buns, ...mains, ...sauces];
  const feed = useSelector(getFeeds).feed?.orders || [];
  // Ищем заказ сначала в ленте
  const orderData = feed.find((item) => item.number === Number(number));
  const orderModalData = useSelector((state) => state.orders.orderModalData);

  useEffect(() => {
    // Если заказа нет в ленте, делаем запрос
    if (!orderData) {
      dispatch(orderNumberThunk(Number(number)));
    }
  }, [dispatch, orderData, number]);

  // Используем либо найденный заказ, либо заказ из orderModalData (после запроса)
  const currentOrder = orderData || orderModalData;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
