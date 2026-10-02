//ライブラリ
import clsx from "clsx";

//スタイル
import styles from "./Text.module.scss";

type TextVariant = "body" | "small" | "note";

type TextProps = {
  as? : "p" | "span" | "div";
  variant? : TextVariant;
  children : React.ReactNode;
  className? : string;
  id? : string;
};

// htmlの入れ物を作成
function Text({as:Component="p",variant="body",children,className,id }:TextProps) {
  return (
    <Component id={id} className={clsx(styles["text"],styles[`text--${variant}`],className)}>
      {children}
    </Component>
  );
}

export default Text;