#!/bin/bash
# Chrome Web Store へのアップロード＆公開申請スクリプト
#
# 事前準備:
#   1. GCPコンソールで「Webアプリケーション」タイプのOAuthクライアントIDを作成
#      - リダイレクトURIに http://localhost:8888 を追加
#   2. 初回のみ ./deploy.sh setup を実行してリフレッシュトークンを取得
#   3. .env ファイルに以下を記入:
#      CWS_CLIENT_ID=<WebアプリのクライアントID>
#      CWS_CLIENT_SECRET=<Webアプリのクライアントシークレット>
#      CWS_REFRESH_TOKEN=<setupで取得したリフレッシュトークン>
#      CWS_APP_ID=efmemhnpabipdokfapcmbhfnbchdjpaf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
EXT_DIR="$SCRIPT_DIR/extension"
ZIP_FILE="$SCRIPT_DIR/extension.zip"

# .envファイル読み込み
load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env ファイルが見つかりません"
    echo "まず ./deploy.sh setup を実行してください"
    exit 1
  fi
  set -a
  source "$ENV_FILE"
  set +a

  if [ -z "${CWS_CLIENT_ID:-}" ] || [ -z "${CWS_CLIENT_SECRET:-}" ] || [ -z "${CWS_REFRESH_TOKEN:-}" ] || [ -z "${CWS_APP_ID:-}" ]; then
    echo "Error: .env に必要な変数が不足しています"
    echo "必要: CWS_CLIENT_ID, CWS_CLIENT_SECRET, CWS_REFRESH_TOKEN, CWS_APP_ID"
    exit 1
  fi
}

# アクセストークン取得
get_access_token() {
  local response
  response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
    -d "client_id=$CWS_CLIENT_ID" \
    -d "client_secret=$CWS_CLIENT_SECRET" \
    -d "refresh_token=$CWS_REFRESH_TOKEN" \
    -d "grant_type=refresh_token")

  ACCESS_TOKEN=$(echo "$response" | python -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
  if [ -z "$ACCESS_TOKEN" ]; then
    echo "Error: アクセストークンの取得に失敗しました"
    echo "$response"
    exit 1
  fi
}

# zipファイル作成
build_zip() {
  echo "==> extension.zip を作成中..."
  rm -f "$ZIP_FILE"
  if command -v zip &>/dev/null; then
    (cd "$EXT_DIR" && zip -r "$ZIP_FILE" . -x "*.md")
  else
    # zip未インストール環境ではPowerShellを使用
    local win_ext_dir win_zip_file
    win_ext_dir=$(cygpath -w "$EXT_DIR" 2>/dev/null || echo "$EXT_DIR")
    win_zip_file=$(cygpath -w "$ZIP_FILE" 2>/dev/null || echo "$ZIP_FILE")
    powershell.exe -NoProfile -Command "
      if (Test-Path '$win_zip_file') { Remove-Item '$win_zip_file' }
      Compress-Archive -Path '$win_ext_dir\\*' -DestinationPath '$win_zip_file'
    "
  fi
  echo "    作成完了: $ZIP_FILE"
}

# Chrome Web Store にアップロード
upload() {
  echo "==> Chrome Web Store にアップロード中..."
  local response
  response=$(curl -s -X PUT \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "x-goog-api-version: 2" \
    -T "$ZIP_FILE" \
    "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$CWS_APP_ID")

  local status
  status=$(echo "$response" | python -c "import sys,json; print(json.load(sys.stdin).get('uploadState','UNKNOWN'))" 2>/dev/null)

  if [ "$status" = "SUCCESS" ]; then
    echo "    アップロード成功"
  else
    echo "    アップロード失敗:"
    echo "$response" | python -m json.tool 2>/dev/null || echo "$response"
    exit 1
  fi
}

# 公開申請
publish() {
  echo "==> 公開申請中..."
  local response
  response=$(curl -s -X POST \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "x-goog-api-version: 2" \
    -H "Content-Length: 0" \
    "https://www.googleapis.com/chromewebstore/v1.1/items/$CWS_APP_ID/publish")

  local status
  status=$(echo "$response" | python -c "import sys,json; r=json.load(sys.stdin); print(r.get('status',['UNKNOWN'])[0])" 2>/dev/null)

  if [ "$status" = "OK" ]; then
    echo "    公開申請完了"
  else
    echo "    公開申請結果:"
    echo "$response" | python -m json.tool 2>/dev/null || echo "$response"
  fi
}

# 初回セットアップ: リフレッシュトークン取得
setup() {
  echo "=== Chrome Web Store デプロイ セットアップ ==="
  echo ""
  echo "事前に GCP コンソールで以下を完了してください:"
  echo "  1. 「Webアプリケーション」タイプの OAuthクライアントID を作成"
  echo "  2. リダイレクトURIに http://localhost:8888 を追加"
  echo ""

  read -rp "WebアプリのクライアントID: " client_id
  read -rp "Webアプリのクライアントシークレット: " client_secret

  local auth_url="https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=${client_id}&redirect_uri=http://localhost:8888"

  echo ""
  echo "以下のURLをブラウザで開いて認証してください:"
  echo "$auth_url"
  echo ""
  echo "リダイレクト先URLの code= パラメータの値をコピーしてください"
  read -rp "認証コード: " auth_code

  echo ""
  echo "リフレッシュトークンを取得中..."
  local response
  response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
    -d "client_id=$client_id" \
    -d "client_secret=$client_secret" \
    -d "code=$auth_code" \
    -d "grant_type=authorization_code" \
    -d "redirect_uri=http://localhost:8888")

  local refresh_token
  refresh_token=$(echo "$response" | python -c "import sys,json; print(json.load(sys.stdin)['refresh_token'])" 2>/dev/null)

  if [ -z "$refresh_token" ]; then
    echo "Error: リフレッシュトークンの取得に失敗しました"
    echo "$response" | python -m json.tool 2>/dev/null || echo "$response"
    exit 1
  fi

  cat > "$ENV_FILE" << EOF
CWS_CLIENT_ID=$client_id
CWS_CLIENT_SECRET=$client_secret
CWS_REFRESH_TOKEN=$refresh_token
CWS_APP_ID=efmemhnpabipdokfapcmbhfnbchdjpaf
EOF

  echo ".env ファイルを作成しました"
  echo "セットアップ完了。 ./deploy.sh で デプロイできます"
}

# メイン
case "${1:-deploy}" in
  setup)
    setup
    ;;
  build)
    build_zip
    ;;
  upload)
    load_env
    get_access_token
    build_zip
    upload
    ;;
  publish)
    load_env
    get_access_token
    publish
    ;;
  deploy)
    load_env
    get_access_token
    build_zip
    upload
    echo ""
    echo "アップロード完了（公開申請は ./deploy.sh publish で行えます）"
    ;;
  *)
    echo "Usage: $0 {setup|build|upload|publish|deploy}"
    echo ""
    echo "  setup   - 初回セットアップ（リフレッシュトークン取得）"
    echo "  build   - extension.zip を作成"
    echo "  upload  - CWSにアップロード"
    echo "  publish - 公開申請"
    echo "  deploy  - build + upload + publish（デフォルト）"
    ;;
esac
