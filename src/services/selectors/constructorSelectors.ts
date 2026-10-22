import type { RootState } from '@services/store';
import type { TConstructorState } from '@utils-types';

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.constructorBurger;
