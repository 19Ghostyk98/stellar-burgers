import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;
