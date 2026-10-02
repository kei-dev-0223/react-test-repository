'use client';

//ライブラリ
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

//スタイル
import styles from "./Footer.module.scss";

function Footer() {
  const path = usePathname().replace(/\/$/, '') || '/';
  const isWeather = path === '/weather';
  const isHome    = path === '/';

  return (
    <footer className={clsx(styles["footer"],isHome && styles["footer--home"],isWeather && styles["footer--weather"])}>
      <div className={styles["footer__container"]}>
        <p className={styles["footer__copyright"]}>React Test Site</p>
      </div>
    </footer>
  );
};

export default Footer;