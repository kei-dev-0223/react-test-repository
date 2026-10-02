"use client";

//ライブラリ
import {useState,useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

//コンポーネント
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";

//スタイル
import styles from "./Header.module.scss";

// _variables.scss の $bp-nav-min と同じ値。ナビが横並びに切り替わる幅
const NAV_PC_MIN = 1000;

function Header(){
  const pathname = usePathname();
  const isTopPage = pathname === "/"; // TOPページかどうかを判定

  type MenuKey = "menu01"; //増えた場合は、"menu01" | "menu02"の形で追加。
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [isHamOpen,setIsHamOpen] = useState(false);

  //ハンバーガーメニューの背景固定
  useEffect(() => {
    document.documentElement.style.overflow = isHamOpen ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isHamOpen]);

  //PC表示にレスポンシブした際の、ハンバーガーメニュー非表示処理のイベント登録
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= NAV_PC_MIN) {
        setIsHamOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {// 保険です（ほぼ走ることはないかと）
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeAllMenu = () => {
    setActiveMenu(null);
    setIsHamOpen(false);
  };

  return(
    <header className={clsx(styles["header"],{[styles["is-top-page"]]: isTopPage})}>
        <div className={styles["header__container"]}>
          <div className={styles["header__container-in"]}>
            <div className={styles["header__site-name"]}><Link onClick={closeAllMenu} href="/">REACT TEST<span className={styles["header__site-name-cursor"]}>_</span>SITE</Link></div>
            <div className={clsx(styles["header__nav"], { [styles["is-active"]]: isHamOpen })}>

              <div className={clsx(styles["header__nav-item"], styles["header__nav-item--sp-only"])}><Link className={styles["header__nav-link"]} onClick={closeAllMenu} href="/">Home</Link></div>
              <div className={styles["header__nav-item"]}><Link className={styles["header__nav-link"]} onClick={closeAllMenu} href="/about/">About</Link></div>

              <div className={clsx(styles["header__nav-item"], { [styles["is-active"]]: activeMenu === "menu01" })}
                onMouseEnter={() => setActiveMenu("menu01")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  className={styles["header__nav-child-title"]}
                  href="/site-architecture/"
                  aria-expanded={activeMenu === "menu01"} //開閉状態をスクリーンリーダーに伝える用
                  onClick={(e) => {
                    if (window.innerWidth < NAV_PC_MIN) {
                      e.preventDefault(); //SPはページ遷移させない。
                      setActiveMenu(activeMenu === "menu01" ? null : "menu01"); //サブメニューの開閉に
                      return;
                    }
                    closeAllMenu(); //PC表示時はページ遷移するのでメニューを閉じる
                  }}
                >
                  Site Architecture
                </Link>
                <div className={styles["header__nav-child"]}>
                  <div className={styles["header__nav-child-in"]}>
                    <div className={styles["header__nav-link-list"]}>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#directory-structure">Directory</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#component-architecture">Component Design</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#naming">Naming</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#css-architecture">CSS</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#spacing">Spacing</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#design-token">Token</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#theme">Theme</Link></div>
                      <div className={styles["header__nav-link-list-item"]}><Link className={styles["header__nav-link-list-link"]} onClick={closeAllMenu} href="/site-architecture#z-index">z-index</Link></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["header__nav-item"]}><Link className={styles["header__nav-link"]} onClick={closeAllMenu} href="/components/">Components</Link></div>
              <div className={styles["header__nav-item"]}><Link className={styles["header__nav-link"]} onClick={closeAllMenu} href="/weather/">Weather</Link></div>

              {/* SPではメニュー内に移動。PCは画面右下に固定 */}
              <ThemeSwitcher className={styles["header__theme-switcher"]} />
            </div>
            <button
              type="button"
              className={clsx(styles["header__ham-menu"], { [styles["is-active"]]: isHamOpen })}
              aria-expanded={isHamOpen} //開閉状態をスクリーンリーダーに伝える用
              onClick={() => setIsHamOpen(prev => !prev)}
            >
              <span className="u-sr-only">{isHamOpen ? "メニューを閉じる" : "メニューを開く"}</span>
              <div className={styles["header__ham-menu-icon"]}><div className={styles["header__ham-menu-icon-border"]}></div></div>
            </button>
          </div>
        </div>
    </header>
  );
}

export default Header;