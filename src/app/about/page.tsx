// コンポーネント
import PageHero from "@/components/ui/PageHero/PageHero";
import Timeline from "@/components/ui/Timeline/Timeline";
import Heading from "@/components/ui/Heading/Heading";
import Text from "@/components/ui/Text/Text";
import List from "@/components/ui/List/List";

// スタイル
import layout from "@/styles/layout.module.scss";

export default function About() {
  return(
    <main className={layout["container-sub"]}>

      <PageHero
        title="About"
        lead="大型サイトの設計を中心に、Webサイトの制作・運用に携わってきました。"
      />

      <div className="u-mt-44-sp u-mt-88-pc u-d-grid u-grid-2col-pc u-gap-x-88-pc u-gap-y-40-sp">
        <div>
          <Heading
            title="PROFILE"
            lead="プロフィール"
          />

          <Text className="u-mt-40">
            2016年に4年制大学を卒業後、新卒でフロントエンドエンジニアとしてキャリアをスタートしました。
            IE7対応が必要だった時代から現在のWeb環境まで、さまざまな技術環境で制作・運用を経験しています。
          </Text>

          <List
            className="u-mt-24 u-fs-sm"
            variant="dot"
            items={[
              "専門領域：大型サイトの設計、FLOCSSを用いたCSS設計",
              "得意分野：品質を担保したチーム開発・進行管理",
            ]}
          />
        </div>

        <div>
          <Heading
            title="CAREER"
            lead="経歴"
          />

          <Timeline
            className="u-mt-40"
            items={[
              {
                year: "2016 - 2021",
                content:
                  "制作会社にフロントエンドエンジニアとして新卒入社。LPからコーポレートサイト、大型サイトまで幅広い案件を担当しました。大型サイトではサイト全体の構成やCSS設計を行い、設計内容をもとにメンバーへの実装・量産作業の割り振りや、クライアントとの窓口対応も経験しています。",
              },
              {
                year: "2021 - 2026",
                content:
                  "事業会社へ転職し、インハウスエンジニアとしてECサイトの運用・設計を担当。既存環境との相性や運用面を考慮しながら、サイトのモダン化や既存環境の最適化に取り組んできました。AIを活用した業務効率化やLP制作のテンプレート化など、日々の改善も行っています。現在は会社の核となる大型サイトのリニューアルを担当しています。",
              },
            ]}
          />
        </div>
      </div>

      <div className="u-mt-68-sp u-mt-88-pc">
        <Heading
          title="LEARNING"
          lead="現在の学習"
        />

        <Text className="u-mt-40">
          これまでのWeb制作・運用経験に加え、モダンな技術スタックを活用したサイト設計・開発にも対応できるよう、以下を重点的に学習しています。
        </Text>

        <List
          className="u-mt-24 u-fs-sm"
          variant="dot"
          items={[
            "React / Next.jsを用いたコンポーネント指向の開発",
            "TypeScriptによる型安全で保守性の高いコード設計",
            "既存サイトの運用経験と新しい技術知識を組み合わせ、プロジェクトに応じて適切な技術を選択する力",
          ]}
        />
      </div>
    </main>
  );
}