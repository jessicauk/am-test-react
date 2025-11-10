import type { Character } from "rickmortyapi";
import Image from "next/image";
import styles from "./Profile.module.css";
import Item from "../Item/Item.module";
import ListItem from "../ListItem/ListItem";
import Status from "../Status/Status";

interface ProfileProps {
  data?: any[];
}
const Profile = (props: ProfileProps) => {
  //console.log("Profile props data:", props.data);
  const item = props.data && props.data.length > 0 ? props.data[0] : undefined;

  const keysToKeep = ['episode', 'gender', 'origin', 'location'];

  const filtered = Object.fromEntries(
    item ? Object.entries(item).filter(([key]) => keysToKeep.includes(key)) : []
  );

const list = [
    {
    title: 'Origin',
    value: 'Alien Spa',
  }, 
   {
    title: 'Location',
    value: 'Earth',
  }, 
   {
    title: 'Gender',
    value: 'Male',
  }, 
   {
    title: 'Episodes',
    value: 132,
  }, 

];

console.log("profile:", item);

  return (
    <>
      <Image
        className={styles.image}
        src={item ? item.image : "/background.jpg"}
        alt="profile image"
        width={800}
        height={800}
        priority={true}
      />
      <Status />
      <div className={styles.information}>
        <Item title={item?.name} value={item?.species} info={""}/>
        <ListItem data={list} />
      </div>
    </>
  );
};

export default Profile;
