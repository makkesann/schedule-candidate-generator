# 貢献ガイド

このプロジェクトへの貢献を歓迎します！

## 貢献方法

### バグ報告

バグを見つけた場合は、以下の情報を含めてIssueを作成してください：

- **環境情報**
  - OS（Windows / macOS / Linux）
  - Chromeのバージョン
  - 拡張機能のバージョン

- **再現手順**
  1. どのような操作を行ったか
  2. 期待される動作
  3. 実際の動作

- **エラーメッセージ**
  - スクリーンショット（あれば）
  - Console のエラーログ

### 機能要望

新しい機能の提案がある場合：

1. まず既存のIssueを確認
2. 同じ提案がなければ、新しいIssueを作成
3. 以下を含めてください：
   - 機能の説明
   - ユースケース
   - 期待される動作

### プルリクエスト

コードの貢献は大歓迎です！

#### 手順

1. **Forkとクローン**
   ```bash
   git clone https://github.com/YOUR_USERNAME/schedule-candidate-generator.git
   cd schedule-candidate-generator
   ```

2. **ブランチを作成**
   ```bash
   git checkout -b feature/your-feature-name
   # または
   git checkout -b fix/bug-description
   ```

3. **変更を実装**
   - コードを追加・修正
   - 既存のコーディングスタイルに従う
   - 必要に応じてドキュメントを更新

4. **テスト**
   - `extension/TESTING.md` のテスト手順に従う
   - 変更が既存機能を壊していないことを確認
   - 新機能には新しいテスト項目を追加

5. **コミット**
   ```bash
   git add .
   git commit -m "Add: 機能の説明"
   # または
   git commit -m "Fix: バグの説明"
   ```

6. **プッシュ**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **プルリクエストを作成**
   - GitHub上でプルリクエストを作成
   - 変更内容の説明を記載
   - 関連するIssueがあれば言及

#### コミットメッセージの規則

- **Add**: 新機能の追加
- **Fix**: バグ修正
- **Update**: 既存機能の更新
- **Refactor**: リファクタリング
- **Docs**: ドキュメントの変更
- **Style**: コードフォーマットの変更
- **Test**: テストの追加・修正

例：
```
Add: 複数カレンダー対応機能
Fix: 候補が重複する問題を修正
Update: UIのデザインを改善
Docs: READMEにインストール手順を追加
```

### コーディング規約

#### JavaScript

- セミコロンを使用
- インデントは2スペース
- クラス名は PascalCase
- 関数名・変数名は camelCase
- 定数は UPPER_SNAKE_CASE
- コメントは日本語または英語

#### HTML/CSS

- インデントは2スペース
- クラス名は kebab-case
- IDは camelCase

#### 例

```javascript
// Good
class CalendarAPI {
  async getEvents(startDate, endDate) {
    const timeMin = startDate.toISOString();
    return this.fetchEvents(timeMin);
  }
}

// Bad
class calendar_api {
  async GetEvents(start_date,end_date)
  {
    const TimeMin=start_date.toISOString()
    return this.fetchEvents(TimeMin)
  }
}
```

### ドキュメント

コードの変更時は、関連するドキュメントも更新してください：

- **README.md**: 主要な機能変更
- **extension/README.md**: 拡張機能の使い方
- **extension/SETUP.md**: セットアップ手順
- **extension/EXAMPLES.md**: 使用例
- **extension/TESTING.md**: テスト手順

## 開発環境のセットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/makkesann/schedule-candidate-generator.git
   cd schedule-candidate-generator
   ```

2. **Google Cloud Consoleの設定**
   - `extension/SETUP.md` の手順に従う

3. **拡張機能の読み込み**
   - Chrome で `chrome://extensions/` を開く
   - デベロッパーモードを有効化
   - 「パッケージ化されていない拡張機能を読み込む」
   - `extension` フォルダを選択

4. **開発開始**
   - ファイルを編集
   - `chrome://extensions/` で「更新」をクリック
   - テスト

## 質問がある場合

- Issueで質問を作成
- 既存のIssue/PRにコメント
- ディスカッションを利用

## ライセンス

貢献されたコードは MIT License の下で公開されます。

## 行動規範

このプロジェクトでは以下を期待します：

- 敬意を持って対応する
- 建設的なフィードバック
- 他の貢献者を尊重する
- オープンで協力的な態度

## 今後の開発予定

現在検討中の機能：

- [ ] 複数カレンダー対応
- [ ] 共有カレンダーのサポート
- [ ] カスタマイズ可能な出力フォーマット
- [ ] 他のカレンダーサービス対応（Outlook等）
- [ ] オンライン会議URL自動生成
- [ ] 定期的な候補の自動生成
- [ ] ダークモード対応

ご意見・ご提案をお待ちしています！
