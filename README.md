# UmiArchive

Vite + React + TypeScript をベースにしたモダンなフロントエンドアプリケーションです。
コンテナ環境(Docker)での開発から、本番用ビルド、S3 + CloudFront へのデプロイまでを行う構成を採用しています。

---

## 目次

- [UmiArchive](#umi-archive)
  - [目次](#目次)
  - [技術スタック](#技術スタック)
  - [バージョン](#バージョン)
  - [ローカル開発環境の構築](#ローカル開発環境の構築)
    - [Node/NPM を使う方法](#nodenpm-を使う方法)
    - [Docker (Docker Compose) を使う方法](#docker-docker-compose-を使う方法)
  - [Linter / Formatter の実行](#linter--formatter-の実行)
  - [本番ビルド](#本番ビルド)
    - [npm を使用する場合](#npm-を使用する場合)
    - [Docker (マルチステージ) を使用する場合](#docker-マルチステージ-を使用する場合)
  - [デプロイ手順 (S3 + CloudFront)](#デプロイ手順-s3--cloudfront)
    - [S3 + CloudFront へのデプロイ概略](#s3--cloudfront-へのデプロイ概略)
  - [その他](#その他)

---

## 技術スタック

- **言語**: TypeScript, JavaScript (React)
- **ビルドツール**: [Vite](https://vitejs.dev/)
- **UIフレームワーク**: [React](https://react.dev/)
- **スタイリング**: CSS Modules + Sass/SCSS
- **バージョン管理**: Git / GitHub
- **パッケージ管理**: npm
- **コンテナ**: Docker (マルチステージビルド)
- **ホスティング / CI/CD**: AWS S3 + CloudFront、GitHub Actions
- **コード品質管理**: ESLint, Prettier

---

## バージョン

| 項目              | バージョン   | 備考                                       |
| :---------------: | :----------: | :----------------------------------------- |
| **Node.js**       | 18 (LTS)     | Node 18 系を推奨                           |
| **npm**           | 8.x 以上     | Node.js 18 インストール時に同梱           |
| **React**         | 18.x 以上    |                                           |
| **TypeScript**    | 4.x 以上     |                                           |
| **Vite**          | 4.x 以上     | テンプレートによっては多少前後する場合あり |
| **Docker**        | 20.x 以上    | ローカルに Docker がインストールされていること |
| **docker-compose**| 1.29 以上    | ローカル環境で Docker Compose を利用する場合 |
| **AWS CLI**       | 最新版       | AWS CLI を使用してデプロイを行います         |

---

## ローカル開発環境の構築

### Node/NPM を使う方法

1. **リポジトリのクローン**

   ```bash
   git clone git@github.com:yohei1444/UmiArchive.git
   cd UmiArchive
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **開発サーバの起動 (ホットリロード対応)**

   ```bash
   npm run dev
   ```

4. **ブラウザで確認**
   下記 URL にアクセスするとアプリが表示されます。
   ```
   http://localhost:5173
   ```

### Docker (Docker Compose) を使う方法

1. **リポジトリのクローン**

   ```bash
   git clone https://github.com/your-org/UmiArchive.git
   cd UmiArchive
   ```

2. **Docker イメージのビルド・コンテナ起動 (docker compose)**

   ```bash
   docker compose up --build
   ```

   > **メモ**: `docker-compose.yml` で `target: dev`（開発ステージ）を指定している場合は、ホットリロード付きのローカル開発環境が起動します。

3. **Docker コンソールへのアクセス**

   ```bash
   docker compose exec umi-archive sh
   ```

4. **ブラウザで確認**
   下記 URL にアクセスするとアプリが表示されます。
   ```
   http://localhost:5173
   ```

---

## Linter / Formatter の実行

プロジェクトでは **ESLint** と **Prettier** を導入しており、以下のコマンドで実行可能です。

```bash
# ESLint による静的解析・自動修正
npm run lint

# Prettier によるコードフォーマット
npm run format
```

> **推奨**: コミット前に lint & format を実行しておくと、きれいなコードを保ちやすくなります。

---

## 本番ビルド

### npm を使用する場合

```bash
# ビルド成果物が dist/ フォルダに出力される
npm run build
```

### Docker (マルチステージ) を使用する場合

```bash
# マルチステージビルド（production ステージを使用）
docker build -t umi-archive-prod --target production .
docker run -it --rm -p 8080:80 umi-archive-prod

# ブラウザで http://localhost:8080 へアクセス
```

---

## デプロイ手順 (S3 + CloudFront)

### S3 + CloudFront へのデプロイ概略

1. **ビルド**
プロジェクトルートにて以下のコマンドを実行し、dist/ フォルダに本番用成果物を出力します。

   ```bash
   npm run build
   ```

2. **AWS CLI を利用したアップロード**
新たなアップロード内容が速やかに反映されるよう、CloudFront のキャッシュを無効化します。
   ```bash
   aws cloudfront create-invalidation --distribution-id <CloudFront_Distribution_ID> --paths "/*"
   ```
※ <CloudFront_Distribution_ID> は Terraform の outputs や AWS コンソールから取得してください。
3. **CloudFront のキャッシュ無効化**

   ```bash
   amplify add hosting
   # 適宜「Hosting with Amplify Console」を選択
   ```

4. **ブラウザで確認**
CloudFront のドメイン（例: https://d1fvblgvj7horg.cloudfront.net/）にアクセスし、サイトが正しく表示されることを確認します。

---

## その他

- **コードのカスタマイズ**
  コンポーネント単位で `.module.scss` を用いることで、CSS モジュールを効率的に管理できます。
- **設定の変更**
  Vite の設定は `vite.config.ts` でカスタマイズできます。