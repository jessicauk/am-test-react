'use client';

import { lazy, useMemo, useEffect } from "react";
import styles from "./Favourites.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/store";
import { addFavorite } from "../../lib/features/favorites/favoritesSlice";
import { setSelectedCharacter } from "../../lib/features/selected/selectedSlice";
import { showList } from "../../lib/features/showList/showListSlice";
import { setFilterText } from "../../lib/features/filter/filter";
import type { CharacterItem } from "../../lib/types";
import { API } from "../../const";


const Card = lazy(() => import("../Card/Card"));
const User = lazy(() => import("../Icons/User/User"));
const FavouriteList = lazy(() => import("../FavouriteList/FavouriteList"));
const Search = lazy(() => import("../Icons/Search/Search"));

interface FavouritesProps {
  data: CharacterItem[];
}

const Favourites = (props: FavouritesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const text = useSelector((state: RootState) => state.filter.text);

  const show = useSelector((state: RootState) => state.showList.show);

  const onClickFavorite = (item: CharacterItem) => {
    dispatch(addFavorite(item));
  };

  const onClickSelect = (data: CharacterItem) => {
    dispatch(setSelectedCharacter(data));
  };

  const onClickShowList = () => {
    // Logic to open favorites list
    dispatch(showList());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterText(e.target.value));
  };

  const updatedFavorites = async (item: CharacterItem) => {
    await fetch(`${API}/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFavorite: !item.isFavorite }),
    });
    onClickFavorite(item);
  };

  const favoritesLocal = useMemo(() => {
    return text
      ? favorites.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      : favorites;
  }, [favorites, text]);

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={`${styles.search} ${text ? styles.active : styles.inactive}`}>
          <Search />
          <input
            type="text"
            placeholder="Find your character..."
            value={text}
            onChange={handleChange}
          />
          <User />
        </div>
      </div>
      <div className={`${styles.cardsWrapper}`}>
        {favoritesLocal && favoritesLocal?.map((item) => (
          <div key={item.id} className={styles.card}>
            <Card
              {...item}
              onClick={() => updatedFavorites(item)}
              onClickSelect={() => onClickSelect(item)}
            />
          </div>
        ))}
      </div>
      <div
        className={`${styles.listWrapper} ${
          show ? styles.show : styles.hidden
        }`}
      >
        <FavouriteList show={show} />
      </div>
      <div className={`${styles.buttonWrapper}`}>
        <button className={styles.button} onClick={onClickShowList}>
          FAVS
        </button>
      </div>
    </div>
  );
};

export default Favourites;
