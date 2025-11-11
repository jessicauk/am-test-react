import { lazy } from "react";

import Image from "next/image";

import type { CharacterItem } from "../../lib/types";

import styles from "./Card.module.css";
import Heart from "../Icons/Heart/Heart";

interface CardProps extends CharacterItem {
  onClick?: (data: CharacterItem) => void;
  onClickSelect?: (data: CharacterItem) => void;
}

const Card = ({onClick, onClickSelect, ...props}: CardProps) => {
    const { image, name, isFavorite,  } = props;
  return (
    <div className={`${styles.card} ${isFavorite ? styles.activeCard : ""}`} data-testid="card-component">
      <p>{name}</p>
      <Image src={image} alt={name} width={145} height={145} priority={true} onClick={onClickSelect ? () => onClickSelect(props) : undefined}/>
      <div className={styles.likeWrapper} onClick={onClick ? () => onClick(props) : undefined}>
        <Heart className={`${isFavorite ? styles.active :""}`}/>
        <p>Like</p>
      </div>
    </div>
  );
};

export default Card;
