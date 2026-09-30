import { selectProfileOrders } from '@selectors';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchProfileOrders,
  setProfileOrdersFromSocket,
} from '@services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '@services/store';
import { getCookie } from '@utils/cookie';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  useEffect(() => {
    const token = getCookie('accessToken')?.replace('Bearer ', '');
    if (!token) return;

    const ws = new WebSocket(`wss://norma.education-services.ru/orders?token=${token}`);

    ws.onmessage = (event): void => {
      const data = JSON.parse(event.data as string) as {
        success: boolean;
        orders: TOrder[];
      };
      if (data.success) dispatch(setProfileOrdersFromSocket(data.orders));
    };

    return (): void => {
      ws.close();
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
