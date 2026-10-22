import { selectFeedOrders } from '@selectors';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeed, setFeedFromSocket } from '@services/slices/feedSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  useEffect(() => {
    const ws = new WebSocket('wss://norma.education-services.ru/orders/all');

    ws.onmessage = (event): void => {
      const data = JSON.parse(event.data as string) as {
        success: boolean;
        orders: TOrder[];
        total: number;
        totalToday: number;
      };
      if (data.success) {
        dispatch(
          setFeedFromSocket({
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday,
          })
        );
      }
    };

    return (): void => {
      ws.close();
    };
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
