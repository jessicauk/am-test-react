import styles from './Status.module.css';

interface StatusProps {
    isAlive?: boolean;
}

const Status = ({isAlive}: StatusProps) => {
  return (
    <div className={styles.status}>
      <div className={`${styles.indicator} ${isAlive ? styles.alive : styles.dead}`}/>
      {isAlive ? "LIVE" : "DEATH"}
    </div>
  )
};

export default Status;