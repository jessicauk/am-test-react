"use client";

import styles from "./page.module.css";
import * as shlaami from 'rickmortyapi';
import type { Character } from 'rickmortyapi';
import { useEffect, useState, lazy } from "react";

const Profile = lazy(() => import('./components/profile/profile'));
const Favorites = lazy(() => import('./components/favourites/favourites'));

export default function Home() {
  const [data, setData] = useState<Character[]>([]);

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
        <section className={styles.section}>
          <Profile data={data}/>
        </section>
        <section className={styles.section}>
          <Favorites />
        </section>
      </main>
    </div>
  );
}
