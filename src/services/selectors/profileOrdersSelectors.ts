import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.profileOrders.orders;
