// Agent orchestrator for roleplay generation workflow
import type { RoleplayDesign } from '~/types/roleplay'
import type { UploadedFile } from '~/types/file'
import type { AgentRequest, AgentResponse } from '~/types/agent'

// プロンプトカテゴリの型定義
type PromptCategory = 'chat' | 'generation' | 'runtime' | 'evaluation'

export const useAgentOrchestrator = () => {
  const isGenerating = ref(false)
  const currentStep = ref('')
  const error = ref<string | null>(null)

  /**
   * プロンプトを取得する
   * @param category プロンプトカテゴリ
   * @param name プロンプト名
   * @param variables 変数（オプション）
   */
  async function getPrompt(
    category: PromptCategory,
    name: string,
    variables?: Record<string, string>
  ): Promise<string> {
    const query = variables ? new URLSearchParams(variables).toString() : ''
    const url = `/api/prompts/${category}/${name}${query ? `?${query}` : ''}`

    const response = await $fetch<{ prompt: string }>(url)
    return response.prompt
  }

  /**
   * Generate complete roleplay including scripts and system prompts
   */
  async function generateRoleplay(
    design: RoleplayDesign,
    files: UploadedFile[]
  ): Promise<{
    scripts: {
      subtitle?: any
      points?: any
      practice?: any
    }
    systemPrompts: {
      subtitle?: string
      aiDemo?: string
      confirmation?: string
      practice?: string
    }
  }> {
    isGenerating.value = true
    error.value = null

    try {
      // Step 1: Generate all scripts in parallel
      currentStep.value = '台本を生成中...'
      const [subtitleScript, pointsScript, practiceScript] = await Promise.all([
        callAgent('script-generation-subtitle', {
          roleplayDesign: design,
          files
        }),
        callAgent('script-generation-points', {
          roleplayDesign: design,
          files
        }),
        callAgent('script-generation-practice', {
          roleplayDesign: design,
          files
        })
      ])

      // Step 2: Generate system prompts for each mode in parallel
      currentStep.value = 'システムプロンプトを生成中...'
      const [subtitlePrompt, aiDemoPrompt, confirmationPrompt, practicePrompt] = await Promise.all([
        callAgent('system-prompt-subtitle', {
          roleplayDesign: design,
          script: subtitleScript.script
        }),
        callAgent('system-prompt-aiDemo', {
          roleplayDesign: design,
          script: subtitleScript.script
        }),
        callAgent('system-prompt-confirmation', {
          roleplayDesign: design,
          script: pointsScript.script
        }),
        callAgent('system-prompt-practice', {
          roleplayDesign: design,
          script: practiceScript.script
        })
      ])

      currentStep.value = '完了'

      return {
        scripts: {
          subtitle: subtitleScript.script,
          points: pointsScript.script,
          practice: practiceScript.script
        },
        systemPrompts: {
          subtitle: subtitlePrompt.systemPrompt,
          aiDemo: aiDemoPrompt.systemPrompt,
          confirmation: confirmationPrompt.systemPrompt,
          practice: practicePrompt.systemPrompt
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'ロープレ生成に失敗しました'
      throw err
    } finally {
      isGenerating.value = false
      currentStep.value = ''
    }
  }

  /**
   * Call a specific AI agent
   */
  async function callAgent(
    agentType: string,
    context: any
  ): Promise<AgentResponse> {
    const request: AgentRequest = {
      agent: agentType as any,
      context
    }

    const response = await $fetch<AgentResponse>('/api/agents', {
      method: 'POST',
      body: request
    })

    if (response.error) {
      throw new Error(response.error)
    }

    return response
  }

  /**
   * Get chat support from AI
   */
  async function getChatSupport(
    userInput: string,
    conversationLog?: any[],
    files?: UploadedFile[]
  ): Promise<string> {
    const response = await callAgent('roleplay-support', {
      userInput,
      conversationLog,
      files
    })

    return response.message || response.response || ''
  }

  /**
   * Get feedback for roleplay session
   */
  async function getFeedback(
    design: RoleplayDesign,
    transcript: string
  ): Promise<{
    score: number
    feedback: string
    achievements: string[]
    improvements: string[]
  }> {
    const response = await callAgent('feedback', {
      roleplayDesign: design,
      userInput: transcript
    })

    return response.feedback || {
      score: 0,
      feedback: '',
      achievements: [],
      improvements: []
    }
  }

  /**
   * Runtimeプロンプトを取得する（音声会話用）
   * @param mode モード名 (subtitle, demo, confirmation, practice)
   * @param design ロープレ設計
   * @param script 生成された台本
   */
  async function getRuntimePrompt(
    mode: 'subtitle' | 'demo' | 'confirmation' | 'practice',
    design: RoleplayDesign,
    script?: string
  ): Promise<string> {
    // サーバーサイドで変数置換済みのプロンプトを取得
    const response = await callAgent(`system-prompt-${mode === 'demo' ? 'aiDemo' : mode}`, {
      roleplayDesign: design,
      script: script || ''
    })
    return response.systemPrompt || ''
  }

  return {
    isGenerating: readonly(isGenerating),
    currentStep: readonly(currentStep),
    error: readonly(error),
    generateRoleplay,
    getChatSupport,
    getFeedback,
    getPrompt,
    getRuntimePrompt
  }
}
