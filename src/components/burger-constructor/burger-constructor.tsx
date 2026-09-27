import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearConstructor } from '@services/slices/constructorSlice';
import { clearOrderModal, createOrder } from '@services/slices/orderSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector((state) => state.constructorBurger);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);
  const isAuth = useSelector((state) => Boolean(state.user.user));

  const onOrderClick = (): void => {
    if (!isAuth) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ids)).then(() => {
      void dispatch(clearConstructor());
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
