// Roleplay Chat API - Claude 3.5 Sonnet を使用したロープレ構築チャット
// 処理ID: API-CHAT-002

import type { ChatMessage } from '~/types/roleplay'
import { getAnthropicClient } from '../../utils/anthropic'
import { loadPrompt } from '../../utils/prompt'

interface RoleplayChatRequest {
  messages: ChatMessage[]
  currentDesign?: any
  files?: Array<{ name: string; summary?: string; content?: string }>
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RoleplayChatRequest>(event)
  const { messages, currentDesign, files = [] } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'messages配列が必要です'
    })
  }

  try {
    const anthropic = getAnthropicClient()

    // ロープレチャット用のシステムプロンプトを読み込み
    let systemPrompt = await loadPrompt('design-assistant')

    // システムプロンプトが空の場合のフォールバック
    if (!systemPrompt) {
      systemPrompt = `あなたはロープレ（ロールプレイング）学習コンテンツを作成するアシスタントです。

## あなたの役割
- ユーザーの要望を聞いて、効果的なロープレ設計を支援する
- 状況設定、相手役の設定、ミッション設定などを一緒に考える
- ユーザーがアップロードしたファイルの内容を活用してロープレを設計する

## コミュニケーションスタイル
- 親しみやすく、プロフェッショナルなトーンで話す
- 質問は一度に多くせず、段階的に情報を引き出す
- 具体的な例を挙げて分かりやすく説明する`
    }

    // コンテキスト情報を追加
    let contextInfo = ''
    if (currentDesign && Object.keys(currentDesign).length > 0) {
      contextInfo += `\n\n## 現在のロープレ設計\n${JSON.stringify(currentDesign, null, 2)}`
    }
    if (files.length > 0) {
      contextInfo += `\n\n## アップロードされたファイル\n${files.map(f => `- ${f.name}: ${f.summary || f.content || '内容なし'}`).join('\n')}`
    }

    const fullSystemPrompt = systemPrompt + contextInfo

    // Claude形式のメッセージに変換
    const claudeMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: fullSystemPrompt,
      messages: claudeMessages
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      content: responseText
    }
  } catch (error: any) {
    console.error('Roleplay Chat API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'ロープレチャット処理中にエラーが発生しました',
      message: error.message
    })
  }
})
