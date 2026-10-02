//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./Heading.module.scss";

type HeadingProps = {
  as? : "h2" | "h3" | "h4"| "p";
  title : string;
  lead? : React.ReactNode;
  className? : string;
  id? :string;
}

function Heading({as:Component="h2",title,lead,className,id} : HeadingProps) {
  return(
    <div className={clsx(styles["heading"],className)} id={id}>
      <Component className={styles["heading__title"]}>{title}</Component>
      {lead &&
        <p className={styles["heading__lead"]}>{lead}</p>
      }
    </div>
  );
}

export default Heading;