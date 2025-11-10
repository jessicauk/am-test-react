import styles from './Status.module.css';

interface StatusProps {
    isLive?: boolean;
}

const Status = ({isLive}: StatusProps) => {
  return (
    <div className={styles.status}>
      <div className={`${styles.indicator} ${!isLive ? styles.alive : styles.dead}`}/>
      {!isLive ? "LIVE" : "DEATH"}
    </div>
  )
};

export default Status;