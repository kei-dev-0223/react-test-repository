//ライブラリ
import clsx from "clsx";

//コンポーネント
import PageHero from "@/components/ui/PageHero/PageHero";
import Heading from "@/components/ui/Heading/Heading";
import Text from "@/components/ui/Text/Text";
import List from "@/components/ui/List/List";
import CodeBlock from "@/components/ui/CodeBlock/CodeBlock";
import Button from "@/components/ui/Button/Button";
import Table from "@/components/ui/Table/Table";
import Tab from "@/components/ui/Tab/Tab";
import Accordion from "@/components/ui/Accordion/Accordion";
import Card from "@/components/ui/Card/Card";
import Timeline from "@/components/ui/Timeline/Timeline";

//スタイル
import layout from "@/styles/layout.module.scss";
import styles from "./page.module.scss"; // 固有ページ専用のCSSモジュール

export default function Components() {
  return (
    <main className={layout["container-sub"]}>

      <PageHero
        title="Components"
        lead="コンポーネントカタログ"
      />

      {/* ───── はじめに ───── */}
      <div className="u-mt-44-sp u-mt-88-pc">
        <Text>
          本サイトで使用可能なコンポーネントパーツを、実物と呼び出しコードを並べて一覧化したページです。<br />
          各セクションは「説明 → PREVIEW枠の実物 → 呼び出しコード」の順に並んでいます。
        </Text>
        <Text className="u-mt-24">
          すべてのパーツは、次の3点を共通の設計方針としています。
        </Text>
        <List
          className="u-mt-16"
          as="ol"
          variant="decimal"
          items={[
            "className と id を受け取れる。レイアウトや余白、アンカーの指定は呼び出し側が行う",
            "パーツ自身は外側のmarginを持たない。u-mt-* などのユーティリティで制御する",
            "見た目の違いはvariantで吸収し、振る舞いが違う場合は別パーツとして分ける",
          ]}
        />
        <Text className="u-mt-24" variant="note">
          画面右上のテーマ切り替えと、ブラウザ幅の変更を併せてご確認ください。
        </Text>
      </div>

      {/* ══════════ テキスト系 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="HEADING"
          lead="セクション見出し"
          id="heading"
        />
        <Text className="u-mt-24">
          セクションの見出しです。titleのみ必須で、他は任意です。<br />
          leadを省略した場合は、2つ目のような形でtitleの部分のみが表示されます。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Heading
            as="p"
            title="SAMPLE"
            lead="リード文つきの見出し"
          />
          <Heading
            as="p"
            className="u-mt-24"
            title="SAMPLE"
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<Heading
          title="SAMPLE"
          lead="リード文つきの見出し"
          id="sample"
        />`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="TEXT"
          lead="本文"
          id="text"
        />
        <Text className="u-mt-24">
          本文テキストです。variantで役割を、asで出力タグ（p / span / div）を指定します。既定はvariant="body"、as="p"です。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Text variant="body">
            variant="body" ── 通常の本文で使います。
          </Text>
          <Text className="u-mt-16" variant="small">
            variant="small" ── 実物のラベルなど、短い添え字に使います。
          </Text>
          <Text className="u-mt-16" variant="note">
            variant="note" ── 注記を書く際に使います。
          </Text>
        </div>
        <CodeBlock className="u-mt-24">
        {`<Text variant="body">通常の本文</Text>
        <Text variant="small">短い添え字</Text>
        <Text variant="note">読み手への注記</Text>
        <Text as="span" variant="body">インライン要素として出力</Text>`}
        </CodeBlock>
      </section>

      {/* ══════════ 一覧系 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="LIST"
          lead="箇条書き"
          id="list"
        />
        <Text className="u-mt-24">
          箇条書きです。行頭記号をvariantで切り替えます。<br />
          番号付きのvariantにする場合は、あわせてas="ol"の指定を推奨します。<br />
          見た目は変わりませんが、順序に意味があることをHTMLとして示せます。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Text variant="small">variant="dot"（既定）</Text>
          <List
            className="u-mt-16"
            variant="dot"
            items={[
              "1つめの項目です",
              "2つめの項目です",
              "3つめの項目です",
            ]}
          />
          <Text className="u-mt-24" variant="small">variant="disc"</Text>
          <List
            className="u-mt-16"
            variant="disc"
            items={[
              "1つめの項目です",
              "2つめの項目です",
              "3つめの項目です",
            ]}
          />
          <Text className="u-mt-24" variant="small">variant="decimal"</Text>
          <List
            className="u-mt-16"
            as="ol"
            variant="decimal"
            items={[
              "1つめの項目です",
              "2つめの項目です",
              "3つめの項目です",
            ]}
          />
          <Text className="u-mt-24" variant="small">variant="decimal-leading-zero"</Text>
          <List
            className="u-mt-16"
            as="ol"
            variant="decimal-leading-zero"
            items={[
              "1つめの項目です",
              "2つめの項目です",
              "3つめの項目です",
            ]}
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<List
          as="ol"
          variant="decimal"
          items={[
            "1つめの項目です",
            "2つめの項目です",
          ]}
        />`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="TABLE"
          lead="表"
          id="table"
        />
        <Text className="u-mt-24">
          表です。theadとtbodyは呼び出し側で書きます。<br />
          variant="scroll"は、列が多い表を親要素の幅で切らず、はみ出した分だけ横スクロールさせます。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Text variant="small">variant="default"（既定）</Text>
          <Table className="u-mt-16">
            <thead>
              <tr>
                <th>トークン名</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>--color-text</td>
                <td>本文の文字色</td>
              </tr>
              <tr>
                <td>--color-bg</td>
                <td>ページの背景色</td>
              </tr>
              <tr>
                <td>--color-border</td>
                <td>罫線・枠線の色</td>
              </tr>
            </tbody>
          </Table>
          <Text className="u-mt-24" variant="small">variant="scroll"（SP幅にすると、横スクロールします。）</Text>
          <Table className="u-mt-16" variant="scroll">
            <thead>
              <tr>
                <th>トークン名</th>
                <th>ライト</th>
                <th>ダーク</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>--color-text</td>
                <td>gray-900</td>
                <td>gray-50</td>
                <td>本文の文字色</td>
              </tr>
              <tr>
                <td>--color-bg</td>
                <td>gray-50</td>
                <td>gray-900</td>
                <td>ページの背景色</td>
              </tr>
              <tr>
                <td>--color-border-subtle</td>
                <td>gray-100</td>
                <td>gray-800</td>
                <td>背景のグリッド線</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <CodeBlock className="u-mt-24">
        {`<Table variant="scroll">
          <thead>
            <tr><th>見出し</th></tr>
          </thead>
          <tbody>
            <tr><td>内容</td></tr>
          </tbody>
        </Table>`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="TIMELINE"
          lead="年表"
          id="timeline"
        />
        <Text className="u-mt-24">
          年ごとの出来事を縦に並べる部品です。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Timeline
            items={[
              {year : "0000", content : "ダミーのテキスト。ダミーのテキスト。ダミーのテキスト。"},
              {year : "0000", content : "ダミーのテキスト。ダミーのテキスト。ダミーのテキスト。ダミーのテキスト。"},
              {year : "0000", content : "ダミーのテキスト。ダミーのテキスト。"},
            ]}
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<Timeline
          items={[
            {year : "0000", content : "本文"},
            {year : "0000", content : "本文"},
          ]}
        />`}
        </CodeBlock>
      </section>

      {/* ══════════ 操作系 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="BUTTON"
          lead="ボタン"
          id="button"
        />
        <Text className="u-mt-24">
          ボタンです。hrefを渡すとnext/linkのaタグ、渡さなければbuttonタグになります。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <div className="u-d-flex u-flex-wrap u-ai-center u-gap-16">
            <Button variant="primary" href="/">primary</Button>
            <Button variant="secondary" href="/">secondary</Button>
            <Button variant="primary" disabled>disabled</Button>
          </div>
        </div>
        <CodeBlock className="u-mt-24">
        {`<Button href="/about/">遷移する（aタグ）</Button>
        <Button onClick={handleClick}>押す（buttonタグ）</Button>
        <Button variant="secondary" disabled>無効（buttonタグ）</Button>`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="TAB"
          lead="タブ切り替え"
          id="tab"
        />
        <Text className="u-mt-24">
          タブで本文を切り替える部品です。タブが増えて幅に収まらない場合は、見出し部分が横スクロールします。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Tab
            items={[
              {
                head : "DIRECTORY",
                body : <Text>ページごとにフォルダを分割し、TOPページも(home)フォルダ内で完結させています。全ページで同じ規則を成立させ、対象ファイルを迷わず特定できるよう設計いたしました。</Text>,
              },
              {
                head : "TOKEN",
                body : <Text>色はGlobal Token（色そのもの）とAlias Token（役割）の2層に分け、コンポーネントからはAliasのみを参照します。</Text>,
              },
              {
                head : "THEME",
                body : <Text>htmlのdata-theme属性を切り替え、Alias Tokenの中身だけを差し替えています。コンポーネント側の記述は変わりません。</Text>,
              },
            ]}
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<Tab
          items={[
            {head : "タブ1", body : <Text>本文1</Text>},
            {head : "タブ2", body : <Text>本文2</Text>},
          ]}
        />`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="ACCORDION"
          lead="開閉"
          id="accordion"
        />
        <Text className="u-mt-24">
          クリックで本文を開閉する部品です。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <Accordion
            head="ディレクトリはどう分けていますか"
            body={<Text>Next.js App Routerの構成に合わせ、ページごとにフォルダを分割しています。コンポーネントはlayoutとuiの2つに分け、役割を明確にしています。</Text>}
          />
          <Accordion
            head="パーツ同士の余白はどう管理していますか"
            body={<Text>コンポーネントの親要素にはmarginを持たせず、呼び出し側がu-mt-*で指定します。繰り返し並ぶ要素については、親をflexまたはgridにしてgapで処理しています。</Text>}
          />
          <Accordion
            head="ダークモードはどう実装していますか"
            body={<Text>htmlのdata-theme属性を切り替え、Alias Tokenの中身だけを差し替えています。選択した値はlocalStorageに保存し、次回アクセス時に復元します。</Text>}
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<Accordion
          head="見出し"
          body={<Text>開いた時に表示される本文</Text>}
        />`}
        </CodeBlock>
      </section>

      {/* ══════════ 複合 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="CARD"
          lead="制作物の一覧項目"
          id="card"
        />
        <Text className="u-mt-24">
          画像・カテゴリ・タイトル・本文・ラベルをまとめた一覧項目です。<br />
          linkを渡すと全体がaタグになり、渡さなければdivのままです。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <div className="u-d-flex u-fd-column u-gap-40">
            <Card
              image="/images/sample.svg"
              category="Dummy"
              title="ダミー"
              content="ダミーのテキストです。ダミーのテキストです。ダミーのテキストです。ダミーのテキストです。"
              labels={["DUMMY","DUMMY"]}
            />
            <Card
              image="/images/sample.svg"
              category="Dummy"
              title="ダミー"
              content="ダミーのテキストです。ダミーのテキストです。ダミーのテキストです。ダミーのテキストです。"
              labels={["DUMMY"]}
            />
          </div>
        </div>
        <CodeBlock className="u-mt-24">
        {`<Card
          image="/images/sample.webp"
          category="Web Site"
          title="タイトル"
          content="説明文"
          labels={["HTML","CSS"]}
          href="https://example.com"
        />`}
        </CodeBlock>
      </section>

      {/* ══════════ ページ構造 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="CODEBLOCK"
          lead="コード表示"
          id="codeblock"
        />
        <Text className="u-mt-24">
          コードを表示する部品です。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <CodeBlock>
          {`@include gen-responsive("u-gap-40", gap, 40px);   // これ1行で u-gap-40 / u-gap-40-pc / u-gap-40-sp の3つが生成される`}
          </CodeBlock>
        </div>
        <CodeBlock className="u-mt-24">
        {`<CodeBlock>
        {\`const value = 1;
        console.log(value);\`}
        </CodeBlock>`}
        </CodeBlock>
        <Text className="u-mt-24" variant="note">
          SP幅にすると、PREVIEW枠の中が横スクロールします。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="PAGEHERO"
          lead="ページ先頭の見出し"
          id="page-hero"
        />
        <Text className="u-mt-24">
          各ページの先頭に1つだけ置く見出しです。ページ名とその補足を表示します。
        </Text>
        <div className={clsx(styles["preview"],"u-mt-24")}>
          <PageHero
            title="SAMPLE"
            lead="これはサンプルのページです。"
          />
        </div>
        <CodeBlock className="u-mt-24">
        {`<PageHero
          title="SAMPLE"
          lead="ページ名の補足"
        />`}
        </CodeBlock>
      </section>
    </main>
  );
}
