import { getOpenAIClient } from '../utils/openai'

interface GenerateScriptRequest {
  mode: 'subtitle' | 'ai-demo' | 'confirmation' | 'practice'
  roleplayDesign?: {
    situation?: string
    opponentSetting?: string
    missions?: {
      required?: string[]
      scoring?: string[]
      failure?: string[]
    }
    points?: Array<{
      question: string
      criteria: string
      example: string
    }>
  }
  files?: Array<{
    name: string
    content?: string
    dataType?: string
  }>
}

interface GenerateScriptResponse {
  mode: string
  script: string
}

// Mode-specific script generation prompts
const modePrompts: Record<string, string> = {
  'subtitle': `あなたは営業・接客のロールプレイ台本作成の専門家です。
与えられた情報を元に、台本モード用の会話台本を作成してください。

【台本モードの特徴】
- ユーザーが正しい応対を学ぶための台本形式
- 各発話にはタイミングと説明を含める
- 重要なポイントには★マークをつける

【出力形式】
---
[シーン1: 挨拶]
👔 相手: 「（発話内容）」
📝 ポイント: （このシーンで学ぶべきこと）

👤 あなた: 「（理想的な発話内容）」
★ 重要: （なぜこの発話が良いのか）
---
（以降、シーン2, 3...と続く）`,

  'confirmation': `あなたは営業・接客のロールプレイ確認問題作成の専門家です。
与えられた情報を元に、確認モード用の会話スクリプトを作成してください。

【確認モードの特徴】
- ユーザーの理解度を確認するためのQ&A形式
- 各シーンで「正解」「不正解パターン」「解説」を含める
- 段階的に難易度を上げる

【出力形式】
---
[確認ポイント1: テーマ名]
💬 状況: （シチュエーション説明）
❓ 質問: 「（相手の発話）」に対して、どう返答しますか？

✅ 正解例: 「（理想的な返答）」
❌ 不正解例: 「（避けるべき返答）」
📖 解説: （なぜ正解が良いのか、不正解がダメなのかの説明）
---
（以降、確認ポイント2, 3...と続く）`,

  'practice': `あなたは営業・接客のロールプレイシナリオ作成の専門家です。
与えられた情報を元に、実戦モード用の会話シナリオを作成してください。

【実戦モードの特徴】
- リアルな顧客とのやり取りをシミュレーション
- 予期せぬ質問や反論も含める
- 評価基準を明確にする

【出力形式】
---
[シナリオ概要]
🎯 目標: （このロープレで達成すべきこと）
⏱️ 想定時間: （目安時間）
📊 評価ポイント: （何を評価するか）

[会話の流れ]
1️⃣ 導入フェーズ
   相手の初期態度: （どんな状態で始まるか）
   想定される展開: （どう進むか）

2️⃣ 本題フェーズ
   主要な質問/反論: （相手が言いそうなこと）
   対応のポイント: （どう対処すべきか）

3️⃣ クロージングフェーズ
   成功パターン: （うまくいった場合）
   失敗パターン: （つまずいた場合）
---`
}

export default defineEventHandler(async (event): Promise<GenerateScriptResponse> => {
  const body = await readBody<GenerateScriptRequest>(event)
  const { mode, roleplayDesign, files = [] } = body

  if (!mode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Mode is required'
    })
  }

  console.log(`📜 Generating script for mode: ${mode}`)

  try {
    const openai = getOpenAIClient()

    // Build context from design and files
    const context = buildContext(roleplayDesign, files)
    const modePrompt = modePrompts[mode] || modePrompts['practice']

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: modePrompt
        },
        {
          role: 'user',
          content: `以下の情報を元に、${getModeLabel(mode)}用の会話スクリプトを作成してください。

${context}

上記を踏まえて、実践的で学習効果の高いスクリプトを生成してください。`
        }
      ]
    })

    const generatedScript = response.choices[0]?.message?.content || generateFallbackScript(mode)

    return {
      mode,
      script: generatedScript
    }
  } catch (error: any) {
    console.error('Generate Script API Error:', error)

    // Return a fallback script if API fails
    return {
      mode,
      script: generateFallbackScript(mode)
    }
  }
})

function buildContext(
  design: GenerateScriptRequest['roleplayDesign'],
  files: GenerateScriptRequest['files']
): string {
  const sections: string[] = []

  // Design information
  if (design) {
    if (design.situation) {
      sections.push(`【状況設定】\n${design.situation}`)
    }

    if (design.opponentSetting) {
      sections.push(`【相手の設定】\n${design.opponentSetting}`)
    }

    if (design.missions) {
      const missionText: string[] = []
      if (design.missions.required?.length) {
        missionText.push(`必須ミッション: ${design.missions.required.join(', ')}`)
      }
      if (design.missions.scoring?.length) {
        missionText.push(`加点ポイント: ${design.missions.scoring.join(', ')}`)
      }
      if (design.missions.failure?.length) {
        missionText.push(`減点ポイント: ${design.missions.failure.join(', ')}`)
      }
      if (missionText.length) {
        sections.push(`【ミッション】\n${missionText.join('\n')}`)
      }
    }

    if (design.points?.length) {
      const pointsText = design.points.map((p, i) =>
        `${i + 1}. ${p.question}\n   基準: ${p.criteria}\n   例: ${p.example}`
      ).join('\n')
      sections.push(`【評価ポイント】\n${pointsText}`)
    }
  }

  // File information
  if (files?.length) {
    const filesByType: Record<string, string[]> = {}

    for (const file of files) {
      const type = file.dataType || 'その他'
      if (!filesByType[type]) {
        filesByType[type] = []
      }
      filesByType[type].push(`${file.name}: ${file.content?.substring(0, 500) || '(内容なし)'}`)
    }

    for (const [type, fileList] of Object.entries(filesByType)) {
      sections.push(`【${type}】\n${fileList.join('\n\n')}`)
    }
  }

  return sections.join('\n\n') || '（設計情報なし - 一般的な営業/接客シナリオを生成します）'
}

function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    'subtitle': '台本モード',
    'ai-demo': 'お手本モード',
    'confirmation': '確認モード',
    'practice': '実戦モード'
  }
  return labels[mode] || mode
}

function generateFallbackScript(mode: string): string {
  const fallbacks: Record<string, string> = {
    'subtitle': `---
[シーン1: 挨拶]
👔 相手: 「いらっしゃいませ」
📝 ポイント: 第一印象が大切です

👤 あなた: 「お忙しいところありがとうございます。〇〇会社の△△と申します」
★ 重要: 明るく、はっきりと名乗ることで信頼感を与えます
---

※ 詳細な設計情報を入力すると、より具体的な台本が生成されます。`,

    'confirmation': `---
[確認ポイント1: 挨拶の基本]
💬 状況: 初めてのお客様との商談開始時
❓ 質問: お客様に最初に何と言いますか？

✅ 正解例: 「本日はお時間をいただきありがとうございます」
❌ 不正解例: 「えーと、今日は...」
📖 解説: 感謝の気持ちを最初に伝えることで、良い印象を与えられます
---

※ 詳細な設計情報を入力すると、より具体的な確認問題が生成されます。`,

    'practice': `---
[シナリオ概要]
🎯 目標: 商品/サービスの提案から契約までを行う
⏱️ 想定時間: 10-15分
📊 評価ポイント: ヒアリング力、提案力、クロージング力

[会話の流れ]
1️⃣ 導入フェーズ
   相手の初期態度: やや警戒している
   想定される展開: 簡単な自己紹介から始める

2️⃣ 本題フェーズ
   主要な質問/反論: 「価格が高い」「今は必要ない」
   対応のポイント: 具体的なメリットを数字で示す

3️⃣ クロージングフェーズ
   成功パターン: 次回アポイントの約束
   失敗パターン: 「検討します」で終わる
---

※ 詳細な設計情報を入力すると、より具体的なシナリオが生成されます。`
  }

  return fallbacks[mode] || fallbacks['practice']
}
