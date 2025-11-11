import styles from './FavouriteList.module.css';
import Trash from '../Icons/Trash/Trash';
import type { CharacterItem } from "../../lib/types";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../lib/store";

import { addFavorite } from '@/app/lib/features/favorites/favoritesSlice';

interface FavouriteListProps {
  show: boolean;
}

const FavouriteList = ({ show }: FavouriteListProps) => {

  const dispatch = useDispatch<AppDispatch>();

  const characters = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  
  const onClick = (item: CharacterItem) => {
    // Logic to remove favorite character
    dispatch(addFavorite(item));
  }

  const filteredCharacters = characters.filter(char => char.isFavorite).slice(0, 4);
  return (
    <div className={`${styles.list} ${show ? styles.show : styles.hidden}`}>
      {filteredCharacters.length > 0 && filteredCharacters.map(item => (
        <div key={item.name} className={styles.listItem}>
          <p>{item.name}</p>
          <Trash onClick={() => onClick(item)}/>
        </div>
      ))}
        {filteredCharacters.length === 0 && (
            <p className={styles.empty}>No favorite characters added.</p>
        )}
    </div>
  );
};  

export default FavouriteList;