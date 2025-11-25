import { loadPromptByCategory, replacePromptVariables } from '../../../utils/prompt'

type PromptCategory = 'chat' | 'generation' | 'runtime' | 'evaluation'

export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category') as PromptCategory
  const name = getRouterParam(event, 'name')
  const query = getQuery(event)

  if (!category || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category and name are required'
    })
  }

  // カテゴリの検証
  const validCategories: PromptCategory[] = ['chat', 'generation', 'runtime', 'evaluation']
  if (!validCategories.includes(category)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid category: ${category}. Valid categories are: ${validCategories.join(', ')}`
    })
  }

  try {
    let prompt = await loadPromptByCategory(category, name)

    if (!prompt) {
      throw createError({
        statusCode: 404,
        statusMessage: `Prompt not found: ${category}/${name}`
      })
    }

    // クエリパラメータで変数を置換
    if (Object.keys(query).length > 0) {
      const variables: Record<string, string> = {}
      for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'string') {
          variables[key] = value
        }
      }
      prompt = replacePromptVariables(prompt, variables)
    }

    return {
      category,
      name,
      prompt
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error(`プロンプト取得エラー (${category}/${name}):`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
