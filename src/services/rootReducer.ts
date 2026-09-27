import { combineReducers } from '@reduxjs/toolkit';

import constructorBurger from './slices/constructorSlice';
import feed from './slices/feedSlice';
import ingredients from './slices/ingredientsSlice';
import order from './slices/orderSlice';
import profileOrders from './slices/profileOrdersSlice';
import user from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients,
  constructorBurger,
  order,
  user,
  feed,
  profileOrders,
});
