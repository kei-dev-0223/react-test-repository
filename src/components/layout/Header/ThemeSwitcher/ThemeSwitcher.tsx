"use client";

//ライブラリ
import { useState,useEffect } from "react";
import clsx from "clsx";

//スタイル
import styles from "./ThemeSwitcher.module.scss";

const Themes = ["LIGHT","DARK"] as const; //as constで読み取り専用の配列にする（中身が文字列リテラルとして認識される）
type Theme = "LIGHT" | "DARK"; //文字リテラルとして型宣言

type ThemeSwitcherProps = {
  className? : string;
}

function ThemeSwitcher({className} : ThemeSwitcherProps) {
  const [theme,setTheme] = useState<Theme>("LIGHT");

  useEffect(() => {
    if(theme === "DARK"){
      document.documentElement.dataset.theme = "dark";
    }
    else if(theme === "LIGHT"){
      document.documentElement.dataset.theme = "light";
    }
  },[theme]);

  useEffect(() => {//ページ表示時に、前回のモード変更を参照し反映。
    const saved = localStorage.getItem("theme");
    if(saved === "DARK"){
      setTheme(saved);
    }
  },[]);

  return(
    <div className={clsx(styles["theme-switcher"],className)}>
      {Themes.map((item,key) => (
        <button
          className={clsx(
            styles["theme-switcher__btn"],
            {[styles["is-active"]]: item === theme}
          )}
          type="button"
          key={key}
          onClick={() => {
            setTheme(item);
            localStorage.setItem("theme", item);//localStorageに、現在のモードを保存
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;