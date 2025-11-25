<template>
  <div v-if="isOpen" class="popup-overlay" @click.self="close">
    <div class="popup-container">
      <div class="popup-header">
        <h3 class="popup-title">キャラクター設定</h3>
        <button class="popup-close" @click="close">×</button>
      </div>

      <div class="popup-content">
        <!-- キャラクター選択 -->
        <div class="setting-section">
          <label class="setting-label">キャラクター</label>
          <div class="character-grid">
            <button
              v-for="char in characters"
              :key="char.id"
              class="character-option"
              :class="{ selected: selectedCharacter === char.id }"
              @click="selectedCharacter = char.id"
            >
              <span class="character-icon">{{ char.icon }}</span>
              <span class="character-name">{{ char.name }}</span>
            </button>
          </div>
        </div>

        <!-- 音声設定 -->
        <div class="setting-section">
          <label class="setting-label">音声タイプ</label>
          <select v-model="selectedVoice" class="setting-select">
            <option v-for="voice in voices" :key="voice.id" :value="voice.id">
              {{ voice.name }}
            </option>
          </select>
        </div>

        <!-- 話速設定 -->
        <div class="setting-section">
          <label class="setting-label">話速</label>
          <div class="slider-container">
            <input
              type="range"
              v-model.number="speechRate"
              min="0.5"
              max="2"
              step="0.1"
              class="setting-slider"
            >
            <span class="slider-value">{{ speechRate.toFixed(1) }}x</span>
          </div>
        </div>

        <!-- 声のトーン -->
        <div class="setting-section">
          <label class="setting-label">声のトーン</label>
          <div class="tone-options">
            <button
              v-for="tone in tones"
              :key="tone.id"
              class="tone-option"
              :class="{ selected: selectedTone === tone.id }"
              @click="selectedTone = tone.id"
            >
              {{ tone.label }}
            </button>
          </div>
        </div>

        <!-- 応答スタイル -->
        <div class="setting-section">
          <label class="setting-label">応答スタイル</label>
          <select v-model="responseStyle" class="setting-select">
            <option value="friendly">フレンドリー</option>
            <option value="professional">プロフェッショナル</option>
            <option value="casual">カジュアル</option>
            <option value="formal">フォーマル</option>
          </select>
        </div>

        <!-- 難易度 -->
        <div class="setting-section">
          <label class="setting-label">難易度</label>
          <div class="difficulty-options">
            <button
              v-for="diff in difficulties"
              :key="diff.id"
              class="difficulty-option"
              :class="{ selected: selectedDifficulty === diff.id }"
              @click="selectedDifficulty = diff.id"
            >
              <span class="difficulty-stars">{{ diff.stars }}</span>
              <span class="difficulty-name">{{ diff.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <button class="popup-button secondary" @click="resetToDefaults">デフォルトに戻す</button>
        <button class="popup-button primary" @click="applySettings">適用</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CharacterSettings {
  character: string
  voice: string
  speechRate: number
  tone: string
  responseStyle: string
  difficulty: string
}

const props = defineProps<{
  isOpen: boolean
  currentSettings?: CharacterSettings
}>()

const emit = defineEmits<{
  close: []
  apply: [settings: CharacterSettings]
}>()

// キャラクター一覧
const characters = [
  { id: 'businessman', icon: '👔', name: 'ビジネスマン' },
  { id: 'saleswoman', icon: '👩‍💼', name: '営業ウーマン' },
  { id: 'manager', icon: '👨‍💼', name: 'マネージャー' },
  { id: 'customer', icon: '🙋', name: '顧客' },
  { id: 'executive', icon: '🤵', name: '役員' },
  { id: 'receptionist', icon: '💁‍♀️', name: '受付' }
]

// 音声一覧
const voices = [
  { id: 'alloy', name: 'Alloy (中性的)' },
  { id: 'echo', name: 'Echo (男性的)' },
  { id: 'fable', name: 'Fable (表現力豊か)' },
  { id: 'onyx', name: 'Onyx (深い男性)' },
  { id: 'nova', name: 'Nova (女性的)' },
  { id: 'shimmer', name: 'Shimmer (明るい女性)' }
]

// トーン
const tones = [
  { id: 'neutral', label: '普通' },
  { id: 'positive', label: '明るい' },
  { id: 'serious', label: '真剣' },
  { id: 'empathetic', label: '共感的' }
]

// 難易度
const difficulties = [
  { id: 'easy', name: '初級', stars: '⭐' },
  { id: 'normal', name: '中級', stars: '⭐⭐' },
  { id: 'hard', name: '上級', stars: '⭐⭐⭐' }
]

// 設定値
const selectedCharacter = ref(props.currentSettings?.character || 'businessman')
const selectedVoice = ref(props.currentSettings?.voice || 'alloy')
const speechRate = ref(props.currentSettings?.speechRate || 1.0)
const selectedTone = ref(props.currentSettings?.tone || 'neutral')
const responseStyle = ref(props.currentSettings?.responseStyle || 'professional')
const selectedDifficulty = ref(props.currentSettings?.difficulty || 'normal')

// propsが変更されたら設定を更新
watch(() => props.currentSettings, (newSettings) => {
  if (newSettings) {
    selectedCharacter.value = newSettings.character
    selectedVoice.value = newSettings.voice
    speechRate.value = newSettings.speechRate
    selectedTone.value = newSettings.tone
    responseStyle.value = newSettings.responseStyle
    selectedDifficulty.value = newSettings.difficulty
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const resetToDefaults = () => {
  selectedCharacter.value = 'businessman'
  selectedVoice.value = 'alloy'
  speechRate.value = 1.0
  selectedTone.value = 'neutral'
  responseStyle.value = 'professional'
  selectedDifficulty.value = 'normal'
}

const applySettings = () => {
  emit('apply', {
    character: selectedCharacter.value,
    voice: selectedVoice.value,
    speechRate: speechRate.value,
    tone: selectedTone.value,
    responseStyle: responseStyle.value,
    difficulty: selectedDifficulty.value
  })
  close()
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup-container {
  background: white;
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.popup-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.popup-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.popup-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.setting-section {
  margin-bottom: 1.5rem;
}

.setting-section:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.character-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.character-option:hover {
  border-color: #93c5fd;
  background: #f0f9ff;
}

.character-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.character-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.character-name {
  font-size: 0.75rem;
  color: #4b5563;
}

.setting-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
}

.setting-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

.setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  min-width: 3rem;
  text-align: right;
}

.tone-options {
  display: flex;
  gap: 0.5rem;
}

.tone-option {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s;
}

.tone-option:hover {
  border-color: #93c5fd;
}

.tone-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1e40af;
}

.difficulty-options {
  display: flex;
  gap: 0.5rem;
}

.difficulty-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.difficulty-option:hover {
  border-color: #93c5fd;
}

.difficulty-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.difficulty-stars {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.difficulty-name {
  font-size: 0.75rem;
  color: #4b5563;
}

.popup-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.popup-button {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.popup-button.secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.popup-button.secondary:hover {
  background: #f3f4f6;
}

.popup-button.primary {
  background: #2563eb;
  color: white;
}

.popup-button.primary:hover {
  background: #1d4ed8;
}
</style>
