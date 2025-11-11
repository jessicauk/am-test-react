"use client";

import styles from "./page.module.css";
// import * as shlaami from "rickmortyapi"; Test
import type { CharacterItem } from "./lib/types";
import { useEffect, useState, lazy } from "react";
import type { AppDispatch } from "../app/lib/store";
import { useDispatch } from "react-redux";
import { setSelectedCharacter } from "./lib/features/selected/selectedSlice";
import {
  addFavorites,
  clearFavorites,
} from "./lib/features/favorites/favoritesSlice";
import { showList } from "./lib/features/showList/showListSlice";
import { API } from "./const";

const Profile = lazy(() => import("./components/Profile/Profile"));
const Favorites = lazy(() => import("./components/Favourites/Favourites"));

export default function Home() {
  const [data, setData] = useState<CharacterItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data from API:", process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(API);
        const data = await response.json();
        const characters = data || [];

        if (characters.length > 0) {
          const formattedData = characters.map((char: CharacterItem) => ({
            ...char,
            isAlive: char.status === "Alive",
            isFavorite: false,
          }));
          setData(formattedData);
          dispatch(clearFavorites());
          dispatch(addFavorites(formattedData));
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const firstCharacter = data[0];
      dispatch(setSelectedCharacter({ ...firstCharacter }));
    }
  }, [data, dispatch]);

  const onClickShowList = () => {
    // Logic to open favorites list
    dispatch(showList());
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={`${styles.section} ${styles.wrapper}`}>
          <Profile />
        </section>
        <section className={`${styles.section} ${styles.wrapperFavorites}`}>
          <Favorites data={data} />
        </section>
        <section className={`${styles.section} ${styles.wrapperButton}`}>
          <div className={styles.buttonWrapper}>
            <button className={styles.button} onClick={onClickShowList}>
              FAVS
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
