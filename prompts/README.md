# なれトレ プロンプト管理

このディレクトリには、なれトレで使用するAIプロンプトが含まれています。
Claude API、OpenAI API 両方で使用できる汎用的な形式で管理しています。

## ディレクトリ構成

```
prompts/
├── README.md                    # このファイル
├── chat/                        # チャット系プロンプト
│   ├── design-assistant.md      # ロープレ設計支援
│   └── file-upload-handler.md   # ファイルアップロード対応
├── generation/                  # 生成系プロンプト（台本生成）
│   ├── script-subtitle.md       # 台本モード用台本
│   ├── script-points.md         # ポイントモード用台本
│   └── script-practice.md       # 実践モード用台本
├── runtime/                     # 実行時プロンプト（音声会話用）
│   ├── mode-subtitle.md         # 台本モード
│   ├── mode-demo.md             # お手本モード
│   ├── mode-confirmation.md     # 確認モード
│   └── mode-practice.md         # 実践モード
└── evaluation/                  # 評価系プロンプト
    └── feedback.md              # フィードバック生成
```

## プロンプト一覧

### 1. チャット系（chat/）

| ファイル | 用途 | 使用場面 |
|----------|------|----------|
| `design-assistant.md` | ロープレ設計の対話支援 | チャットでのやり取り |
| `file-upload-handler.md` | ファイルタイプの確認 | ファイルアップロード時 |

### 2. 生成系（generation/）

| ファイル | 用途 | 使用場面 |
|----------|------|----------|
| `script-subtitle.md` | 字幕モード用台本生成 | ロープレ生成ボタン |
| `script-points.md` | ポイントモード用台本生成 | ロープレ生成ボタン |
| `script-practice.md` | 実践モード用台本生成 | ロープレ生成ボタン |

### 3. 実行時（runtime/）

| ファイル | 用途 | 使用場面 |
|----------|------|----------|
| `mode-subtitle.md` | 台本チェック先生役 | 音声会話実行時 |
| `mode-demo.md` | お手本実演先生役 | 音声会話実行時 |
| `mode-confirmation.md` | 理解度確認先生役 | 音声会話実行時 |
| `mode-practice.md` | 難しい顧客役 | 音声会話実行時 |

### 4. 評価系（evaluation/）

| ファイル | 用途 | 使用場面 |
|----------|------|----------|
| `feedback.md` | 100点満点評価 | ロープレ終了後 |

## 各モードの説明

### 台本モード（Subtitle）
- **目的**: AIがお手本の会話を実演
- **ユーザー**: 聞くだけで学習
- **AI動作**: 台本通りに話せているかをチェック

### お手本モード（Demo）
- **目的**: AIが先生役として模範を実演
- **ユーザー**: 顧客役を演じる
- **AI動作**: 質問の仕方のお手本を見せる

### 確認モード（Confirmation）
- **目的**: ユーザーの理解度を確認
- **ユーザー**: 先生の質問に答える
- **AI動作**: Q&A形式で理解度をチェック

### 実践モード（Practice）
- **目的**: 本番に近い難しい状況での練習
- **ユーザー**: スタッフ役として対応
- **AI動作**: 難しい顧客役として振る舞う

## プロンプトのフォーマット

各プロンプトファイルは以下の構造で記述されています：

```markdown
# タイトル

## 概要
プロンプトの目的と役割

## 使用場面
いつ、どこで使用されるか

## 入力パラメータ
- `paramName`: 説明

## プロンプト
実際のプロンプトテンプレート（{{変数名}} 形式）

## 出力形式
期待される出力のフォーマット
```

## 変数の置換

プロンプト内の `{{変数名}}` は実行時に実際の値に置換されます。

主な変数：
- `{{roleplayDesign}}` - ロープレ設計全体
- `{{generatedScript}}` - 生成された台本
- `{{conversationLog}}` - 会話ログ
- `{{pointsList}}` - ポイントのリスト
- `{{userMessage}}` - ユーザーの入力

## API別の使用方法

### Claude API

```javascript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5-20250514",
  max_tokens: 4096,
  system: promptTemplate.replace('{{変数}}', 実際の値),
  messages: [{ role: "user", content: userInput }]
});
```

### OpenAI API

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: promptTemplate.replace('{{変数}}', 実際の値) },
    { role: "user", content: userInput }
  ]
});
```

### OpenAI Realtime API

```javascript
const session = await openai.realtime.sessions.create({
  model: "gpt-4o-realtime-preview",
  instructions: runtimePrompt.replace('{{変数}}', 実際の値)
});
```

## データフロー

```
ユーザー入力/ファイル
    ↓
[1] chat/design-assistant.md
    ↓ (ロープレ設計)
[2] generation/script-*.md（3種類並列）
    ↓ (台本データ)
[3] runtime/mode-*.md（4種類並列）
    ↓ (システムプロンプト)
実際のロープレ実行（音声会話API）
    ↓ (会話ログ)
[4] evaluation/feedback.md
    ↓
結果表示
```

## ロープレ設計フォーマット

### ①シチュエーション
プレイヤーが置かれた状況（300文字以内）

### ②相手の設定
- 立場・役職
- 性格・特徴
- 抱えている課題

### ③ミッション
- **必須**: 絶対にクリアすべき内容
- **採点**: 減点対象となる内容
- **失敗**: 一発アウトとなる条件

### ④ポイント
Q&A形式で学習内容を定義
```
（問）質問内容
（正解基準）
・ポイント1
・ポイント2
（正答例）具体的な回答例
```

## 旧ファイル名との対応表

| 旧ファイル名 | 新ファイル名 |
|-------------|-------------|
| `roleplay-chat.txt` | `chat/file-upload-handler.md` |
| `roleplay-support-agent.md` | `chat/design-assistant.md` |
| `script-generation-subtitle.md` | `generation/script-subtitle.md` |
| `script-generation-points.md` | `generation/script-points.md` |
| `script-generation-practice.md` | `generation/script-practice.md` |
| `system-prompt-subtitle-mode.md` | `runtime/mode-subtitle.md` |
| `system-prompt-aiDemo-mode.md` | `runtime/mode-demo.md` |
| `system-prompt-confirmation-mode.md` | `runtime/mode-confirmation.md` |
| `system-prompt-practice-mode.md` | `runtime/mode-practice.md` |
| `feedback-prompt.md` | `evaluation/feedback.md` |

## 更新履歴

- 2025-11-25: プロンプト構成を汎用的な形式に再構成
- 2025-11-24: 初版作成、全プロンプト設計書完成
