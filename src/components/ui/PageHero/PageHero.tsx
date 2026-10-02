//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./PageHero.module.scss";

type PageHeroProps = {
  title : string;
  lead? : React.ReactNode;
  className? : string;
  id? : string
}

function PageHero({title, lead, className, id} : PageHeroProps) {
  return(
    <div className={clsx(styles["page-hero"],className)} id={id}>
      <h1 className={styles["page-hero__title"]}>{title}</h1>
      {lead &&
        <p className={styles["page-hero__lead"]}>{lead}</p>
      }
    </div>
  );
}

export default PageHero;