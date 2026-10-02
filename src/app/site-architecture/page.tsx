//コンポーネント
import PageHero from "@/components/ui/PageHero/PageHero";
import Heading from "@/components/ui/Heading/Heading";
import Text from "@/components/ui/Text/Text";
import List from "@/components/ui/List/List";
import CodeBlock from "@/components/ui/CodeBlock/CodeBlock";

//スタイル
import layout from "@/styles/layout.module.scss";

export default function SiteArchitecture() {
  return (
    <main className={layout["container-sub"]}>

      <PageHero
        title="Architecture"
        lead="サイト設計について"
      />

      {/* ───── はじめに ───── */}
      <div className="u-mt-44-sp u-mt-88-pc">
        <Text>
          実際のチーム開発や長期運用を想定した設計を心掛けました。
        </Text>
        <Text className="u-mt-24">
          後から関わる人が迷わない状態を目指しています。<br />
          本ページでは、そのために設けたルールと、その判断に至った理由を記載します。
        </Text>
      </div>

      {/* ══════════ 構造 ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="DIRECTORY"
          lead="ディレクトリ設計について"
          id="directory-structure"
        />
        <Text className="u-mt-24">
          Next.js App Routerの構成に合わせ、ページごとにフォルダを分割して管理しています。<br />
          ページ単位で責務を分離することで、将来的な拡張や保守にも対応しやすい構成を目指しました。
        </Text>
        <Text className="u-mt-24">
          TOPページについても例外的に直下へ配置せず、(home)フォルダを作成しその中で完結する構成としました。<br />
          これにより全ページで統一されたディレクトリルールを維持し、改修時に対象ファイルを把握しやすくなる形にいたしました。<br />
          
        </Text>
        <Text className="u-mt-24">
          コンポーネントについても、配置基準を2つに分けています。
        </Text>
        <List
          className="u-mt-16"
          items={[
            <><span className="u-fw-b">layout</span> … 全ページ共通の枠を構成する要素</>,
            <><span className="u-fw-b">ui</span> … ページ内で呼び出す部品</>,
          ]}
        />
        <Text className="u-mt-16" variant="small">
          ヘッダー・フッター・背景レイヤー・ページ遷移演出が前者（layout）にあたります。<br />
          いずれも「1部品1フォルダ」で統一し、呼び出し元が1つしかない部品はその隣に置いています。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="COMPONENT"
          lead="コンポーネント設計について"
          id="component-architecture"
        />
        <Text className="u-mt-24">
          コンポーネントは再利用性と保守性を重視し、UI単位で責務を分離しています。
        </Text>
        <Text className="u-mt-24">
          経験上、後からclassNameやidの追加、HTMLタグの変更などの要件が発生するケースも少なくありませんでした。<br />
          そのため、将来的な仕様変更にも対応しやすいよう、Propsによる柔軟な制御を行える設計としています。
        </Text>
        <CodeBlock className="u-mt-24">
        {`type TextVariant = "body" | "small" | "note";
        type TextProps = {
          as?: "p" | "span" | "div";
          variant?: TextVariant;
          children: React.ReactNode;
          className?: string;
          id?: string;
        };`}
        </CodeBlock>
        <Text className="u-mt-24">
          パーツを増やす際は、見た目の違いはvariantで吸収し、ファイルは増やさないよう基準を定めました。<br />
          出力するHTMLタグの違いもasで吸収します。分離するのは、パーツの役割そのものが変わる場合だけです。
        </Text>
        <Text className="u-mt-16" variant="small">
          例えばボタンは、hrefの有無で &lt;Link&gt; と &lt;button&gt; を出し分けています。<br />
          タグは変わりますが「押す」という役割は同じなので、1つのコンポーネントにまとめています。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="NAMING"
          lead="コンポーネントの命名について"
          id="naming"
        />
        <Text className="u-mt-24">
          過去のサイト制作にて、具体的すぎる命名を行った場合、デザイン改修や仕様変更によって命名と役割が乖離するケースがありました。
          「SectionTitle」のように用途を名前に固定すると、別の箇所で使えなくなるためです。
        </Text>
        <Text className="u-mt-24">
          当初はこれを避けるため連番で命名していました。過去のサイト制作ではCSSクラスをc-ttl01のようにしておりました。<br />
          このサイト制作時も、当初はコンポーネントをTtl01のように付けていましたが、いずれも名前から中身が推測できない問題がありました。
        </Text>
        <Text className="u-mt-24">
          そのため現在は、変わらない事実だけを名前にし、見た目の差分はvariantで吸収する方針としています。<br />
          デザインが変わってもパーツの役割は変わらないため、名前と中身が乖離しません。
        </Text>
        <List
          className="u-mt-16"
          items={[
            <>具体的すぎる … SectionTitle / ArticleTitle（用途が固定される）</>,
            <>意味を持たない … c-ttl01 / Ttl01（中身が推測できない）</>,
            <><span className="u-fw-b">採用</span> … Heading + variant（役割は固定、見た目は可変）</>,
          ]}
        />
        <Text className="u-mt-16" variant="small">
          propsの名前も同じ基準で、略語を使わず title / category / image のように書いています。
        </Text>
      </section>

      {/* ══════════ スタイル ══════════ */}
      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="CSS"
          lead="CSS設計について"
          id="css-architecture"
        />
        <Text className="u-mt-24">
          CSS Modulesを採用し、コンポーネント単位でスタイルを閉じ込めることで、クラス名の衝突を防止しています。
        </Text>
        <Text className="u-mt-24">
          一方で、CSS Modulesのみでは命名ルールが開発者ごとにばらつきやすくなるため、チーム開発を想定してBEMを採用しました。<br />
          クラス名から役割や構造を把握しやすくなり、スタイルの検索性や保守性の向上を図っています。
        </Text>
        <Text className="u-mt-24">
          接頭辞については、FLOCSSのような「c-」「p-」は採用していません。<br />
          CSS Modulesはクラス名がハッシュ化され、ファイル名からも所属が判別できるため、不要と判断しました。
        </Text>
        <Text className="u-mt-24">
          ただしユーティリティクラスのみ、例外的に「u-」を付与しています。<br />
          こちらはグローバルに出力されハッシュ化されないため、衝突を避ける名前空間が必要になるためです。
        </Text>
        <CodeBlock className="u-mt-24">
        {`.header__nav-item        → Header_header__nav-item__a1b2   ハッシュ化される
        .u-mt-24                 → u-mt-24                         そのまま出力される`}
        </CodeBlock>
        <Text className="u-mt-24">
          レスポンシブ対応はMixin経由で管理し、ブレークポイントの統一と運用コストの削減を図っています。<br />
          メディアクエリを直接書かないことで、境界値の変更が一箇所で完結します。
        </Text>
        <Text className="u-mt-16" variant="small">
          ヘッダーのみ、ナビ項目数の都合で専用のブレークポイントで制御しております。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="SPACING"
          lead="余白の持ち方について"
          id="spacing"
        />
        <Text className="u-mt-24">
          これまでの案件で「同じコンポーネントなのにページによって余白が異なる」というケースに繰り返し遭遇しました。<br />
          デザイン通りのものを再現するため、隣接要素セレクタで都度調整していましたが、隣接ルールが増え続ける問題が生じました。
        </Text>
        <Text className="u-mt-24">
          原因は、コンポーネント自身が外側の余白を持っていたことでした。
          余白は「その部品がどこに置かれるか」で決まるものであり、部品自身が決められる情報ではありません。
        </Text>
        <Text className="u-mt-24">
          そこでTailwindの思想を参考に、コンポーネントの親要素には余白を持たせず、
          ユーティリティクラスで呼び出し側が指定する方針としました。
          部品の内部の余白（見出しとリード文の間隔など）は、部品自身の関係性なので引き続き内包しています。
        </Text>
        <List
          className="u-mt-16"
          items={[
            <>部品の外側の余白 … 呼び出し側が <span className="u-fw-b">u-mt-*</span> 等で指定</>,
            <>部品の内部の余白 … コンポーネントが保持</>,
          ]}
        />
        <Text className="u-mt-24">
          この考え方はページの組み立てにも適用しています。
          セクション間の余白は見出しではなく、セクションを囲む要素が持ちます。
        </Text>
        <CodeBlock className="u-mt-24">
        {`<section className="u-mt-68-sp u-mt-88-pc">   {/* セクション間の余白 */}
          <Heading />                                {/* 先頭。指定なし */}
          <Text className="u-mt-24" />               {/* セクション内の間隔 */}
        </section>`}
        </CodeBlock>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="TOKEN"
          lead="デザイントークンについて"
          id="design-token"
        />
        <Text className="u-mt-24">
          カラーは、値そのものと役割を分離した2層で管理しています。<br />
          1層目（Global Token）は「色そのもの」を表すパレット。2層目（Alias Token）は「どこで使う色か」という役割です。<br />
          実装側は2層目（Alias Token）を参照し、1層目は直接参照しない方針としました。
        </Text>
        <CodeBlock className="u-mt-24">
        {`/* Global Token（色そのもの） */
        --global-gray-900: #1a1c20;
        --global-teal-500: #008080;

        /* Alias Token（役割） */
        --color-text:        var(--global-gray-900);
        --color-bg-inverse:  var(--global-gray-900);
        --color-icon-accent: var(--global-teal-500);`}
        </CodeBlock>
        <Text className="u-mt-24">
          分離した理由は2つあります。
        </Text>
        <List
          className="u-mt-16"
          items={[
            "色を変更する際、パレットの1行を直すだけで全体に反映されるため",
            "命名を役割ベースに保つため",
          ]}
        />
        <Text className="u-mt-16">
          後者については、仮に「--color-dark」のような見た目の名前にすると、
          ダークテーマで明るい色を入れることになり、名前と中身が矛盾します。
          「text」「bg」「border」といった役割で命名することで、配色が変わっても名前が意味を保ちます。
        </Text>
        <Text className="u-mt-24">
          一方で、ブレークポイントやコンテンツ幅についてはSass変数にしています。<br />
          メディアクエリの条件にはCSS変数を使用できないためです。
        </Text>
        <List
          className="u-mt-16"
          items={[
            "メディアクエリで使う値 … Sass変数。_variables.scss に置く",
            "それ以外の共通の値 … CSS変数。globals.scss の :root に置く",
          ]}
        />
        <Text className="u-mt-24">
          コンテンツ幅もSass変数にしているのは、ヘッダーの切り替え幅がここから計算されるためです。<br />
          CSS変数でもcalc()による計算はできますが、その結果をメディアクエリの条件に渡すことができません。<br />
          計算をビルド時に終わらせる必要があり、参照元となる値も同じ場所に置いています。
        </Text>
        <CodeBlock className="u-mt-24">
        {`$content-width: 960px;
        $gutter-pc: 20px;
        $body-min-width: $content-width + $gutter-pc * 2; // 1000px
        $bp-nav-min: $body-min-width;                     // メディアクエリで使う`}
        </CodeBlock>
        <Text className="u-mt-16" variant="small">
          Sass変数は上記だけです。色・フォントサイズ・hoverの透過率・z-indexはすべてCSS変数にしています。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="THEME"
          lead="テーマ切り替えについて"
          id="theme"
        />
        <Text className="u-mt-24">
          PCは画面右下、SPはメニュー内のボタンで、ライト・ダークを切り替えられます。
          前項のトークン設計が、そのまま活きる仕組みです。
        </Text>
        <Text className="u-mt-24">
          JavaScript側は&lt;html&gt;にdata-theme属性を付け外しするだけで、色の定義を一切持ちません。<br />
          配色はCSS側でAlias Tokenを上書きする形とし、管理場所をCSSに一本化しています。
        </Text>
        <CodeBlock className="u-mt-24">
        {`/* _theme.scss */
        :root[data-theme="dark"] {
          --color-text: var(--global-gray-50);
          --color-bg:   var(--global-gray-900);
        }`}
        </CodeBlock>
        <Text className="u-mt-24">
          この構成により、実装済みの各コンポーネントには一切手を加えずにテーマを追加できます。
        </Text>
        <Text className="u-mt-24">
          色をトークンで管理する一方、トークン化しない領域も定めています。<br />
          天気ページのイラストや背景の演出色は、意図的にトークンから除外しました。<br />
          背景が固定のイラストである以上、その上に乗る要素もテーマの影響を受けるべきではないためです。
        </Text>
      </section>

      <section className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="Z-INDEX"
          lead="重なり順の管理について"
          id="z-index"
        />
        <Text className="u-mt-24">
          z-indexは値が各所に散らばると、後から衝突が発覚しやすい箇所です。<br />
          そのため画面全体に関わる重なり順のみをトークンとして管理し、未使用の階層も先に設定しています。
        </Text>
        <CodeBlock className="u-mt-24">
        {`--z-background:       -1;   /* 背景レイヤー */
        --z-footer-fixed:    100;   /* 画面下部の固定フッター */
        --z-page-transition: 1000;  /* ページ遷移演出 */
        --z-header:          2000;  /* ヘッダー */
        --z-modal-overlay:   3000;  /* モーダル（将来用） */
        --z-toast:           9000;  /* 通知（将来用） */`}
        </CodeBlock>
        <Text className="u-mt-24">
          後から階層を挿入できるよう、1000刻みにしております。<br />
          ヘッダーはSPAを考慮し、遷移中もナビゲーションを操作できる状態を保つために、遷移演出より前面に配置しております。
        </Text>
      </section>

    </main>
  );
}
