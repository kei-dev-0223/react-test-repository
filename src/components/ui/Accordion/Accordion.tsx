"use client";

//ライブラリ
import {useState} from "react";
import clsx from "clsx";
import {motion} from "framer-motion";

//スタイル
import styles from "./Accordion.module.scss";

type AccordionProps = {
  head : React.ReactNode;
  body : React.ReactNode;
  className? : string;
  id? : string;
}

function Accordion({head,body,className,id} : AccordionProps){
  const [isOpen,setIsOpen] = useState(false);

  return(
    <div id={id} className={clsx(styles["accordion"], className, {[styles["accordion--active"]] : isOpen})}>
      <button className={styles["accordion__head"]} onClick={() => setIsOpen(prev => !prev)}>
        <span className={styles["accordion__head-in"]}>{head}</span>
      </button>
      <motion.div className={styles["accordion__body"]} initial={{height:0}} animate={{height : isOpen? "auto" : 0 }} transition={{duration:0.3}}>
        <div className={styles["accordion__body-in"]}>{body}</div>
      </motion.div>
    </div>
  )
}
export default Accordion;