<template>
  <div v-if="isVisible" class="feedback-overlay">
    <div class="feedback-container">
      <div class="feedback-header">
        <h3 class="feedback-title">フィードバック</h3>
        <button class="feedback-close" @click="$emit('close')">×</button>
      </div>

      <div class="feedback-content">
        <!-- スコア表示 -->
        <div class="feedback-score-section">
          <div class="feedback-score-circle" :class="scoreClass">
            <span class="feedback-score-value">{{ feedback?.score || 0 }}</span>
            <span class="feedback-score-label">点</span>
          </div>
          <div class="feedback-score-text">{{ scoreText }}</div>
        </div>

        <!-- 達成項目 -->
        <div v-if="feedback?.achieved && feedback.achieved.length > 0" class="feedback-section">
          <h4 class="feedback-section-title success">
            <span class="feedback-icon">✅</span> 達成項目
          </h4>
          <ul class="feedback-list">
            <li v-for="(item, index) in feedback.achieved" :key="index" class="feedback-item success">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 改善点 -->
        <div v-if="feedback?.improvements && feedback.improvements.length > 0" class="feedback-section">
          <h4 class="feedback-section-title warning">
            <span class="feedback-icon">💡</span> 改善点
          </h4>
          <ul class="feedback-list">
            <li v-for="(item, index) in feedback.improvements" :key="index" class="feedback-item warning">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 総評 -->
        <div v-if="feedback?.summary" class="feedback-section">
          <h4 class="feedback-section-title">
            <span class="feedback-icon">📝</span> 総評
          </h4>
          <p class="feedback-summary">{{ feedback.summary }}</p>
        </div>
      </div>

      <div class="feedback-footer">
        <button class="feedback-button secondary" @click="$emit('retry')">もう一度練習</button>
        <button class="feedback-button primary" @click="$emit('close')">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface FeedbackData {
  score: number
  achieved: string[]
  improvements: string[]
  summary: string
}

const props = defineProps<{
  isVisible: boolean
  feedback: FeedbackData | null
}>()

defineEmits<{
  close: []
  retry: []
}>()

const scoreClass = computed(() => {
  if (!props.feedback) return ''
  const score = props.feedback.score
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'average'
  return 'needs-work'
})

const scoreText = computed(() => {
  if (!props.feedback) return ''
  const score = props.feedback.score
  if (score >= 80) return '素晴らしい！'
  if (score >= 60) return 'よくできました'
  if (score >= 40) return 'もう少し頑張りましょう'
  return '基本から練習しましょう'
})
</script>

<style scoped>
.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.feedback-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.feedback-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.feedback-close {
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

.feedback-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.feedback-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.feedback-score-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.feedback-score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.feedback-score-circle.excellent {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.feedback-score-circle.good {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.feedback-score-circle.average {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.feedback-score-circle.needs-work {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.feedback-score-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.feedback-score-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.feedback-score-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.feedback-section {
  margin-bottom: 1.25rem;
}

.feedback-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.feedback-section-title.success {
  color: #059669;
}

.feedback-section-title.warning {
  color: #d97706;
}

.feedback-icon {
  font-size: 1rem;
}

.feedback-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feedback-item {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.feedback-item.success {
  background: #ecfdf5;
  color: #065f46;
}

.feedback-item.warning {
  background: #fffbeb;
  color: #92400e;
}

.feedback-summary {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
}

.feedback-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.feedback-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.feedback-button.secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.feedback-button.secondary:hover {
  background: #f3f4f6;
}

.feedback-button.primary {
  background: #2563eb;
  color: white;
}

.feedback-button.primary:hover {
  background: #1d4ed8;
}
</style>
