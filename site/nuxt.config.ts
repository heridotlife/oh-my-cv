import { pwa } from "./configs/pwa";
import { i18n } from "./configs/i18n";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: "src/",

  devtools: { enabled: false },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      // nuxt 4's crawler no longer seeds the localized routes on its own
      // (it did under nuxt 3.21), so direct hits to locale homes would fall
      // back to the SPA shell. Seed them explicitly + keep crawling for the
      // rest so /sp, /zh-cn, ... get their own prerendered entry points.
      crawlLinks: true,
      routes: [
        "/",
        "/dashboard",
        "/sp",
        "/sp/dashboard",
        "/zh-cn",
        "/zh-cn/dashboard",
        "/fr",
        "/fr/dashboard",
        "/id",
        "/id/dashboard",
        "/ja",
        "/ja/dashboard"
      ]
    }
  },

  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@vite-pwa/nuxt",
    "@nuxtjs/sitemap",
    "radix-vue/nuxt",
    "shadcn-nuxt"
  ],

  css: [
    "@unocss/reset/tailwind.css",
    "katex/dist/katex.min.css",
    "~/assets/css/index.css"
  ],

  i18n,

  shadcn: {
    prefix: "Ui",
    componentDir: "./src/components/ui"
  },

  runtimeConfig: {
    public: {
      googleFontsKey: ""
    }
  },

  colorMode: {
    classSuffix: ""
  },

  app: {
    head: {
      viewport: "width=device-width,initial-scale=1",
      link: [
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#222" }
      ],
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "application-name", content: "Oh My CV!" },
        { name: "apple-mobile-web-app-title", content: "Oh My CV!" },
        { name: "msapplication-TileColor", content: "#fff" },
        { property: "og:url", content: "https://ohmycv.heri.life" },
        { property: "og:type", content: "website" }
      ]
    }
  },

  site: {
    url: "https://ohmycv.heri.life"
  },

  pwa,
  compatibilityDate: "2025-12-23",

  vite: {
    build: {
      chunkSizeWarningLimit: 4096
    }
  }
});
