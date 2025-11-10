import { lazy } from "react";
import Image from "next/image";
import styles from "./Profile.module.css";

import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";

const Item = lazy(() => import("../Item/Item.module"));
const ListItem = lazy(() => import("../ListItem/ListItem"));
const Status = lazy(() => import("../Status/Status"));

const Profile = () => {
  const selectedCharacter = useSelector(
    (state: RootState) => state.selected.character
  );

  const props = selectedCharacter;

  const list = [
    {
      title: "Origin",
      value: props?.origin.name || "Unknown",
    },
    {
      title: "Location",
      value: props?.location.name || "Unknown",
    },
    {
      title: "Gender",
      value: props?.gender || "Unknown",
    },
    {
      title: "Episode",
      value: props?.episode.length || 0,
    },
  ];

  return (
    <>
      <Image
        className={styles.image}
        src={props ? props.image : "/background.jpg"}
        alt="profile image"
        width={800}
        height={800}
        priority={true}
      />
      <Status isAlive={props?.isAlive || false} />
      <div className={styles.information}>
        <Item title={props?.name || ""} value={props?.species || 0} info={""} />
        <ListItem data={list} />
      </div>
    </>
  );
};

export default Profile;
