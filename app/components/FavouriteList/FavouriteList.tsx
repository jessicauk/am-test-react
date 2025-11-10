import styles from './FavouriteList.module.css';
import Trash from '../Icons/Trash/Trash';


const FavouriteList = () => {
    const characters = ['RICK', 'MORTY', 'SUMMER', 'BETH'];
  return (
    <div className={styles.list}>
      {characters.map(name => (
        <div key={name} className={styles.listItem}>
          <p>{name}</p>
          <Trash />
        </div>
      ))}
    </div>
  );
};  

export default FavouriteList;