import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

import type { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
  _id: '2',
  name: 'Моковая котлета',
  type: 'main',
  proteins: 15,
  fat: 25,
  carbohydrates: 5,
  calories: 150,
  price: 100,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile',
};

const mockMain2: TIngredient = {
  _id: '3',
  name: 'Второй ингредиент',
  type: 'main',
  proteins: 15,
  fat: 25,
  carbohydrates: 5,
  calories: 150,
  price: 100,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile',
};

describe('constructorSlice', () => {
  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('должен добавить булку и не добавлять её в список начинок', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));
    expect(state.bun?.name).toBe('Моковая булка');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен заменить булку при добавлении новой', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(
      state,
      addIngredient({ ...mockBun, _id: '9', name: 'Другая булка' })
    );
    expect(state.bun?.name).toBe('Другая булка');
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавить начинку', () => {
    const state = constructorReducer(undefined, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Моковая котлета');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен удалить ингредиент по id', () => {
    const stateWithItem = constructorReducer(undefined, addIngredient(mockMain));
    const itemId = stateWithItem.ingredients[0].id;
    const state = constructorReducer(stateWithItem, removeIngredient(itemId));
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен переместить ингредиент', () => {
    let state = constructorReducer(undefined, addIngredient(mockMain));
    state = constructorReducer(state, addIngredient(mockMain2));
    expect(state.ingredients[0].name).toBe('Моковая котлета');
    expect(state.ingredients[1].name).toBe('Второй ингредиент');

    state = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[0].name).toBe('Второй ингредиент');
    expect(state.ingredients[1].name).toBe('Моковая котлета');
  });

  it('должен очистить конструктор', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMain));
    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
