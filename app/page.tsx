"use client";

import styles from "./page.module.css";
import * as shlaami from 'rickmortyapi';
import type { Character } from 'rickmortyapi';
import { useEffect, useState, lazy } from "react";

const Profile = lazy(() => import('./components/Profile/Profile'));
const Favorites = lazy(() => import('./components/Favourites/Favourites'));
const FavouriteList = lazy(() => import('./components/FavouriteList/FavouriteList'));

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await shlaami.getCharacters();
        console.log('Fetched characters:', response);
        const characters = response?.data.results || [];
        console.log('Character data:', characters);
        setData(characters);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={`${styles.section} ${styles.wrapper}`}>
          <Profile data={data}/>
        </section>
        <section className={`${styles.section} ${styles.wrapperFavorites}`} >
          <Favorites />
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
