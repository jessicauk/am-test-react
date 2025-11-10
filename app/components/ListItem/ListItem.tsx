import React from "react";
import Item from "../Item/Item.module";
import styles from "./ListItem.module.css";

type ItemType = {title: string, value: string | number, info?: string}

interface ListProps {
  data: ItemType[];
}

const ListItem = ({ data }: ListProps) => {
  console.log("List data:", data);
  return (<div className={styles.container}>
  {
    data && data.length > 0 ? (
      data.map((item: ItemType, index: number) => (
        <div key={`${item?.value}-${index}`} >
          <Item {...item} />
        </div>
      ))
    ) : (
      <p>No data available</p>
    )
  }
  </div>);
}

export default ListItem;