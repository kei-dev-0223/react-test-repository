//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./Timeline.module.scss";

type TimelineItem = {
  year : string;
  content : React.ReactNode;
}

type TimelineProps = {
  items : TimelineItem[];
  className? : string;
  id? : string;
}

function Timeline({items ,className,id} : TimelineProps) {

  return(

    <ul id={id} className={clsx(styles["timeline"],className)}>
      {items.map((item,index) => (
        <li className={styles["timeline__item"]} key={index}>
          <div className={styles["timeline__year"]}>{item.year}</div>
          <div className={styles["timeline__content"]}>{item.content}</div>
        </li>
      ))}
    </ul>

  );
}

export default Timeline;