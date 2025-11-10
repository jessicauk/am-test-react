export interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string | number;
  isAlive?: boolean;
  created: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  episode: string[];
  url: string;
  type: string;
}
