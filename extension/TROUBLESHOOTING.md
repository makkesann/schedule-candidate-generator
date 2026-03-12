# トラブルシューティングガイド

このドキュメントは、Chrome拡張使用時によく発生するエラーと解決方法をまとめたものです。

## OAuth2認証エラー

### エラー: "OAuth2 request failed: Service responded with error: 'bad client id: {0}'"

**原因**: `manifest.json`のクライアントIDが正しく設定されていません。

**解決方法**:

#### 1. manifest.jsonを確認

`extension/manifest.json`の15行目を確認してください：

```json
"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com"
```

**`YOUR_CLIENT_ID`のままになっていませんか？**

これはプレースホルダーです。実際のクライアントIDに置き換える必要があります。

#### 2. Google Cloud ConsoleでクライアントIDを取得

まだクライアントIDを取得していない場合：

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」→「Google Calendar API」を有効化
4. 「APIとサービス」→「OAuth同意画面」を設定
   - ユーザータイプ: 外部
   - アプリ名、メールアドレスを入力
   - テストユーザーに自分のGoogleアカウントを追加
5. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuthクライアントID」
6. アプリケーションの種類: **Chromeアプリ**
7. アプリケーションID: まず `extension_id_placeholder` と入力（後で更新）
8. **クライアントIDをコピー**

クライアントIDの形式は以下のようになります：
```
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

#### 3. manifest.jsonを更新

`extension/manifest.json`を開き、15行目を更新：

**変更前**:
```json
"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com"
```

**変更後** (例):
```json
"client_id": "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
```

#### 4. 拡張機能を再読み込み

1. `chrome://extensions/` を開く
2. 拡張機能の「更新」ボタンをクリック（または削除して再度読み込み）

#### 5. 拡張機能IDをGoogle Cloud Consoleに登録

1. `chrome://extensions/` で拡張機能のID（例：`abcdefghijklmnop`）をコピー
2. Google Cloud Console → 「認証情報」
3. 作成したOAuthクライアントIDを編集
4. アプリケーションID: `extension_id_placeholder` → 実際の拡張機能IDに変更
5. 「保存」

#### 6. 動作確認

1. 拡張機能のアイコンをクリック
2. 「候補を生成」をクリック
3. Google認証画面が表示されるはずです

---

## その他のOAuth関連エラー

### エラー: "invalid_client"

**原因**: クライアントIDが存在しないか、無効です。

**解決方法**:
1. クライアントIDをコピー&ペーストし直す（余分なスペースがないか確認）
2. Google Cloud Consoleで正しいプロジェクトを選択しているか確認
3. クライアントIDが削除されていないか確認

### エラー: "redirect_uri_mismatch"

**原因**: Chrome拡張の場合、このエラーは通常発生しません。WebアプリのクライアントIDを使用している可能性があります。

**解決方法**:
1. Google Cloud Consoleで「Chromeアプリ」タイプのクライアントIDを作成
2. 「Webアプリケーション」タイプは使用しない

### エラー: "access_denied"

**原因**: OAuth同意画面で「キャンセル」をクリックしました。

**解決方法**:
1. 再度「候補を生成」をクリック
2. 認証画面で「許可」をクリック

### エラー: "unauthorized_client"

**原因**: アプリケーションIDが拡張機能のIDと一致していません。

**解決方法**:
1. `chrome://extensions/` で拡張機能のIDを確認
2. Google Cloud Console → 認証情報 → OAuthクライアントIDを編集
3. アプリケーションIDを拡張機能のIDに更新

---

## カレンダー関連エラー

### エラー: "候補が見つかりませんでした"

**原因**: 指定期間内に条件に合う空き時間がありません。

**解決方法**:
1. **検索期間を延ばす**: 7日 → 14日 or 30日
2. **時間帯を広げる**: 09:00-18:00 → 08:00-20:00
3. **週末を含める**: 土日のチェックを追加
4. **会議時間を短くする**: 60分 → 30分
5. **候補数を減らす**: 10件 → 5件 or 3件

### エラー: "カレンダー情報を取得できません"

**原因**: Google Calendar APIが有効化されていないか、権限がありません。

**解決方法**:
1. Google Cloud Console → 「APIとサービス」→「ライブラリ」
2. 「Google Calendar API」を検索
3. 「有効にする」をクリック
4. 拡張機能を再読み込み

### エラー: "Error fetching calendar events"

**原因**: ネットワークエラーまたはAPIクォータ超過。

**解決方法**:
1. インターネット接続を確認
2. しばらく待ってから再試行
3. Google Cloud ConsoleでAPI使用量を確認

---

## UI関連の問題

### 問題: "少なくとも1つの曜日を選択してください"

**原因**: 全ての曜日のチェックが外れています。

**解決方法**:
1. 少なくとも1つの曜日にチェックを入れる

### 問題: 設定が保存されない

**原因**: Chrome Storage APIの権限エラー。

**解決方法**:
1. `manifest.json`に`"storage"`権限があるか確認
2. 拡張機能を再読み込み
3. Chromeの拡張機能ストレージをクリア: `chrome://extensions/` → 詳細 → ストレージをクリア

### 問題: ポップアップが表示されない

**原因**: HTMLやJSのエラー。

**解決方法**:
1. ポップアップを右クリック → 「検証」
2. Console タブでエラーを確認
3. `chrome://extensions/` でエラーが表示されていないか確認

---

## クリップボード関連の問題

### 問題: クリップボードにコピーされない

**原因**: クリップボード権限エラー。

**解決方法**:
1. `manifest.json`に`"clipboardWrite"`権限があるか確認
2. HTTPSページから実行しているか確認（拡張機能のポップアップはHTTPS扱い）
3. ブラウザのクリップボード権限を確認

### 問題: コピーした内容が貼り付けられない

**原因**: クリップボードのフォーマットの問題。

**解決方法**:
1. 別のアプリケーション（メモ帳など）で貼り付けテスト
2. Ctrl+V（Windows）/ Cmd+V（Mac）で貼り付け
3. 結果エリアに表示された内容を手動でコピー

---

## 開発者向けデバッグ

### Chrome DevToolsの使用

#### ポップアップのデバッグ
1. 拡張機能を開く
2. ポップアップを右クリック → 「検証」
3. Console / Network / Sources タブを使用

#### バックグラウンドスクリプトのデバッグ
1. `chrome://extensions/` を開く
2. 「サービスワーカー」のリンクをクリック
3. Console でログを確認

#### ストレージの確認
1. DevTools → Application → Storage → Local Storage
2. `chrome-extension://[拡張機能ID]` を選択
3. 保存された設定を確認

### よく使うデバッグコマンド

```javascript
// ストレージ内容を確認
chrome.storage.local.get(null, (items) => console.log(items));

// ストレージをクリア
chrome.storage.local.clear(() => console.log('Cleared'));

// 認証トークンを確認
chrome.identity.getAuthToken({ interactive: false }, (token) => console.log(token));

// 認証トークンをクリア
chrome.identity.removeCachedAuthToken({ token: 'YOUR_TOKEN' }, () => console.log('Cleared'));
```

---

## まだ解決しない場合

1. **ログを確認**
   - ポップアップのConsole
   - バックグラウンドスクリプトのConsole
   - `chrome://extensions/` のエラー表示

2. **拡張機能を完全に再読み込み**
   - `chrome://extensions/` で削除
   - ブラウザを再起動
   - 拡張機能を再度読み込み

3. **設定を初期化**
   - DevTools → Application → Storage → Local Storage → Clear
   - 設定を初期値に戻す

4. **Chromeを最新版に更新**
   - `chrome://settings/help` で更新を確認

5. **Issueを作成**
   - GitHubリポジトリでIssueを作成
   - エラーメッセージとスクリーンショットを添付

---

## クイックチェックリスト

拡張機能が動作しない場合、以下を確認してください：

- [ ] Google Cloud Consoleでプロジェクトを作成した
- [ ] Google Calendar APIを有効化した
- [ ] OAuth同意画面を設定した（テストユーザー追加済み）
- [ ] OAuthクライアントID（Chromeアプリタイプ）を作成した
- [ ] `manifest.json`のclient_IDを実際のクライアントIDに置き換えた
- [ ] 拡張機能を`chrome://extensions/`で読み込んだ
- [ ] 拡張機能IDをGoogle Cloud ConsoleのアプリケーションIDに登録した
- [ ] Chromeブラウザを最新版に更新した
- [ ] インターネット接続が正常である

すべてチェックが入れば、拡張機能は動作するはずです！
