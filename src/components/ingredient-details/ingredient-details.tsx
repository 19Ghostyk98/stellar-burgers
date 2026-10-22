import { IngredientDetailsUI, Preloader } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredient = useSelector((state) =>
    state.ingredients.items.find((item) => item._id === id)
  );

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
