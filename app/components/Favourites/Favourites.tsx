import styles from "./Favourites.module.css";
import Search from "../Icons/Search/Search";
import FavouriteList from "../FavouriteList/FavouriteList";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/store";
import {
  addFavorite,
  removeFavorite,
} from "../../lib/features/favorites/favoritesSlice";
import { setSelectedCharacter } from "../../lib/features/selected/selectedSlice";
import type { CharacterItem } from "../../lib/types";
import { lazy } from "react";

const Card = lazy(() => import("../Card/Card"));

interface FavouritesProps {
  data: CharacterItem[];
}

const Favourites = ({ data }: FavouritesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  /* const isFavorite = favorites.length > 0 ? favorites.some((f) => f.id === data[0].id) : false; */

  const onClickFavorite = (item: CharacterItem) => {
    console.log("Clicked favorite for item:", item);
    /* if (item.isFavorite) {
      dispatch(removeFavorite(item));
    } else {
      dispatch(addFavorite(item));
    } */
    dispatch(addFavorite(item));
  }

  const onClickSelect = (data: CharacterItem) => {
    dispatch(setSelectedCharacter(data));
  }

  const onClickShowList = () => {
    // Logic to open favorites list
  }

  /* const isFavorite = favorites.some((f) => f.id === data.id); */

 // console.log("Favourites component data:", data);
  console.log("Favourites from store:", favorites);

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.search}>
          <Search />
          <input type="text" placeholder="Find your character..." />
        </div>
      </div>
      <div className={`${styles.cardsWrapper}`}>
        {favorites?.map((item) => (
          <div key={item.id} className={styles.card}>
            <Card {...item} onClick={() => onClickFavorite(item)} onClickSelect={() => onClickSelect(item)}/>
          </div>
        ))}
      </div>
      <div className={`${styles.listWrapper}`}>
        <FavouriteList />
      </div>
      <div className={`${styles.buttonWrapper}`}>
        <button className={styles.button} onClick={onClickShowList}>FAVS</button>
      </div>
    </div>
  );
};

export default Favourites;
