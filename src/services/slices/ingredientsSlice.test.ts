import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Моковая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 100,
    price: 50,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile',
  },
  {
    _id: '2',
    name: 'Моковый соус',
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 20,
    price: 30,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile',
  },
];

const initialState = {
  items: [],
  isLoading: false,
  error: null as string | null,
};

describe('ingredientsSlice', () => {
  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('должен установить isLoading=true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить данные при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ошибку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' },
    };
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
