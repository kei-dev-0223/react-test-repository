import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 静的サイトとしてエクスポートする設定
  trailingSlash: true, // /about/ でアクセスできるよう about/index.html 形式で出力する
};

export default nextConfig;