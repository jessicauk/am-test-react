import {lazy} from "react";

import Image from "next/image";

import type { Character } from '../../lib/types';

import styles from "./Card.module.css";
const Heart = lazy(() => import('../Icons/Heart/Heart'));

import type { AppDispatch } from '../../lib/store';
import { useDispatch } from "react-redux";

import {
  setSelectedCharacter
} from "../../lib/features/selected/selectedSlice";

const Card = (props: Character) => {
    const dispatch = useDispatch<AppDispatch>();

    const onSelected = () => {
        console.log("Card selected:", props.name);
        dispatch(setSelectedCharacter(props));
    }
    return (
       <div className={styles.card} onClick={onSelected}>
          <p>{props.name}</p>
          <Image
            src={props.image}
            alt={props.name}
            width={145}
            height={145}
            priority={true}
          />
          <div className={styles.likeWrapper}>
            <Heart />
            <p>Like</p>
          </div>
        </div>
    );
}

export default Card;