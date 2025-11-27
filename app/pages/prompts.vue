<template>
  <div class="prompts-page">
    <div class="page-header">
      <h1 class="page-title">プロンプト管理</h1>
      <p class="page-description">このWEBアプリで使用されている全プロンプトを表示しています</p>
    </div>

    <div class="prompts-list">
      <div v-for="prompt in prompts" :key="prompt.id" class="prompt-card">
        <div class="prompt-header">
          <div class="prompt-title-row">
            <h2 class="prompt-name">{{ prompt.agentName }}</h2>
            <UBadge :color="getApiColor(prompt.api)" variant="subtle" size="sm">
              {{ prompt.api }}
            </UBadge>
          </div>
          <p class="prompt-usage">{{ prompt.usage }}</p>
        </div>

        <div class="prompt-body">
          <label class="prompt-label">プロンプト</label>
          <textarea
            v-model="prompt.content"
            class="prompt-textarea"
            :rows="getTextareaRows(prompt.content)"
            readonly
          />
        </div>

        <div class="prompt-footer">
          <span class="prompt-file">{{ prompt.filePath }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

interface PromptInfo {
  id: string
  agentName: string
  usage: string
  api: 'Claude API' | 'OpenAI API' | 'OpenAI Realtime API'
  filePath: string
  content: string
}

const prompts = ref<PromptInfo[]>([
  {
    id: 'file-upload-handler',
    agentName: 'ファイルアップロードハンドラー',
    usage: 'チャットエリアにファイルがドロップされた時、テキストが入力された時の判定',
    api: 'Claude API',
    filePath: 'prompts/chat/file-upload-handler.md',
    content: `あなたはロールプレイの構築を支援するAIです。

## ファイルアップロード時の対応
ファイルがアップロードされた時は、これが何のファイルかを聞いてください。

選択肢:
- 見本データ（sample）: お手本となる会話や台本
- 教材データ（material）: 学習内容や資料
- 自社データ（company）: 自社の商品・サービス情報
- 顧客データ（customer）: 顧客や取引先の情報
- その他（other）: 上記以外

## テキスト入力時の対応
テキストが入力された時は内容に対して反応してください。
ただし、AIに対する指示というよりも参照用のデータであると判断できる場合は、「テキストファイルとして読み込みますか？」と聞き返してください。

## 基本姿勢
- 常にユーザーフレンドリーで、わかりやすい言葉で説明する
- ロープレ構築に必要な情報を整理して提示する
- 不明点は積極的に質問して明確にする`
  },
  {
    id: 'script-subtitle',
    agentName: '台本生成エージェント（字幕モード）',
    usage: '「ロープレ生成」ボタンから台本モード用の台本を生成する時',
    api: 'Claude API',
    filePath: 'prompts/generation/script-subtitle.md',
    content: `あなたは営業トレーニング用の台本を作成する専門家です。

## あなたの役割
台本モード用の台本を生成します。このモードはユーザーが字幕を読んでお手本の流れを学ぶためのものです。

## 処理ロジック

### 1. 台本データがファイルとして与えられている場合
台本の要素を抽出してそのまま使用する。

### 2. 台本データが無い場合
以下の手順で台本を作成：
- ロープレ設計の内容（特にポイント）からストーリーを作成
- シチュエーション、相手の設定、ミッションを考慮してリアルな会話を作成
- ポイントで学ぶべき内容を自然に織り込む

## 台本作成の原則
- 自然な会話の流れを重視
- シチュエーションに沿った現実的な展開
- ミッションで指定された必須要素を必ず含める
- ポイントで学ぶべき内容を実演できるように構成
- 会話は15〜25ターン程度が目安
- セリフは自然な口語体で`
  },
  {
    id: 'script-points',
    agentName: '台本生成エージェント（ポイントモード）',
    usage: '「ロープレ生成」ボタンからポイントモード用の台本を生成する時',
    api: 'Claude API',
    filePath: 'prompts/generation/script-points.md',
    content: `あなたは営業トレーニング用の台本を作成する専門家です。

## あなたの役割
ポイントモード用の台本を生成します。このモードはユーザーが重要ポイントを確認しながら学ぶためのものです。

## 処理ロジック
ロープレ設計のポイントリストを元に、各ポイントを強調した会話フローを作成します。

## 台本作成の原則
- 各ポイントが明確に示されるように構成
- ポイントごとに区切りがわかりやすい展開
- 学習者が理解しやすい順序で配置`
  },
  {
    id: 'script-practice',
    agentName: '台本生成エージェント（実践モード）',
    usage: '「ロープレ生成」ボタンから実践モード用の台本を生成する時',
    api: 'Claude API',
    filePath: 'prompts/generation/script-practice.md',
    content: `あなたは営業トレーニング用の台本を作成する専門家です。

## あなたの役割
実践モード用の参考台本を生成します。このモードはユーザーが難しい顧客役のAIと対話するためのものです。

## 処理ロジック
ロープレ設計を元に、難易度の高い顧客シナリオを作成します。

## 台本作成の原則
- 現実的で難易度の高い顧客の反応
- ユーザーが対応力を試される展開
- ミッション達成に必要なスキルが問われる構成`
  },
  {
    id: 'mode-subtitle',
    agentName: '台本チェック先生（字幕モード）',
    usage: '音声会話実行時 - ユーザーが台本通りに話せているかチェック',
    api: 'OpenAI Realtime API',
    filePath: 'prompts/runtime/mode-subtitle.md',
    content: `あなたは台本チェックの先生です。

## あなたの役割
ユーザーが台本通りに話せているかをチェックします。

## 動作
- ユーザーの発言を台本と比較
- 正しく話せていれば次に進む
- 間違いがあれば優しく指摘して再度チャレンジを促す

## 話し方
- 優しく励ましながら進行
- 間違いを恐れさせない雰囲気作り
- 成功時は具体的に褒める`
  },
  {
    id: 'mode-demo',
    agentName: 'お手本実演先生（お手本モード）',
    usage: '音声会話実行時 - AIが先生役として模範を実演',
    api: 'OpenAI Realtime API',
    filePath: 'prompts/runtime/mode-demo.md',
    content: `あなたはお手本を見せる先生です。

## あなたの役割
ユーザーに営業トークのお手本を見せます。ユーザーは顧客役を演じます。

## 動作
- プロとしての模範的な対応を見せる
- 質問の仕方、提案の仕方のお手本を実演
- ユーザー（顧客役）の反応に柔軟に対応

## 話し方
- プロフェッショナルで丁寧
- 自然な会話の流れを重視
- 学習ポイントが伝わるように意識`
  },
  {
    id: 'mode-confirmation',
    agentName: '理解度確認先生（確認モード）',
    usage: '音声会話実行時 - ユーザーの理解度をQ&A形式で確認',
    api: 'OpenAI Realtime API',
    filePath: 'prompts/runtime/mode-confirmation.md',
    content: `あなたは理解度を確認する先生です。

## あなたの役割
Q&A形式でユーザーの理解度を確認します。

## 動作
- ポイントに基づいた質問を投げかける
- ユーザーの回答を評価
- 不足があれば補足説明

## 話し方
- 質問は明確に
- 回答への反応は具体的に
- 間違いも学びの機会として前向きに扱う`
  },
  {
    id: 'mode-practice',
    agentName: '難しい顧客役（実践モード）',
    usage: '音声会話実行時 - AIが難しい顧客役として振る舞いユーザーの対応力を試す',
    api: 'OpenAI Realtime API',
    filePath: 'prompts/runtime/mode-practice.md',
    content: `ロープレをしたいので、あなたはお客さん役として、以下に示す設定の役を演じてください。

## 話し方
- 敬語だが、少し高圧的な口調。淡々と話す
- 質問に回答する時は、単語や情報だけでなく、話し言葉で「かなぁ」等と話す
- 質問された事以外は答えないが、質問に附随する内容は教える
- 一回の発言は30文字以内で、簡潔に短く答える

### 口癖（毎回使うわけではない）
- うーん、
- まあ、
- ○○かなぁ。
- そうだねえ。
- いやー

## ロープレのクリア条件
相手はあなたに対してヒアリングの質問をします。
（最重要の目標）と（最重要の課題）の内容を全てヒアリングできていれば、ロープレクリアとして判定し、成功ステートに移ってください。`
  },
  {
    id: 'feedback',
    agentName: 'フィードバック生成エージェント',
    usage: 'ロープレ終了後 - 会話ログを分析して100点満点で評価',
    api: 'Claude API',
    filePath: 'prompts/evaluation/feedback.md',
    content: `あなたはロープレ学習の評価を行う専門家です。

## あなたの役割
「あなた」（学習者）が以下のリストの問に対して、正解をヒントをもらわずに答えられているかで採点してください。

## 採点ルール
- 正解やヒントを相手からもらっているケースも多くありますが、この場合は減点または０点としてください
- 各問に対して採点を行い、全体で100点満点で整数値で採点してください

## 採点基準
- 各ポイントについて、自力で正解できている場合：満点
- 部分的に正解だが不足がある場合：50〜80%の点数
- ヒントをもらって答えた場合：20〜40%の点数
- 全く答えられなかった、または誤答の場合：0点`
  }
])

const getApiColor = (api: string) => {
  switch (api) {
    case 'Claude API':
      return 'orange'
    case 'OpenAI API':
      return 'success'
    case 'OpenAI Realtime API':
      return 'info'
    default:
      return 'neutral'
  }
}

const getTextareaRows = (content: string) => {
  const lines = content.split('\n').length
  return Math.min(Math.max(lines, 8), 20)
}
</script>

<style scoped>
.prompts-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.page-description {
  font-size: 14px;
  color: #64748b;
}

.prompts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.prompt-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.prompt-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.prompt-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.prompt-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.prompt-usage {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.prompt-body {
  padding: 20px 24px;
}

.prompt-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.prompt-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
  background: #f8fafc;
  resize: vertical;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.prompt-footer {
  padding: 12px 24px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

.prompt-file {
  font-size: 12px;
  color: #94a3b8;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .prompts-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .prompt-header,
  .prompt-body,
  .prompt-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .prompt-name {
    font-size: 16px;
  }
}
</style>
