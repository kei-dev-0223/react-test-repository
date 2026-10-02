/* ==============================================================================
page.tsxで使用されます。
関数に「:string」を記述することで、この関数の戻り値(結果)を文字限定にする。
関数に「React.ReactNode」を記述した場合は、Reactが画面に描けるもの全部OKとなる。今回の場合はアイコンタグごとなので問題なし。
受け取った引数は、code(任意の変数名)に格納されるが、numberの型制限により、数字以外は受け取れない。
============================================================================== */

//ライブラリ
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react"; //お天気アイコンをインポート

// サイト上で表示される「天気名」を書き出します。
export function getWeatherLabel(code: number): string {
  if (code === 0) return "快晴";
  if (code <= 3)  return "曇り";
  if (code <= 48) return "霧";
  if (code <= 57) return "霧雨";
  if (code <= 67) return "雨";
  if (code <= 77) return "雪";
  if (code <= 82) return "にわか雨";
  if (code <= 99) return "雷雨";
  return "不明";
}

// 天気アニメーションの切り替えに使う「種類名」を書き出します。（画面には表示されない）
export function getWeatherType(code: number): string {
  if (code === 0) return "sunny";
  if (code <= 48) return "cloudy";
  if (code <= 67) return "rainy";
  if (code <= 77) return "snowy";
  return "stormy";
}

// サイト上で表示される「天気アイコン」を書き出します。
export function getWeatherIcon(code: number): React.ReactNode {
  if (code === 0)  return <Sun size={16} />;
  if (code <= 3)   return <Cloud size={16} />;
  if (code <= 48)  return <Cloud size={16} />;
  if (code <= 57)  return <CloudRain size={16} />;
  if (code <= 67)  return <CloudRain size={16} />;
  if (code <= 77)  return <CloudSnow size={16} />;
  if (code <= 82)  return <CloudRain size={16} />;
  if (code <= 99)  return <CloudLightning size={16} />;
  return <CloudLightning size={16} />;
}