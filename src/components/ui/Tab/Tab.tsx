"use client";

//ライブラリ
import { useState } from "react";
import clsx from "clsx";

//スタイル
import styles from "./Tab.module.scss";

type TabItem = {
  head : React.ReactNode;
  body : React.ReactNode;
}

type TabProps = {
  items : TabItem[];
  className? : string;
  id? : string;
};

function Tab({items,className,id} : TabProps){
  const [clickedIndex,setClickedIndex] = useState(0);

  return(
    <div id={id} className={clsx(styles["tab"],className)}>

      <div className={styles["tab__head"]}>
        {items.map((item,index) => (
          <button key={index} className={clsx(styles["tab__head-item"], {[styles["tab__head-item--active"]]: clickedIndex === index})} onClick={() => setClickedIndex(index)}>
            <span className={styles["tab__head-item-in"]}>{item.head}</span>
          </button>
        ))}
      </div>

      <div className={styles["tab__body"]}>
        {items.map((item,index) => (
          <div key={index} className={clsx(styles["tab__body-item"], {[styles["tab__body-item--active"]]: clickedIndex === index})}>
            <div className={styles["tab__body-item-in"]}>{item.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tab;