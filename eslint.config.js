// eslint.config.js

import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin, { configs as tsConfigs } from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals'; // ブラウザ等のグローバルを取り込むため

export default [
  {
    // =============================================
    // TypeScript (.ts/.tsx) 用の設定
    // =============================================
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules'],

    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2021,
      // ブラウザ環境のグローバル変数を認識
      globals: {
        ...globals.browser,
      },
    },

    // プラグイン定義
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },

    // React バージョンを自動検出
    settings: {
      react: {
        version: 'detect',
      },
    },

    // ルール (推奨設定をスプレッド展開 + カスタム追記)
    rules: {
      // -----------------------
      // ESLint (JS) 推奨設定
      // -----------------------
      ...js.configs.recommended.rules,

      // -----------------------
      // TypeScript ESLint 推奨設定
      //   (サブパス直指定でエラーになる場合は
      //    { configs } から取得する方法が確実)
      // -----------------------
      ...tsConfigs.recommended.rules,

      // -----------------------
      // React プラグイン推奨
      // 新しい JSX トランスフォーム用
      // -----------------------
      ...reactRecommended.rules,
      ...reactJsxRuntime.rules,

      // -----------------------
      // カスタム追加・上書き
      // -----------------------
      'react/react-in-jsx-scope': 'off', // React 17+ では不要
      'prettier/prettier': 'warn',       // Prettier の整形漏れを警告
    },
  },
  {
    // =============================================
    // JavaScript (.js/.jsx) 用の設定
    // =============================================
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['node_modules'],

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // ESLint (JS) 推奨
      ...js.configs.recommended.rules,

      // React 推奨
      ...reactRecommended.rules,
      ...reactJsxRuntime.rules,

      // カスタム
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'warn',
    },
  },
];
