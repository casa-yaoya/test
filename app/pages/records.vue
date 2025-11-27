<template>
  <div class="p-5">
    <div class="summary-container" :class="{ 'filter-collapsed': isFilterCollapsed }">
      <!-- Left Filters -->
      <div class="summary-filters">
        <div class="summary-filters-sticky">
          <DataFilter
            :filter-options="filterOptions"
            @update:filters="handleFiltersUpdate"
            @update:collapsed="handleFilterCollapsed"
          />
        </div>
      </div>

      <!-- Right Content -->
      <div class="summary-content">
        <UCard class="records-card">
          <div class="records-card-header">
            <div class="records-header-row">
              <div class="records-title">
                <UIcon name="i-lucide-award" class="records-title-icon" />
                個人詳細
              </div>
              <!-- プレイヤー選択プルダウン -->
              <div class="player-select-wrapper">
                <USelectMenu
                  v-model="selectedPlayer"
                  :items="groupedPlayerOptions"
                  placeholder="プレイヤーを選択"
                  class="player-select"
                  :ui="{
                    base: 'w-full',
                    trigger: 'min-w-[240px]'
                  }"
                />
              </div>
            </div>
            <div class="records-subtitle">
              {{ selectedPlayer ? `${selectedPlayer} の記録一覧` : 'プレイヤーを選択してください' }}
            </div>
          </div>

          <!-- コースツリー -->
          <div class="records-tree">
            <div v-if="!selectedPlayer" class="empty-state">
              <UIcon name="i-lucide-user" class="empty-icon" />
              <p class="empty-text">プレイヤーを選択してください</p>
              <p class="empty-hint">上のプルダウンからプレイヤーを選択すると記録が表示されます</p>
            </div>

            <div v-else-if="personalRecords.length === 0" class="empty-state">
              <UIcon name="i-lucide-inbox" class="empty-icon" />
              <p class="empty-text">該当するデータがありません</p>
            </div>

            <!-- コース（カテゴリー）ループ -->
            <div v-for="course in personalRecords" :key="course.category" class="course-item">
              <div
                class="course-header"
                @click="toggleCourse(course.category)"
              >
                <UIcon
                  :name="expandedCourses[course.category] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="expand-icon"
                />
                <UIcon name="i-lucide-folder" class="course-icon" />
                <span class="course-name">{{ course.category }}</span>
                <UBadge color="neutral" variant="subtle" size="xs">
                  {{ getLessonCount(course) }}レッスン
                </UBadge>
              </div>

              <!-- レベルリスト（カテゴリー開いたら全て表示） -->
              <div v-show="expandedCourses[course.category]" class="level-list">
                <div v-for="level in course.levels" :key="`${course.category}-${level.level}`" class="level-item">
                  <!-- レベルヘッダー（クリックで開閉） -->
                  <div
                    class="level-header"
                    @click="toggleLevel(course.category, level.level)"
                  >
                    <UIcon
                      :name="expandedLevels[`${course.category}-${level.level}`] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                      class="expand-icon"
                    />
                    <span class="level-badge">Lv.{{ level.level }}</span>
                    <UBadge color="neutral" variant="subtle" size="xs">
                      {{ level.lessons.length }}レッスン
                    </UBadge>
                  </div>

                  <!-- レッスンリスト -->
                  <div v-show="expandedLevels[`${course.category}-${level.level}`]" class="lesson-list-nested">
                    <div
                      v-for="lesson in level.lessons"
                      :key="lesson.title"
                      class="lesson-item"
                      :class="{ 'expanded': expandedLessons[lesson.title] }"
                    >
                      <!-- レッスン行（クリックで開閉） -->
                      <div
                        class="lesson-row"
                        @click="toggleLesson(lesson.title)"
                      >
                        <UIcon
                          :name="expandedLessons[lesson.title] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                          class="expand-icon"
                        />
                        <UIcon name="i-lucide-book-open" class="lesson-icon" />
                        <span class="lesson-title">{{ lesson.title }}</span>
                        <div class="lesson-scores">
                          <div class="score-item best">
                            <span class="score-label">ベスト</span>
                            <span class="score-value" :class="getScoreClass(lesson.bestScore)">
                              {{ lesson.bestScore }}点
                            </span>
                          </div>
                          <div class="score-item latest">
                            <span class="score-label">最新</span>
                            <span class="score-value" :class="getScoreClass(lesson.latestScore)">
                              {{ lesson.latestScore }}点
                            </span>
                          </div>
                          <div class="score-item count">
                            <span class="score-label">プレイ</span>
                            <span class="score-value">{{ lesson.playCount }}回</span>
                          </div>
                        </div>
                      </div>

                      <!-- レッスン詳細（ベストスコア + 最新3回分） -->
                      <div v-show="expandedLessons[lesson.title]" class="lesson-detail">
                        <div class="session-list">
                          <!-- ベストスコアのセッション -->
                          <div
                            v-if="getBestSession(lesson)"
                            class="session-item best-session"
                            :class="{ 'expanded': expandedSessions[`${lesson.title}-best`] }"
                          >
                            <!-- ベストスコア行 -->
                            <div
                              class="session-row session-row-best"
                              @click="toggleSession(lesson.title, 'best')"
                            >
                              <UIcon
                                :name="expandedSessions[`${lesson.title}-best`] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                                class="expand-icon-sm"
                              />
                              <UIcon name="i-lucide-trophy" class="best-icon" />
                              <span class="best-label">ベスト</span>
                              <span class="session-score score-excellent">
                                {{ getBestSession(lesson)?.score }}点
                              </span>
                              <span class="session-time">{{ Math.round(getBestSession(lesson)?.playTime || 0) }}秒</span>
                              <span class="session-date">{{ formatDateTime(getBestSession(lesson)?.date || new Date()) }}</span>
                            </div>

                            <!-- ベストセッション詳細 -->
                            <SessionDetail
                              v-show="expandedSessions[`${lesson.title}-best`]"
                              :session="getBestSession(lesson)"
                            />
                          </div>

                          <!-- 最新3回分のセッション -->
                          <div
                            v-for="(session, idx) in getLatestSessions(lesson, 3)"
                            :key="idx"
                            class="session-item"
                            :class="{ 'expanded': expandedSessions[`${lesson.title}-${idx}`] }"
                          >
                            <!-- セッション行 -->
                            <div
                              class="session-row"
                              @click="toggleSession(lesson.title, idx)"
                            >
                              <UIcon
                                :name="expandedSessions[`${lesson.title}-${idx}`] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                                class="expand-icon-sm"
                              />
                              <span class="recent-label">{{ idx === 0 ? '最新' : `${idx + 1}回前` }}</span>
                              <span class="session-score" :class="getScoreClass(session.score)">
                                {{ session.score }}点
                              </span>
                              <span class="session-time">{{ Math.round(session.playTime) }}秒</span>
                              <span class="session-date">{{ formatDateTime(session.date) }}</span>
                            </div>

                            <!-- セッション詳細 -->
                            <SessionDetail
                              v-show="expandedSessions[`${lesson.title}-${idx}`]"
                              :session="session"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// デモデータ管理
const { isDataLoaded, loadDemoData, getFilterOptions, getFilteredPersonalRecords, allSessions } = useDemoData()

// 現在のフィルター値
const currentFilters = ref<{
  lessons?: string[]
  levels?: string[]
  players?: string[]
  dateFrom: Date | null
  dateTo: Date | null
}>({
  dateFrom: null,
  dateTo: null
})

// フィルターオプション
const filterOptions = computed(() => getFilterOptions())

// フィルター折りたたみ状態
const isFilterCollapsed = ref(false)

const handleFilterCollapsed = (collapsed: boolean) => {
  isFilterCollapsed.value = collapsed
}

// プレイヤー選択
const selectedPlayer = ref<string | null>(null)

// フィルター適用後のプレイヤーリストを取得
const filteredPlayers = computed(() => {
  let sessions = [...allSessions.value]

  // レベルフィルター
  if (currentFilters.value.levels && currentFilters.value.levels.length > 0) {
    const levelSet = new Set(currentFilters.value.levels)
    sessions = sessions.filter(s => levelSet.has(s.level))
  }

  // レッスンフィルター
  if (currentFilters.value.lessons && currentFilters.value.lessons.length > 0) {
    const lessonSet = new Set(currentFilters.value.lessons)
    sessions = sessions.filter(s => lessonSet.has(s.lesson))
  }

  // 日付フィルター
  if (currentFilters.value.dateFrom) {
    const fromDate = new Date(currentFilters.value.dateFrom)
    fromDate.setHours(0, 0, 0, 0)
    sessions = sessions.filter(s => s.date >= fromDate)
  }
  if (currentFilters.value.dateTo) {
    const toDate = new Date(currentFilters.value.dateTo)
    toDate.setHours(23, 59, 59, 999)
    sessions = sessions.filter(s => s.date <= toDate)
  }

  // フィルター適用後のユニークプレイヤーとグループ情報を収集
  const playerGroupMap = new Map<string, { account: string; group: string }>()
  sessions.forEach(s => {
    if (!playerGroupMap.has(s.player)) {
      playerGroupMap.set(s.player, { account: s.account, group: s.group })
    }
  })

  return playerGroupMap
})

// グループ別プレイヤーオプション（フィルター適用後）
const groupedPlayerOptions = computed(() => {
  const playerGroupMap = filteredPlayers.value
  const result: { label: string; value: string }[] = []

  // グループごとにプレイヤーを整理
  const groupPlayersMap = new Map<string, string[]>()
  playerGroupMap.forEach((info, player) => {
    const group = info.group
    if (!groupPlayersMap.has(group)) {
      groupPlayersMap.set(group, [])
    }
    groupPlayersMap.get(group)!.push(player)
  })

  // グループ名でソート
  const sortedGroups = Array.from(groupPlayersMap.keys()).sort()

  sortedGroups.forEach(group => {
    const players = groupPlayersMap.get(group)!.sort()
    if (players.length > 0) {
      // グループヘッダーを追加
      result.push({
        label: `── ${group} ──`,
        value: `__group__${group}`,
        disabled: true
      } as any)
      // プレイヤーを追加
      players.forEach(player => {
        result.push({
          label: `　${player}`,
          value: player
        })
      })
    }
  })

  return result
})

// 最初のプレイヤーを取得
const firstPlayer = computed(() => {
  const options = groupedPlayerOptions.value
  const firstPlayerOption = options.find(opt => !opt.value.startsWith('__group__'))
  return firstPlayerOption?.value || null
})

// 展開状態
const expandedCourses = reactive<Record<string, boolean>>({})
const expandedLevels = reactive<Record<string, boolean>>({})
const expandedLessons = reactive<Record<string, boolean>>({})
const expandedSessions = reactive<Record<string, boolean>>({})

// 個人記録データ（選択されたプレイヤーとフィルターを適用）
const personalRecords = computed(() => {
  if (!selectedPlayer.value) return []
  return getFilteredPersonalRecords({
    players: [selectedPlayer.value],
    lessons: currentFilters.value.lessons,
    levels: currentFilters.value.levels,
    dateFrom: currentFilters.value.dateFrom,
    dateTo: currentFilters.value.dateTo
  })
})

// フィルター更新ハンドラ
const handleFiltersUpdate = (filters: {
  lessons?: string[]
  levels?: string[]
  players?: string[]
  dateFrom: Date | null
  dateTo: Date | null
}) => {
  currentFilters.value = filters

  // フィルター変更時、選択中のプレイヤーがリストに存在しない場合はリセット
  if (selectedPlayer.value) {
    const availablePlayers = filteredPlayers.value
    if (!availablePlayers.has(selectedPlayer.value)) {
      // 新しいリストの最初のプレイヤーを選択
      selectedPlayer.value = firstPlayer.value
    }
  }
}

// データ変更時に全て展開
watch(personalRecords, (newRecords) => {
  // コースを全て展開
  newRecords.forEach(course => {
    expandedCourses[course.category] = true
    // レベルも全て展開
    course.levels.forEach(level => {
      expandedLevels[`${course.category}-${level.level}`] = true
    })
  })
}, { immediate: true })

// レッスン数をカウント
const getLessonCount = (course: { levels: { lessons: any[] }[] }) => {
  return course.levels.reduce((sum, level) => sum + level.lessons.length, 0)
}

// 展開トグル
const toggleCourse = (category: string) => {
  expandedCourses[category] = !expandedCourses[category]
}

const toggleLevel = (category: string, level: string) => {
  const key = `${category}-${level}`
  expandedLevels[key] = !expandedLevels[key]
}

const toggleLesson = (title: string) => {
  expandedLessons[title] = !expandedLessons[title]
}

const toggleSession = (lessonTitle: string, idx: number | string) => {
  const key = `${lessonTitle}-${idx}`
  expandedSessions[key] = !expandedSessions[key]
}

// ベストスコアのセッションを取得
const getBestSession = (lesson: { sessions: any[], bestScore: number }) => {
  return lesson.sessions.find(s => s.score === lesson.bestScore)
}

// 最新N回分のセッションを取得（日付降順で既にソート済み）
const getLatestSessions = (lesson: { sessions: any[] }, count: number) => {
  return lesson.sessions.slice(0, count)
}

// 日時フォーマット
const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// スコアに応じたクラスを取得
const getScoreClass = (score: number) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 50) return 'score-average'
  return 'score-low'
}

// 初期化
onMounted(async () => {
  if (!isDataLoaded.value) {
    try {
      await loadDemoData()
    } catch (error) {
      console.error('デモデータの読み込みに失敗しました:', error)
    }
  }

  // データ読み込み後、最初のプレイヤーを選択
  await nextTick()
  if (firstPlayer.value && !selectedPlayer.value) {
    selectedPlayer.value = firstPlayer.value
  }
})

// データ読み込み後に最初のプレイヤーを選択
watch(isDataLoaded, (loaded) => {
  if (loaded && firstPlayer.value && !selectedPlayer.value) {
    selectedPlayer.value = firstPlayer.value
  }
})
</script>

<style scoped>
/* ========================================
   レコードカード - Nuxt UI Dashboard Style
   ======================================== */
.records-card {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  box-shadow: var(--ui-shadow-sm);
}

.records-card-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ui-border);
}

.records-header-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.records-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.records-title-icon {
  font-size: 18px;
  color: #f59e0b;
}

.player-select-wrapper {
  flex: 1;
  max-width: 300px;
}

.player-select {
  width: 100%;
}

.records-subtitle {
  font-size: 12px;
  color: var(--ui-text-muted);
  margin-top: 8px;
}

/* 空の状態 */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--ui-text-muted);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
  opacity: 0.7;
}

/* レコードツリー */
.records-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* コースアイテム */
.course-item {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
}

.course-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--ui-bg-elevated);
  cursor: pointer;
  transition: background 0.15s ease;
}

.course-header:hover {
  background: var(--ui-bg-accented);
}

.expand-icon {
  font-size: 12px;
  color: var(--ui-text-dimmed);
  width: 16px;
  flex-shrink: 0;
}

.course-icon {
  font-size: 16px;
  color: #f59e0b;
}

.course-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

/* レベルリスト */
.level-list {
  padding: 8px 8px 8px 24px;
  border-top: 1px solid var(--ui-border);
}

.level-item {
  margin-bottom: 8px;
}

.level-item:last-child {
  margin-bottom: 0;
}

/* レベルヘッダー */
.level-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--ui-bg-elevated);
  border-radius: var(--ui-radius);
  cursor: pointer;
  transition: background 0.15s ease;
}

.level-header:hover {
  background: var(--ui-bg-accented);
}

.level-badge {
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  padding: 2px 10px;
  border-radius: 4px;
}

/* レッスンリスト（ネスト構造） */
.lesson-list-nested {
  padding: 8px 0 4px 20px;
  border-left: 2px solid rgba(139, 92, 246, 0.2);
  margin-left: 8px;
  margin-top: 8px;
}

.lesson-item {
  margin-bottom: 4px;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
  transition: all 0.15s ease;
}

.lesson-item:last-child {
  margin-bottom: 0;
}

.lesson-item.expanded {
  border-color: var(--ui-primary);
  box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.1);
}

.lesson-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.lesson-row:hover {
  background: var(--ui-bg-elevated);
}

.lesson-icon {
  font-size: 14px;
  color: #10b981;
}

.lesson-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-scores {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.score-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--ui-text-muted);
  text-transform: uppercase;
}

.score-value {
  font-size: 13px;
  font-weight: 600;
}

/* スコア色分け */
.score-excellent { color: #10b981; }
.score-good { color: #0ea5e9; }
.score-average { color: #f59e0b; }
.score-low { color: #ef4444; }

/* レッスン詳細 */
.lesson-detail {
  border-top: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}

.session-list {
  padding: 8px 12px;
}

.session-item {
  margin-bottom: 4px;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  overflow: hidden;
}

.session-item:last-child {
  margin-bottom: 0;
}

.session-item.expanded {
  border-color: rgba(14, 165, 233, 0.4);
}

/* ベストスコアのセッション */
.session-item.best-session {
  background: linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%);
  border-color: #f59e0b;
}

.session-item.best-session .session-row-best {
  background: transparent;
}

.session-row-best {
  background: rgba(245, 158, 11, 0.05);
}

.best-icon {
  font-size: 14px;
  color: #f59e0b;
}

.best-label {
  font-size: 11px;
  font-weight: 700;
  color: #b45309;
  background: rgba(245, 158, 11, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
}

.recent-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--ui-text-muted);
  background: var(--ui-bg-elevated);
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
}

.session-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: 12px;
}

.session-row:hover {
  background: var(--ui-bg-elevated);
}

.expand-icon-sm {
  font-size: 10px;
  color: var(--ui-text-dimmed);
  width: 12px;
  flex-shrink: 0;
}

.session-date {
  color: var(--ui-text-muted);
  min-width: 130px;
}

.session-score {
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.session-time {
  color: var(--ui-text-muted);
  min-width: 50px;
  text-align: right;
}

/* ========================================
   レスポンシブ
   ======================================== */
@media (max-width: 768px) {
  .records-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .player-select-wrapper {
    width: 100%;
    max-width: none;
  }

  .lesson-scores {
    flex-direction: column;
    gap: 4px;
  }

  .score-item {
    flex-direction: row;
    gap: 6px;
    min-width: auto;
  }

  .session-row {
    flex-wrap: wrap;
  }

  .session-date {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .records-card-header {
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .records-title {
    font-size: 14px;
  }

  .course-header {
    padding: 12px;
  }

  .level-list {
    padding-left: 16px;
  }

  .lesson-row {
    padding: 10px 12px;
  }

  .lesson-title {
    font-size: 12px;
  }
}
</style>
