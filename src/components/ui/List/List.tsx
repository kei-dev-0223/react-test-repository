//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./List.module.scss";

// 型定義 -- テキストのバリエーション
type ListVariant = "dot" | "disc" | "decimal" | "decimal-leading-zero";

type ListProps = {
  as? : "ul" | "ol";
  items : React.ReactNode[];
  variant? : ListVariant;
  className? : string;
  id? : string;
}

function List({as:Component="ul",items,variant="dot",className,id} : ListProps){

  const listItems = items.map((item,index) => (
    <li className={styles["list__item"]} key={index}><span className={styles["list__item-in"]}>{item}</span></li>
  ));

  return(
    <Component id={id} className={clsx(styles["list"],styles["list--" + variant],className)}>
      {listItems}
    </Component>
  )
}

export default List;