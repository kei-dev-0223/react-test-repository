//コンポーネント
import Hero from "./Hero/Hero";

//スタイル
import layout from "@/styles/layout.module.scss";

export default function Home() {
  return (
    <main className={layout["container-top"]}>
      <Hero title={"REACT"} subTitle={"TEST"} accentText={"SITE"} />
    </main>
  );
}