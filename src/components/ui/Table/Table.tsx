//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./Table.module.scss";

type TableVariant = "default" | "scroll";

type TableProps = {
  variant? : TableVariant;
  children : React.ReactNode;
  className? : string;
  id? : string;
}

function Table({variant="default",children,className,id} : TableProps){
  return (
    <div id={id} className={clsx(styles["table-wrap"],styles["table-wrap--" + variant],className)}>
      <table className={styles["table"]}>{children}</table>
    </div>
  )
}

export default Table;