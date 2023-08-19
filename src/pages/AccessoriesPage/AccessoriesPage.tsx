import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getPhones } from '../../functions/getPhones';

import { Phone } from '../../types/Phone';
import { Content } from '../../components/Content';

import {
  HandleCartStorageContext,
} from '../../contexts/HandleCartStorageContext';
import {
  HandleFavouritesStorageContext,
} from '../../contexts/HandleFavouritesStorageContext';

const title = 'Accessories';

export const AccessoriesPage = () => {
  const [accessories, setAccessories] = useState<Phone[] | null>(null);
  const [
    visibleAccessories,
    setVisibleAccessories,
  ] = useState<Phone[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoSearchResults, setIsNoSearchResults] = useState(false);

  const setCartStorage = useContext(HandleCartStorageContext);
  const setFavouritesStorage = useContext(HandleFavouritesStorageContext);

  const [searchParams] = useSearchParams();

  const query = searchParams.get('query')?.split('+').join(' ') || '';

  useEffect(() => {
    setIsLoading(true);

    setCartStorage(JSON.parse(localStorage.getItem('cart') || '[]'));
    setFavouritesStorage(
      JSON.parse(localStorage.getItem('favourites') || '[]'),
    );

    getPhones()
      .then((products: Phone[]) => {
        setAccessories(products.filter(
          product => product.category === 'accessories',
        ));
      })
      .catch(() => {
        throw new Error('Loading phones error');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const filteredProducts = accessories?.filter(product => (
      product.name.trim().toLowerCase().includes(query.toLowerCase())
    ));

    setVisibleAccessories(filteredProducts || []);

    setIsNoSearchResults(!filteredProducts?.length && !!accessories?.length);
  }, [query, accessories]);

  return (
    <Content
      isNoSearchResults={isNoSearchResults}
      products={visibleAccessories}
      isLoading={isLoading}
      title={title}
    />
  );
};