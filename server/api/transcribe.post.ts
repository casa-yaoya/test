// 音声文字起こしAPI - Whisper を使用した音声認識
// 処理ID: API-AUDIO-001

import { getOpenAIClient } from '../utils/openai'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: '音声ファイルが必要です'
    })
  }

  const audioFile = formData.find(field => field.name === 'audio')

  if (!audioFile || !audioFile.data) {
    throw createError({
      statusCode: 400,
      statusMessage: '音声ファイル(audio)が必要です'
    })
  }

  try {
    const openai = getOpenAIClient()

    // ファイル拡張子を取得
    const filename = audioFile.filename || 'audio.mp3'
    const mimeType = audioFile.type || 'audio/mpeg'

    // Whisper APIに送信するためのFileオブジェクトを作成
    const file = new File([audioFile.data], filename, { type: mimeType })

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'ja'
    })

    return {
      text: transcription.text
    }
  } catch (error: any) {
    console.error('Transcribe API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '音声文字起こし処理中にエラーが発生しました',
      message: error.message
    })
  }
})
