import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import vue from "eslint-plugin-vue";
import vueAccessibility from "eslint-plugin-vuejs-accessibility";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default [
  // Ignore patterns
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/.output",
      "**/.nuxt",
      "**/.nitro",
      "**/coverage"
    ]
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  ...vueAccessibility.configs["flat/recommended"],

  // JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    }
  },

  // TypeScript and Vue files
  {
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      // Nuxt auto-imports composables, so disable no-undef for Vue files
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off"
    }
  },

  // Prettier must be last
  prettier
];
