import type { Character } from "rickmortyapi";
import styles from "./Item.module.css";

interface ItemProps {
  title: string, 
  value: string | number, 
  info?: string
}

const Item = (props: ItemProps) => {
  return (
      <p className={styles.primaryText}>
        {props?.title || ""}
        <span className={styles.secondaryText}>{props?.value || ""}</span>
        <span className={styles.secondaryText}>{props?.info || ""}</span>
      </p>
  );
};

export default Item;