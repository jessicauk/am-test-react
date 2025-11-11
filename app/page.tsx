"use client";

import styles from "./page.module.css";
import * as shlaami from 'rickmortyapi';
import type { CharacterItem } from './lib/types';
import { useEffect, useState, lazy } from "react";
import type { AppDispatch } from '../app/lib/store';
import { useDispatch } from "react-redux";
import {
  setSelectedCharacter
} from "./lib/features/selected/selectedSlice";
import { addFavorites, clearFavorites } from "./lib/features/favorites/favoritesSlice";

const Profile = lazy(() => import('./components/Profile/Profile'));
const Favorites = lazy(() => import('./components/Favourites/Favourites'));
const FavouriteList = lazy(() => import('./components/FavouriteList/FavouriteList'));

export default function Home() {
  const [data, setData] = useState<CharacterItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await shlaami.getCharacters();
        console.log('Fetched characters:', response);
        const characters = response?.data.results || [];
        console.log('Character data:', characters);
        
        
        if (characters.length > 0) {
          const formattedData = characters.map((char) => ({
            ...char,
            isAlive: char.status === 'Alive',
            isFavorite: false,
          }));
          console.log('Formatted character data:', formattedData);
          setData(formattedData);
          dispatch(clearFavorites());
          dispatch(addFavorites(formattedData));
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const firstCharacter = data[0];
      dispatch(setSelectedCharacter({ ...firstCharacter }) );
    }
  }, [data, dispatch]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={`${styles.section} ${styles.wrapper}`}>
          <Profile />
        </section>
        <section className={`${styles.section} ${styles.wrapperFavorites}`} >
          <Favorites data={data}/>
        </section>
        <section className={`${styles.section} ${styles.wrapperButton}`}>
          <div className={`${styles.listWrapper}`}>
            <FavouriteList />
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.button}>FAVS</button>
          </div>
        </section>
      </main>
    </div>
  );
}
