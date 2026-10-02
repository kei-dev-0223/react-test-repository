//ライブラリ
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

//コンポーネント
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import PageTransition from "@/components/layout/PageTransition/PageTransition";//画面遷移アニメーション
import BackgroundLayer from "@/components/layout/BackgroundLayer/BackgroundLayer";//背景のマス目アニメーション

//スタイル
import "./globals.scss";

//noto sansの読み込み
const notoSansJP = Noto_Sans_JP({
  weight: ["100","200","300","400","500","700"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "React Test Site",
  description: "React / Next.js の学習を目的としたテストサイトです。掲載しているテキストはすべてダミーであり、実在の企業・団体とは一切関係ありません。",
  robots: { index: false, follow: false }, // 検索エンジンにインデックスさせない
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <BackgroundLayer />
        <Header />
        <PageTransition>
          {children}
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
