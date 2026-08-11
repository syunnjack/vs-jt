# vs-jt / スグスウ

登録・アプリ不要で近くの喫煙スポット、直近の混雑状況、口コミを確認できるスマホ特化サイトです。正式ドメインは `sugusuu.jp`、`sugusuu.com` はメインドメインへ転送します。

## ローカル起動

```bash
npm install
npm run dev
```

## MVPに含むもの

- 現在地中心のスポットマップと絞り込み
- リスト表示、スポット詳細、ルート導線
- ゲストによる1タップ混雑投稿とポイント
- QRチェックインのUIフロー
- 写真・口コミ閲覧導線
- 空き通知の許可フロー
- PWAマニフェスト / Service Worker
- Supabase + PostGIS用の初期スキーマ

本番接続時はMapboxまたはMapLibre、Supabase、Web Push送信API、画像Storageを環境変数経由で接続してください。

## ビルドとLint

```bash
npm run lint
npm run build
```

## GitHub Actionsデプロイ

`main` / `master` への push で [ .github/workflows/deploy.yml ](.github/workflows/deploy.yml) が実行されます。

事前に以下の Repository Secrets を設定してください。

- SSH_HOST
- SSH_USERNAME
- SSH_PRIVATE_KEY

デプロイ先は `sugusuu.jp/public_html` を想定しています。
