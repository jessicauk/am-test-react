"use client";

import styles from "./page.module.css";
import * as shlaami from 'rickmortyapi';
import type { Character } from './lib/types';
import { useEffect, useState, lazy } from "react";
import type { AppDispatch } from '../app/lib/store';
import { useDispatch } from "react-redux";
import {
  setSelectedCharacter
} from "./lib/features/selected/selectedSlice";

const Profile = lazy(() => import('./components/Profile/Profile'));
const Favorites = lazy(() => import('./components/Favourites/Favourites'));
const FavouriteList = lazy(() => import('./components/FavouriteList/FavouriteList'));

export default function Home() {
  const [data, setData] = useState<Character[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await shlaami.getCharacters();
        console.log('Fetched characters:', response);
        const characters = response?.data.results || [];
        console.log('Character data:', characters);
        setData(characters.map((char) => ({
          ...char,
          isAlive: char.status === 'Alive',
        })));
        if (characters.length > 0) {
          setSelectedCharacter(characters[0]);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setSelectedCharacter({...data[0], isAlive: data[0].status === 'Alive'}) );
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
