# ==========================
#  Stage 1: Development
# ==========================
FROM node:18-alpine AS dev
WORKDIR /usr/src/app

# 依存関係のキャッシュを活かすため package.json と package-lock.json を先にコピー
COPY package*.json ./
RUN npm install

# プロジェクト全体をコピー
COPY . .

# 開発時に使うポート
EXPOSE 5173

# docker-compose.ymlにコマンドを移動（ホストマシーン上にもnode_modulesを保存するため）
# # デフォルトコマンド (ホットリロード)
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================
#  Stage 2: Build
# ==========================
FROM node:18-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# 本番用にビルド
RUN npm run build

# ==========================
#  Stage 3: Production
# ==========================
# 本番配信には軽量な Web サーバー (nginx や httpd など) を利用
FROM nginx:alpine AS production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Nginx のデフォルトポート
EXPOSE 80

# コンテナ起動時に nginx を立ち上げる
CMD ["nginx", "-g", "daemon off;"]
