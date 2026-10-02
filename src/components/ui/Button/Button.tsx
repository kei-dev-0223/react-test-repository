//ライブラリ
import Link from "next/link";
import clsx from "clsx";

//スタイル
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;                 // 指定すると <Link>、無ければ <button> になる
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  id?: string;
};

// href の有無で出力タグを切り替え
function Button({children,variant="primary",href,onClick,disabled,type ="button",className,id,}: ButtonProps) {

  const classNames = clsx(styles["button"],styles[`button--${variant}`],className);

  if(href) {
    return (
      <Link id={id} href={href} className={classNames} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button id={id} type={type} className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
