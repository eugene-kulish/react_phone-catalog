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

const title = 'Mobile phones';

export const PhonesPage = () => {
  const [phones, setPhones] = useState<Phone[] | null>(null);
  const [visiblePhones, setVisiblePhones] = useState<Phone[] | null>(null);
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
        setPhones(products.filter(
          product => product.category === 'phones',
        ));
      })
      .catch(() => {
        throw new Error('Loading phones error');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const filteredProducts = phones?.filter(product => (
      product.name.trim().toLowerCase().includes(query.toLowerCase())
    ));

    setVisiblePhones(filteredProducts || []);

    setIsNoSearchResults(!filteredProducts?.length && !!phones?.length);
  }, [query, phones]);

  return (
    <Content
      isNoSearchResults={isNoSearchResults}
      products={visiblePhones}
      isLoading={isLoading}
      title={title}
    />
  );
};