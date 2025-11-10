

import styles from './Favourites.module.css';
import Image from "next/image";
import Heart from '../Icons/Heart/Heart';
import Search from '../Icons/Search/Search';
import FavouriteList from '../FavouriteList/FavouriteList';

const Favourites = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.search}>
          <Search />
          <input type="text" placeholder="Find your character..." />
        </div>
      </div>
      <div className={`${styles.cardsWrapper}`}>
        {[1,2,3,4,5,6].map((_, index) => (
        <div key={index} className={styles.card}>
          <p>MORTY</p>
          <Image
            src="https://rickandmortyapi.com/api/character/avatar/2.jpeg"
            alt="character"
            width={145}
            height={145}
            priority={true}
          />
          <div className={styles.likeWrapper}>
            <Heart />
            <p>Like</p>
          </div>
        </div>
      ))}
      <div className={styles.card}>
        <p>RICK</p>
        <Image
          src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
          alt="character"
          width={145}
          height={145}
          priority={true}
        />
        <div className={styles.likeWrapper}>
          <Heart />
          <p>Like</p> 
        </div>
      </div>
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