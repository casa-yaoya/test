<template>
  <div class="session-detail">
    <!-- セッション情報（横1行） -->
    <div class="session-info-row">
      <div class="info-item">
        <span class="info-label">スコア</span>
        <span class="info-value" :class="getScoreClass(session.score)">{{ session.score }}点</span>
      </div>
      <div class="info-item">
        <span class="info-label">プレイ時間</span>
        <span class="info-value">{{ session.playTime }}秒</span>
      </div>
      <div class="info-item">
        <span class="info-label">発話時間</span>
        <span class="info-value">{{ session.speechTime }}秒</span>
      </div>
    </div>

    <!-- フィードバック -->
    <div class="detail-section">
      <div class="detail-header">
        <UIcon name="i-lucide-clipboard-check" class="detail-icon" />
        フィードバック
      </div>
      <div class="feedback-container">
        <div class="feedback-content">
          <p class="dummy-text">あああああああああああああああああああああああああああああああああああああああああああああああああああ</p>
        </div>
      </div>
    </div>

    <!-- 会話記録 -->
    <div class="detail-section">
      <div class="detail-header">
        <UIcon name="i-lucide-message-circle" class="detail-icon" />
        会話記録
      </div>
      <div class="chat-container">
        <div class="chat-messages">
          <!-- AIの発話 -->
          <div class="chat-message ai">
            <div class="message-avatar">
              <UIcon name="i-lucide-bot" class="avatar-icon" />
            </div>
            <div class="message-bubble">
              <p>あああああああああああああああああああああああ</p>
            </div>
          </div>
          <!-- ユーザーの発話 -->
          <div class="chat-message user">
            <div class="message-bubble">
              <p>いいいいいいいいいいいいいいいいいいいいいい</p>
            </div>
            <div class="message-avatar">
              <UIcon name="i-lucide-user" class="avatar-icon" />
            </div>
          </div>
          <!-- AIの発話 -->
          <div class="chat-message ai">
            <div class="message-avatar">
              <UIcon name="i-lucide-bot" class="avatar-icon" />
            </div>
            <div class="message-bubble">
              <p>うううううううううううううううううううううううううううううう</p>
            </div>
          </div>
          <!-- ユーザーの発話 -->
          <div class="chat-message user">
            <div class="message-bubble">
              <p>えええええええええええええええええ</p>
            </div>
            <div class="message-avatar">
              <UIcon name="i-lucide-user" class="avatar-icon" />
            </div>
          </div>
          <!-- AIの発話 -->
          <div class="chat-message ai">
            <div class="message-avatar">
              <UIcon name="i-lucide-bot" class="avatar-icon" />
            </div>
            <div class="message-bubble">
              <p>おおおおおおおおおおおおおおおおおおおおおおおおお</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SessionData {
  score: number
  speechTime: number
  playTime: number
  group?: string
  player?: string
  category?: string
  level?: string
  lesson?: string
  date?: Date | string
  org?: string
  account?: string
}

defineProps<{
  session: SessionData
  showFullInfo?: boolean
}>()

// スコアに応じたクラスを取得
const getScoreClass = (score: number) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 50) return 'score-average'
  return 'score-low'
}
</script>

<style scoped>
.session-detail {
  padding: 12px;
  background: var(--ui-bg-elevated);
}

/* セッション情報（横1行） */
.session-info-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--ui-text-muted);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ui-text);
}

/* スコア色分け */
.score-excellent { color: #10b981; }
.score-good { color: #0ea5e9; }
.score-average { color: #f59e0b; }
.score-low { color: #ef4444; }

/* セクション共通 */
.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ui-text);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ui-border);
}

.detail-icon {
  font-size: 14px;
  color: var(--ui-primary);
}

/* フィードバック */
.feedback-container {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  padding: 12px;
}

.feedback-content {
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-text);
}

.feedback-content p {
  margin: 0;
}

.dummy-text {
  color: var(--ui-text-muted);
  font-style: italic;
}

/* チャットコンテナ */
.chat-container {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  padding: 12px;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.chat-message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-message.ai .message-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.chat-message.user .message-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.avatar-icon {
  font-size: 14px;
  color: white;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.chat-message.ai .message-bubble {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-top-left-radius: 4px;
  color: var(--ui-text-muted);
  font-style: italic;
}

.chat-message.user .message-bubble {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border-top-right-radius: 4px;
  color: var(--ui-text-muted);
  font-style: italic;
}

.message-bubble p {
  margin: 0;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .session-info-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .info-item {
    min-width: calc(50% - 6px);
  }

  .message-bubble {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .info-item {
    min-width: 100%;
    justify-content: space-between;
  }
}
</style>
