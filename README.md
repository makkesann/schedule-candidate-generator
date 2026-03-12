# 打ち合わせ候補日時生成 Chrome拡張機能

Googleカレンダーの予定から空き時間を計算し、打ち合わせ候補日時を自動生成するChrome拡張機能です。

## プロジェクト概要

このプロジェクトは、ビジネスパーソンが打ち合わせの候補日時を素早く提案できるように支援するChrome拡張機能です。Googleカレンダーと連携し、空き時間を自動的に抽出して、読みやすい日本語フォーマットで候補を生成します。

## 主な機能

- ✅ Googleカレンダーから予定を自動取得
- ✅ 空き時間の自動計算
- ✅ カスタマイズ可能な候補抽出条件
- ✅ ワンクリックでクリップボードにコピー
- ✅ 設定の永続化

## 使用方法

詳細な使用方法とインストール手順は、[extension/README.md](extension/README.md) を参照してください。

## クイックスタート

1. Google Cloud Consoleでプロジェクトを作成し、Google Calendar APIを有効化
2. OAuth 2.0クライアントIDを取得
3. `extension/manifest.json`のclient_IDを更新
4. Chromeで`chrome://extensions/`を開く
5. デベロッパーモードを有効化
6. 「パッケージ化されていない拡張機能を読み込む」で`extension`フォルダを選択

## 技術スタック

- Chrome Extension Manifest V3
- Google Calendar API
- Vanilla JavaScript
- Chrome Storage API
- Chrome Identity API

## ディレクトリ構造

```
.
├── README.md              # このファイル
└── extension/             # Chrome拡張機能
    ├── manifest.json      # 拡張機能の設定
    ├── popup.html         # ポップアップUI
    ├── popup.js           # UIロジック
    ├── calendar.js        # Calendar API連携
    ├── slot-generator.js  # スロット生成ロジック
    ├── formatter.js       # フォーマット処理
    ├── background.js      # バックグラウンドワーカー
    ├── style.css          # スタイル
    ├── icons/             # アイコンファイル
    └── README.md          # 拡張機能の詳細ドキュメント
```

## ライセンス

MIT License

## 貢献

貢献を歓迎します！issueやプルリクエストをお気軽にお送りください。
