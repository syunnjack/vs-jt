# vs-jt / SMOKA

登録不要で近くの喫煙スポット、直近の混雑状況、口コミを確認できるスマホ特化PWAです。

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
