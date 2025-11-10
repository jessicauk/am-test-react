import styles from "./Favourites.module.css";
import Image from "next/image";
import Heart from "../Icons/Heart/Heart";
import Search from "../Icons/Search/Search";
import FavouriteList from "../FavouriteList/FavouriteList";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/store";
import {
  addFavorite,
  removeFavorite,
} from "../../lib/features/favorites/favoritesSlice";
import type { Character } from "../../lib/types";
import { lazy } from "react";

const Card = lazy(() => import("../Card/Card"));

interface FavouritesProps {
  data: Character[];
}

const Favourites = ({ data }: FavouritesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  /* const isFavorite = favorites.some((f) => f.id === data.id); */

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.search}>
          <Search />
          <input type="text" placeholder="Find your character..." />
        </div>
      </div>
      <div className={`${styles.cardsWrapper}`}>
        {data.map((item) => (
          <div key={item.id} className={styles.card}>
            <Card {...item} />
          </div>
        ))}
      </div>
      <div className={`${styles.listWrapper}`}>
        <FavouriteList />
      </div>
      <div className={styles.buttonWrapper}>
        <button className={styles.button}>FAVS</button>
      </div>
    </div>
  );
};

export default Favourites;
