import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addIngredient } from '@services/slices/constructorSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.constructorBurger);

  const handleAdd = (): void => {
    dispatch(addIngredient(ingredient));
  };

  const currentCount =
    ingredient.type === 'bun'
      ? constructorItems.bun?._id === ingredient._id
        ? 1
        : 0
      : constructorItems.ingredients.filter((item) => item._id === ingredient._id)
          .length;

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={currentCount || count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
