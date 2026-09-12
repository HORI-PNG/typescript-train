import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // GitHubの「typescript-train」リポジトリで公開する場合のURL用設定
  base: "/typescript-train/",

  // GitHub Pagesでは main ブランチの /docs を公開対象にする
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },

  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "TypeScript Train",
        short_name: "TS Train",
        description: "オフラインで学べるTypeScript教材アプリ",
        theme_color: "#162238",
        background_color: "#101a2b",
        display: "standalone",
        lang: "ja",
      },
    }),
  ],
});
