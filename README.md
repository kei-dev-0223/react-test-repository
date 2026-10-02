# React_Test_Site

React / Next.js の学習を目的としたテストサイトです。
検索エンジンにインデックスされないよう `robots: { index: false }` を設定しています。

ライセンスは設定していないため著作権は作者に留保されます（第三者への再配布・転載は想定していません）。

---

## 環境

| | バージョン |
|---|---|
| Node.js | 24.19.0 で動作確認 |
| npm | 11.17.0 |
| Next.js | 15.5.24（App Router） |
| React | 19.1.0 |
| TypeScript | 5系 |
| Sass | 1.89.2 |

Node.js が未インストールの場合は [nodejs.org](https://nodejs.org/ja) から LTS 版を入れてください。

## セットアップ

```bash
npm ci
```

`npm install` ではなく `npm ci` を使います。`package-lock.json` に記録されたバージョンをそのまま入れるため、全員の `node_modules` が同じ状態になります。

> `npm install` はロックファイルを更新することがあります。パッケージを追加・更新する時だけ `npm install` を使い、更新後の `package-lock.json` をコミットしてください。

## コマンド

```bash
npm run dev      # 開発サーバー（http://localhost:3000）
npm run build    # 本番ビルド。out/ に静的ファイルを出力
```

静的出力の構成のため `npm start`（Node.js サーバーの起動）は使いません。ビルドした `out/` をそのまま配信します。

## ビルドと公開

[next.config.ts](next.config.ts) の2行が構成の要です。

```ts
const nextConfig: NextConfig = {
  output: "export",     // out/ に HTML を書き出す
  trailingSlash: true,  // about/index.html 形式で出力する
};
```

`output: "export"` により `npm run build` だけで `out/` が生成されます。
Node.js が動かないサーバーにも、`out/` の中身をそのまま置くだけで公開できます。

`trailingSlash: true` が無いと `out/about.html` として出力され、リンク `/about/` からたどり着けません。

### 引き換えに使えない機能

静的出力のため、サーバーを前提とした機能は使えません。

- API Routes
- ISR（ビルド後の再生成）
- Middleware
- `next/image` の最適化
- `cookies()` / `headers()`

`weather` ページは外部 API を使っていますが、ブラウザ側から取得しているため静的出力でも動作します。

---

## ディレクトリ構成

```
public/
└─ images/sample.svg      コンポーネントパーツの表示確認用画像
src/
├─ app/                     App Router。フォルダ構成がそのまま URL になる
│  ├─ (home)/               括弧付き = Route Group。URL には含まれない
│  │  └─ Hero/              このページでしか使わない部品
│  ├─ about/
│  ├─ site-architecture/    サイト設計の解説ページ
│  ├─ components/           コンポーネントカタログ
│  ├─ weather/              天気API を使うページ
│  │  ├─ WeatherAnimation/  天気イラスト（このページでしか使わない部品）
│  │  └─ _lib/              このページ専用の関数
│  │                        useWeather / weatherApi / weatherUtils
│  ├─ layout.tsx            全ページ共通のレイアウト
│  └─ globals.scss          唯一のグローバル CSS。:root に全トークン
├─ components/
│  ├─ layout/               全ページ共通の枠を構成する要素
│  │                        Header / Footer / BackgroundLayer / PageTransition
│  │                        Header/ThemeSwitcher/ はHeaderからのみ使うため配下に置く
│  └─ ui/                   ページ内で呼び出す部品（11個）
└─ styles/
   ├─ _variables.scss       メディアクエリで使う値のみ（境界値・コンテンツ幅）
   ├─ _mixins.scss          mixins.pc / mixins.sp
   ├─ _reset.scss
   ├─ _base.scss
   ├─ _theme.scss           ダークテーマでのトークン上書き
   ├─ _utilities.scss       u- 系ユーティリティ
   └─ layout.module.scss    ページ共通のコンテナ幅（クラスを提供するため _ なし）
```

`@/` は `src/` を指すエイリアスです（[tsconfig.json](tsconfig.json) で設定）。

部品は「1部品1フォルダ」で統一しています。

```
<Name>/
├─ <Name>.tsx
└─ <Name>.module.scss
```

呼び出し元が1つしかない部品は、その親の直下に置きます（コロケーション）。

```
app/(home)/Hero/                         (home)/page.tsx のみが使う
components/layout/Header/ThemeSwitcher/  Header.tsx のみが使う
```

`app/` 配下でも同じ形にしています。フォルダが URL になるのは `page.tsx` を含む場合だけなので、
`Hero/` は `/Hero` というルートを作りません。

`_lib/` のように先頭が `_` のフォルダは Private Folder といい、ルーティングから完全に除外されます。
ページ専用の関数はここにまとめています。

---

## 設計方針

サイト内に解説ページを用意しています。ブラウザで見るのが早いです。

| ページ | 内容 |
|---|---|
| `/site-architecture/` | ディレクトリ設計、CSS 設計、デザイントークン、テーマ、z-index の考え方 |
| `/components/` | 全 UI パーツの実物と呼び出しコード |

以下は、その中でも特に守っているルールです。

### 色は2層のトークンで管理する

```scss
/* Global Token（色そのもの） */
--global-gray-900: #1a1c20;

/* Alias Token（役割） */
--color-text: var(--global-gray-900);
```

コンポーネントからは Alias Token だけを参照します。
ダークテーマは [_theme.scss](src/styles/_theme.scss) で Alias Token の中身を差し替えるだけで、コンポーネント側の記述は変わりません。

### 余白はコンポーネントに持たせない

パーツ自身は外側の `margin` を持たず、呼び出し側が `u-mt-*` で指定します。

```tsx
<Card className="u-mt-40" ... />
```

同じパーツなのにページによって余白が違う、という状態を防ぐためです。
繰り返し並ぶ要素は、親を flex / grid にして `gap` で処理します。

### ユーティリティは -sp / -pc を明示する

```
値が同じ    u-mt-24
値が違う    u-mt-44-sp u-mt-88-pc
```

「無印 + `-pc` で上書き」は使いません。どちらが効いているか読み取れないためです。

### パーツの共通仕様

全 11 パーツが次を満たします。

1. `className` と `id` を受け取れる
2. 外側の `margin` を持たない
3. 見た目の違いは `variant` で吸収し、振る舞いが違う場合は別パーツに分ける

---

## 外部データの出典

`weather` ページは以下の公開APIを利用しています。**どちらもライセンス上、出典の表示が必須です。**

| API | 用途 | ライセンス |
|---|---|---|
| [Open-Meteo](https://open-meteo.com/) | 天気予報の取得 | CC BY 4.0 |
| [Nominatim (OpenStreetMap)](https://www.openstreetmap.org/copyright) | 地名 ⇔ 緯度経度の変換 | ODbL |

ページ下部の `.weather__credit` がその表記です。**削除しないでください。**

外部APIを使う場合は、利用規約とライセンスを必ず確認してください。
表記義務があるものは、見える位置に置く必要があります。

---

## 既知の課題

- ESLint / Prettier 未導入。SCSS のインデントが 2 / 4 スペースで混在している（導入時に一括整形する方針）
- 自動テストなし。導入するなら weatherApi.ts の型ガードから
- `key={index}` を使っている箇所がある（並び替えのない静的データのみ。週間予報など可変の箇所は `key={date}` を使用）
