# クイックスタートガイド

このガイドに従って、5分で拡張機能を動かせます！

## ステップ1: Google Cloud Consoleの設定（3分）

### 1. プロジェクト作成
1. https://console.cloud.google.com/ を開く
2. 「新しいプロジェクト」→ 名前を入力 → 「作成」

### 2. API有効化
1. 「APIとサービス」→「ライブラリ」
2. 「Google Calendar API」を検索
3. 「有効にする」をクリック

### 3. OAuth設定
1. 「APIとサービス」→「OAuth同意画面」
2. 「外部」を選択 → 「作成」
3. アプリ名とメールアドレスを入力
4. 「保存して次へ」を3回クリック
5. 「テストユーザー」に自分のGoogleアカウントを追加

### 4. クライアントID取得
1. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」
2. 「Chromeアプリ」を選択
3. 名前を入力（例：Meeting Slot Generator）
4. アプリケーションID: `extension_id_placeholder`（後で更新）
5. 「作成」→ クライアントIDをコピー

## ステップ2: 拡張機能の設定（1分）

### 1. manifest.jsonを編集
`extension/manifest.json`を開き、14行目を編集：
```json
"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com"
```
→ コピーしたクライアントIDに置き換える

## ステップ3: Chromeに読み込み（1分）

### 1. 拡張機能を読み込む
1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」
4. `extension`フォルダを選択

### 2. 拡張機能IDを取得
1. 読み込んだ拡張機能の ID（英数字の文字列）をコピー

### 3. Google Cloud Consoleを更新
1. Google Cloud Console → 「認証情報」
2. 作成したOAuthクライアントIDを編集
3. アプリケーションIDを拡張機能のIDに更新
4. 「保存」

## 完了！使ってみよう

1. Chromeツールバーのアイコンをクリック
2. 「候補を生成」をクリック
3. 初回はGoogle認証を許可
4. 候補が自動的にクリップボードにコピーされます！

---

## トラブルシューティング

### ⚠️ OAuth2 request failed: bad client id

**このエラーが出た場合**: `manifest.json`のクライアントIDを確認してください。

`extension/manifest.json`の15行目が以下のようになっていませんか？
```json
"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com"
```

これはプレースホルダーです。**実際のクライアントID**（ステップ1-4で取得した値）に置き換える必要があります。

正しい例：
```json
"client_id": "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
```

詳細な解決方法は **[extension/TROUBLESHOOTING.md](extension/TROUBLESHOOTING.md)** を参照してください。

### 認証エラーが出る
→ `manifest.json`のclient_IDを確認

### 候補が見つからない
→ 検索期間を延ばす（7日 → 14日 or 30日）

### 詳しい使い方は？
→ `extension/README.md` を参照

### 設定を変更したい
→ ポップアップで各種設定を調整できます

### すべてのエラーと解決方法
→ **[extension/TROUBLESHOOTING.md](extension/TROUBLESHOOTING.md)** をご覧ください

---

## 出力例

```
3月15日（金）10時00分〜11時00分
3月15日（金）13時00分〜14時00分
3月18日（月）10時00分〜11時00分
3月19日（火）14時00分〜15時00分
3月20日（水）11時00分〜12時00分
```

## デフォルト設定

- 候補数: 5件
- 会議時間: 60分
- 時間帯: 9:00-18:00
- 曜日: 平日（月〜金）
- 検索期間: 7日間

設定は自由に変更できます！

---

詳細なドキュメント:
- セットアップ: `extension/SETUP.md`
- 使用例: `extension/EXAMPLES.md`
- テスト: `extension/TESTING.md`
- 貢献: `CONTRIBUTING.md`
