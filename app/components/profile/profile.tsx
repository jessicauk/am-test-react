import type { Character } from "rickmortyapi";
import Image from "next/image";
import styles from "./profile.module.css";

interface ProfileProps {
  data?: Character[];
}
const Profile = (props: ProfileProps) => {
  console.log("Profile props data:", props.data);
  const item = props.data && props.data.length > 0 ? props.data[0] : null;
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
      <div className={styles.liveStatus}>
        LIVE
      </div>
      <div className={styles.information}>
        information about the character will be here
      </div>
    </>
  );
};

export default Profile;
