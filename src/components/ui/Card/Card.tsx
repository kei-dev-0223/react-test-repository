//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./Card.module.scss";

type CardProps = {
  image : string;
  category : string;
  title : string;
  content : React.ReactNode;
  labels : string[];
  href? : string;
  className? : string;
  id? : string;
};

function Card({image,category,title,content,labels,href,className,id} : CardProps) {

  const inner =
    <>
      <div className={styles["card__head"]}>
        <figure className={styles["card__image"]}><img src={image} alt={title} /></figure>
      </div>
      <div className={styles["card__body"]}>
        <div className={styles["card__category"]}>{category}</div>
        <p className={styles["card__title"]}>{title}</p>
        <div className={styles["card__content"]}>{content}</div>

        <div className={styles["card__label"]}>
          {labels.map((item,index) => (
            <div key={index} className={styles["card__label-item"]}>{item}</div>
          ))}
        </div>
      </div>
    </>
  ;

  if(href){
    return (
      <a id={id} className={clsx(styles["card"],className)} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
    )
  }
  return (
    <div id={id} className={clsx(styles["card"],className)}>{inner}</div>
  )

}

export default Card;


