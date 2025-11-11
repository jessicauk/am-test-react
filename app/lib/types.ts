import type { Character } from "rickmortyapi";
export interface CharacterItem extends Character {
  isFavorite?: boolean;
  isAlive?: boolean;
}
