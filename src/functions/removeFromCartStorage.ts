import { Phone } from '../types/Phone';

export const removeFromCartStorage = (
  product: Phone | null,
  setIsAddedToCart?: React.Dispatch<React.SetStateAction<boolean>>,
) => () => {
  const storage = JSON.parse(localStorage.getItem('cart') || '[]');

  const index = storage.findIndex(({ id }: { id: string }) => (
    product?.id === id
  ));

  storage.splice(index, 1);

  if (setIsAddedToCart) {
    setIsAddedToCart(false);
  }

  localStorage.setItem('cart', JSON.stringify(storage));

  return storage;
};
