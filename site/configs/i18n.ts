import type { NuxtI18nOptions } from "@nuxtjs/i18n";

export const i18n: NuxtI18nOptions = {
  defaultLocale: "en",
  lazy: true,
  strategy: "prefix_and_default",
  locales: [
    {
      code: "en",
      name: "English",
      icon: "i-icon-park-outline:english",
      file: "en.yaml"
    },
    {
      code: "sp",
      name: "Spanish",
      icon: "i-material-symbols:language-spanish",
      file: "sp.yaml"
    },
    {
      code: "zh-cn",
      name: "简体中文",
      icon: "i-icon-park-outline:chinese",
      file: "zh-cn.yaml"
    },
    {
      code: "fr",
      name: "Français",
      icon: "i-icon-park-outline:croissant",
      file: "fr.yaml"
    },
    {
      code: "id",
      name: "Bahasa Indonesia",
      icon: "i-flag:id-4x3",
      file: "id.yaml"
    },
    {
      code: "ja",
      name: "日本語",
      icon: "i-flag:jp-4x3",
      file: "ja.yaml"
    }
  ],
  langDir: "i18n",
  compilation: {
    strictMessage: false
  }
};
