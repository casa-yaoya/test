<template>
  <div class="content-creation-container">
    <!-- 操作コンポーネント (Left Column - spans 2 rows) -->
    <div class="cc-panel cc-operation-component">
      <!-- カテゴリー選択 -->
      <div class="cc-category-selector">
        <div class="cc-category-select-wrapper">
          <label class="cc-category-label">コース:</label>
          <select v-model="selectedCategory" class="cc-category-select">
            <option value="sales-basics">営業基礎</option>
            <option value="customer-service">カスタマーサービス</option>
            <option value="presentation">プレゼンテーション</option>
            <option value="negotiation">交渉術</option>
            <option value="leadership">リーダーシップ</option>
          </select>
        </div>
      </div>

      <!-- タブナビゲーション -->
      <div class="cc-operation-tabs">
        <button
          class="cc-operation-tab"
          :class="{ active: operationTab === 'chat' }"
          @click="operationTab = 'chat'"
        >
          チャット
        </button>
        <button
          class="cc-operation-tab"
          :class="{ active: operationTab === 'course' }"
          @click="operationTab = 'course'"
        >
          コース
        </button>
        <button
          class="cc-operation-tab"
          :class="{ active: operationTab === 'files' }"
          @click="operationTab = 'files'"
        >
          ファイル
        </button>
      </div>

      <!-- チャットタブ -->
      <div v-show="operationTab === 'chat'" class="cc-operation-tab-content active">
        <ChatArea @file-uploaded="handleFileUploaded" />
      </div>

      <!-- コースタブ -->
      <div v-show="operationTab === 'course'" class="cc-operation-tab-content active">
        <div class="cc-course-manager">
          <div class="cc-course-add-section">
            <button class="cc-button cc-button-primary" @click="addNewCategory">
              ➕ カテゴリーを追加
            </button>
          </div>
          <div class="cc-course-list">
            <!-- コース内容がJSで動的に生成されます -->
            <div class="cc-empty-text">コースを選択してください</div>
          </div>
        </div>
      </div>

      <!-- ファイルタブ -->
      <div v-show="operationTab === 'files'" class="cc-operation-tab-content active">
        <div class="cc-raw-data-container">
          <div v-if="uploadedFiles.length === 0" class="cc-raw-data-empty">
            <div class="cc-empty-icon">📁</div>
            <div class="cc-empty-text">まだファイルがアップロードされていません</div>
            <div class="cc-empty-hint">
              チャットでファイルをアップロードすると、ここにテキスト化されたデータが表示されます
            </div>
          </div>
          <div v-else class="cc-file-list-display">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="cc-file-item-display">
              <span class="cc-file-icon">📄</span>
              <span class="cc-file-name">{{ file.name }}</span>
              <span class="cc-file-type-badge">{{ file.dataType }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- プレイコンポーネント (Right Column Top) -->
    <div class="cc-panel cc-play-component" :class="{ collapsed: playComponentCollapsed }">
      <!-- プレイエリアヘッダー -->
      <div class="cc-play-header">
        <div class="cc-lesson-selector">
          <label class="cc-lesson-label">レッスン:</label>
          <select v-model="selectedLesson" class="cc-lesson-dropdown">
            <option value="">レッスンを選択...</option>
            <optgroup label="Lv.1">
              <option value="lv1-1">Lv.1: 飛び込み学習モード</option>
              <option value="lv1-2">Lv.1: 話すことまとめ</option>
            </optgroup>
            <optgroup label="Lv.2">
              <option value="lv2-1">Lv.2: 相手に寄り添うトーク</option>
              <option value="lv2-2">Lv.2: 言葉の選び方</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="cc-play-content">
        <!-- ロープレモード選択コンポーネント (Left) -->
        <div class="cc-roleplay-mode-component">
          <div class="cc-mode-title">モードを選ぶ</div>
          <div class="cc-mode-buttons">
            <button
              class="cc-mode-button"
              :class="{ active: selectedMode === 'subtitle' }"
              @click="selectedMode = 'subtitle'"
            >
              台本モード
            </button>
            <button
              class="cc-mode-button"
              :class="{ active: selectedMode === 'ai-demo' }"
              @click="selectedMode = 'ai-demo'"
            >
              お手本モード
            </button>
            <button
              class="cc-mode-button"
              :class="{ active: selectedMode === 'confirmation' }"
              @click="selectedMode = 'confirmation'"
            >
              確認モード
            </button>
            <button
              class="cc-mode-button"
              :class="{ active: selectedMode === 'practice' }"
              @click="selectedMode = 'practice'"
            >
              実戦モード
            </button>
          </div>
        </div>

        <!-- 再生コンポーネント (Center: Video Display) -->
        <div class="cc-playback-component">
          <!-- Video Window -->
          <div class="cc-video-window-container">
            <div class="cc-character-window">
              <video id="characterVideo" class="cc-character-video" loop muted playsinline></video>
              <div class="cc-character" id="character">👔</div>

              <!-- Connection Status -->
              <div class="cc-video-connection-status">
                <div class="cc-connection-status">
                  <span class="cc-status-indicator" :class="connectionStatusClass"></span>
                  <span class="cc-status-text">{{ connectionStatusText }}</span>
                </div>
              </div>

              <div v-if="showResult" class="cc-result-overlay">
                <div class="cc-score-display">{{ score }}点</div>
                <div class="cc-feedback-box" v-html="feedbackHtml"></div>
              </div>
            </div>
          </div>

          <!-- 操作コンポーネント (Control Buttons) -->
          <div class="cc-control-component">
            <button
              class="cc-start-button-new"
              :class="{ active: conversationActive }"
              @click="toggleRoleplay"
            >
              {{ conversationActive ? '■ 停止' : '▶ スタート' }}
            </button>
            <button
              class="cc-mic-button-new"
              :class="{ active: isRecording }"
              @click="toggleMic"
            >
              <span class="cc-mic-icon">🎤</span>
              <span class="cc-mic-text">{{ isRecording ? '録音中...' : 'OFF' }}</span>
            </button>
          </div>
        </div>

        <!-- 設定コンポーネント (Right: Settings) -->
        <div class="cc-settings-component">
          <!-- キャラクター設定コンポーネント -->
          <div class="cc-character-settings-component">
            <div class="cc-settings-label">相手:</div>
            <div class="cc-character-icon-box" @click="openCharacterSettings">
              👔
            </div>
            <select v-model="selectedCharacter" class="cc-character-select">
              <option value="businessman">ビジネスマン</option>
              <option value="saleswoman">営業ウーマン</option>
              <option value="manager">マネージャー</option>
              <option value="customer">顧客</option>
            </select>
          </div>

          <!-- 音声設定コンポーネント -->
          <div class="cc-voice-settings-component">
            <div class="cc-setting-row">
              <label class="cc-setting-label">音声タイプ:</label>
              <select v-model="selectedVoice" class="cc-voice-select">
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 設計コンポーネント (Right Column Bottom) -->
    <div class="cc-panel cc-design-component" :class="{ expanded: playComponentCollapsed }">
      <!-- テストエリア開閉ボタン -->
      <button class="cc-play-toggle-button" @click="togglePlayComponent">
        <span class="cc-play-toggle-icon" :class="{ rotated: playComponentCollapsed }">▲</span>
        <span class="cc-play-toggle-text">
          {{ playComponentCollapsed ? 'テストエリアを開く' : 'テストエリアを閉じる' }}
        </span>
      </button>

      <div class="cc-tabs">
        <button
          class="cc-tab"
          :class="{ active: designTab === 'diagram' }"
          @click="designTab = 'diagram'"
        >
          ロープレ設計
        </button>
        <button
          class="cc-tab"
          :class="{ active: designTab === 'script' }"
          @click="designTab = 'script'"
        >
          会話の流れ
        </button>
        <button
          class="cc-tab"
          :class="{ active: designTab === 'config' }"
          @click="designTab = 'config'"
        >
          設計書
        </button>
      </div>

      <!-- ロープレ設計コンポーネント (Tab 1) -->
      <div v-show="designTab === 'diagram'" class="cc-tab-content active">
        <RoleplayDesignForm ref="roleplayDesignForm" />
      </div>

      <!-- 会話の流れコンポーネント (Tab 2) -->
      <div v-show="designTab === 'script'" class="cc-tab-content active">
        <div v-if="scripts.length === 0" class="cc-input-data-container">
          <div class="cc-input-data-empty">
            <div class="cc-empty-icon">📝</div>
            <div class="cc-empty-text">まだ会話の流れが生成されていません</div>
            <div class="cc-empty-hint">「ロープレ生成」ボタンから生成できます</div>
          </div>
        </div>
        <div v-else class="cc-scripts-container">
          <div v-for="(script, index) in scripts" :key="index" class="cc-script-card">
            <div class="cc-script-card-header" @click="script.expanded = !script.expanded">
              <span class="cc-script-expand-icon">{{ script.expanded ? '▼' : '▶' }}</span>
              <span class="cc-script-card-title">{{ script.mode }}</span>
              <button class="cc-script-edit-btn" @click.stop="editScript(index)">編集</button>
            </div>
            <div v-show="script.expanded" class="cc-script-card-content">
              <pre class="cc-script-content">{{ script.content }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 設計書コンポーネント (Tab 3) -->
      <div v-show="designTab === 'config'" class="cc-tab-content active">
        <div v-if="systemPrompts.length === 0" class="cc-config-content-wrapper">
          <!-- デフォルトで4つのモードカードを表示 -->
          <div class="cc-prompts-container">
            <div v-for="mode in defaultModes" :key="mode" class="cc-prompt-card-editable">
              <div class="cc-prompt-card-header">
                <span class="cc-prompt-expand-icon">▶</span>
                <span class="cc-prompt-card-title">{{ mode }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="cc-prompts-container">
          <div v-for="(prompt, index) in systemPrompts" :key="index" class="cc-prompt-card-editable">
            <div class="cc-prompt-card-header" @click="prompt.expanded = !prompt.expanded">
              <span class="cc-prompt-expand-icon">{{ prompt.expanded ? '▼' : '▶' }}</span>
              <span class="cc-prompt-card-title">{{ prompt.mode }}</span>
              <button class="cc-prompt-edit-btn" @click.stop="editPrompt(index)">編集</button>
            </div>
            <div v-show="prompt.expanded" class="cc-prompt-card-content">
              <pre class="cc-prompt-content-text">{{ prompt.content }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- File Selection Dialog -->
    <FileSelectionDialog
      :is-open="showFileSelectionDialog"
      :files="uploadedFilesForDialog"
      @close="showFileSelectionDialog = false"
      @generate="handleGenerate"
    />

    <!-- Character Settings Popup -->
    <CharacterSettingsPopup
      :is-open="showCharacterSettingsPopup"
      :current-settings="characterSettings"
      @close="showCharacterSettingsPopup = false"
      @apply="applyCharacterSettings"
    />
  </div>
</template>

<script setup lang="ts">
import type { FileData } from '~/types/roleplay'

definePageMeta({
  layout: 'default'
})

// State
const selectedCategory = ref('sales-basics')
const operationTab = ref('chat')
const selectedLesson = ref('')
const selectedMode = ref('confirmation')
const selectedCharacter = ref('businessman')
const selectedVoice = ref('alloy')
const designTab = ref('diagram')
const playComponentCollapsed = ref(false)

// Roleplay state
const conversationActive = ref(false)
const isRecording = ref(false)
const showResult = ref(false)
const score = ref(85)
const feedbackHtml = ref('')

// Connection status
const connectionStatusClass = computed(() => {
  return conversationActive.value ? 'cc-status-connected' : 'cc-status-disconnected'
})
const connectionStatusText = computed(() => {
  return conversationActive.value ? '接続中' : '未接続'
})

// Data
const uploadedFiles = ref<FileData[]>([])
const scripts = ref<Array<{ mode: string; content: string; expanded: boolean }>>([])
const systemPrompts = ref<Array<{ mode: string; content: string; expanded: boolean }>>([])
const defaultModes = ['台本モード', 'お手本モード', '確認モード', '実戦モード']

// Character settings for popup
const characterSettings = computed(() => ({
  character: selectedCharacter.value,
  voice: selectedVoice.value,
  speechRate: 1.0,
  tone: 'neutral',
  responseStyle: 'professional',
  difficulty: 'normal'
}))

// Uploaded files for dialog (with id)
const uploadedFilesForDialog = computed(() =>
  uploadedFiles.value.map((file, index) => ({
    ...file,
    id: `file-${index}`
  }))
)

// Dialogs
const showFileSelectionDialog = ref(false)
const showCharacterSettingsPopup = ref(false)

// Refs
const roleplayDesignForm = ref<any>(null)

// Methods
const togglePlayComponent = () => {
  playComponentCollapsed.value = !playComponentCollapsed.value
}

const toggleRoleplay = () => {
  conversationActive.value = !conversationActive.value
  if (!conversationActive.value) {
    isRecording.value = false
  }
}

const toggleMic = () => {
  if (conversationActive.value) {
    isRecording.value = !isRecording.value
  }
}

const openCharacterSettings = () => {
  showCharacterSettingsPopup.value = true
}

interface CharacterSettings {
  character: string
  voice: string
  speechRate: number
  tone: string
  responseStyle: string
  difficulty: string
}

const applyCharacterSettings = (settings: CharacterSettings) => {
  selectedCharacter.value = settings.character
  selectedVoice.value = settings.voice
  showCharacterSettingsPopup.value = false
}

const addNewCategory = () => {
  // TODO: カテゴリー追加処理
  console.log('Add new category')
}

const editScript = (index: number) => {
  // TODO: スクリプト編集処理
  console.log('Edit script', index)
}

const editPrompt = (index: number) => {
  // TODO: プロンプト編集処理
  console.log('Edit prompt', index)
}

const handleGenerate = (selectedFiles: FileData[]) => {
  // TODO: ロープレ生成処理
  console.log('Generate roleplay with files:', selectedFiles)
  showFileSelectionDialog.value = false
}

const handleFileUploaded = (file: FileData) => {
  uploadedFiles.value.push(file)
}
</script>

<style scoped>
/* コンポーネント固有のスタイル */
.cc-play-component.collapsed {
  display: none;
}

.cc-play-toggle-icon.rotated {
  transform: rotate(180deg);
}

.cc-file-list-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.cc-file-item-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.cc-file-icon {
  font-size: 20px;
}

.cc-file-name {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.cc-file-type-badge {
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
}

.cc-input-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px;
}

.cc-input-data-empty {
  text-align: center;
  color: #6b7280;
}
</style>
