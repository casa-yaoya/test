<template>
  <div class="structure-page">
    <div class="page-header">
      <h1 class="page-title">システム構造</h1>
      <p class="page-description">フローをクリックすると処理詳細とプロンプトを表示</p>
    </div>

    <!-- フロー1: ファイルアップロード -->
    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-number">1</span>
        <span class="flow-section-title">ファイルアップロード</span>
      </div>
      <div class="flow-container">
        <div class="flow-line">
          <!-- ファイルアップロード -->
          <div class="flow-node flow-node-start" @click="openPopup('upload')">
            <div class="node-header">
              <span class="node-icon">📁</span>
              <span class="node-label">アップロード</span>
            </div>
            <div class="node-desc">ファイルをドロップ</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- ファイル形式分岐 -->
          <div class="flow-branch-vertical">
            <div class="branch-header">形式判定</div>
            <div class="branch-items-vertical">
              <div class="flow-node-mini" @click="openPopup('pdf')">
                <span class="node-icon-mini">📑</span>
                <span class="node-label-mini">PDF</span>
                <span class="node-api api-openai">GPT-4o</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('excel')">
                <span class="node-icon-mini">📊</span>
                <span class="node-label-mini">Excel</span>
                <span class="node-api api-lib">xlsx</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('pptx')">
                <span class="node-icon-mini">📝</span>
                <span class="node-label-mini">PPTX/Word</span>
                <span class="node-api api-lib">JSZip</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('audio')">
                <span class="node-icon-mini">🎵</span>
                <span class="node-label-mini">音声</span>
                <span class="node-api api-openai">Whisper</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('video')">
                <span class="node-icon-mini">🎬</span>
                <span class="node-label-mini">動画</span>
                <span class="node-api api-openai">Whisper</span>
              </div>
            </div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 範囲選択 -->
          <div class="flow-node flow-node-question" @click="openPopup('range')">
            <div class="node-header">
              <span class="node-icon">📐</span>
              <span class="node-label">範囲選択</span>
            </div>
            <div class="node-desc">ページ/シート指定</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 種別選択 -->
          <div class="flow-node flow-node-question" @click="openPopup('type')">
            <div class="node-header">
              <span class="node-icon">🏷️</span>
              <span class="node-label">種別選択</span>
            </div>
            <div class="node-desc">見本/教材/自社/顧客</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- アップロード完了 -->
          <div class="flow-node flow-node-end">
            <div class="node-header">
              <span class="node-icon">✅</span>
              <span class="node-label">アップロード完了</span>
            </div>
            <div class="node-desc">別ファイル追加可能</div>
          </div>
        </div>
      </div>
    </div>

    <!-- フロー2: ロープレ構築 -->
    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-number">2</span>
        <span class="flow-section-title">ロープレ構築</span>
      </div>
      <div class="flow-container">
        <div class="flow-line">
          <!-- 構築スタート -->
          <div class="flow-node flow-node-start" @click="openPopup('build-start')">
            <div class="node-header">
              <span class="node-icon">🚀</span>
              <span class="node-label">構築スタート</span>
            </div>
            <div class="node-desc">ボタン押下</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 使用ファイル選択 -->
          <div class="flow-node flow-node-question" @click="openPopup('file-select')">
            <div class="node-header">
              <span class="node-icon">📄</span>
              <span class="node-label">使用ファイル選択</span>
            </div>
            <div class="node-desc">複数選択可</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- ゴール選択 -->
          <div class="flow-node flow-node-question" @click="openPopup('goal')">
            <div class="node-header">
              <span class="node-icon">🎯</span>
              <span class="node-label">ゴール選択</span>
            </div>
            <div class="node-desc">暗記/説明/ヒアリング等</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- ロープレ構築 -->
          <div class="flow-node flow-node-ai" @click="openPopup('build')">
            <div class="node-header">
              <span class="node-icon">🤖</span>
              <span class="node-label">ロープレ構築</span>
              <span class="node-api api-responses">Responses API</span>
            </div>
            <div class="node-desc">ポイント抽出・台本生成</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 構築完了 -->
          <div class="flow-node flow-node-end">
            <div class="node-header">
              <span class="node-icon">✅</span>
              <span class="node-label">構築完了</span>
            </div>
            <div class="node-desc">設計パネルに表示</div>
          </div>
        </div>
      </div>
    </div>

    <!-- フロー3: プロンプト合成（4構成要素） -->
    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-number">3</span>
        <span class="flow-section-title">プロンプト合成（4構成要素）</span>
        <span class="flow-section-badge">AI不使用・即時合成</span>
      </div>
      <div class="flow-container">
        <div class="flow-line">
          <!-- プロンプト生成ボタン -->
          <div class="flow-node flow-node-start" @click="openPopup('prompt-gen-start')">
            <div class="node-header">
              <span class="node-icon">✨</span>
              <span class="node-label">プロンプト生成</span>
            </div>
            <div class="node-desc">ボタン押下</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 流れ設定ダイアログ -->
          <div class="flow-node flow-node-question" @click="openPopup('flow-settings')">
            <div class="node-header">
              <span class="node-icon">⚙️</span>
              <span class="node-label">流れ設定</span>
            </div>
            <div class="node-desc">話し方・終了条件等</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 4構成要素の合成 -->
          <div class="flow-branch-vertical">
            <div class="branch-header">4構成要素の合成</div>
            <div class="branch-items-vertical">
              <div class="flow-node-mini" @click="openPopup('comp-mode-instruction')">
                <span class="node-icon-mini">①</span>
                <span class="node-label-mini">モード毎の固定指示</span>
                <span class="node-api api-lib">固定</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('comp-character')">
                <span class="node-icon-mini">②</span>
                <span class="node-label-mini">人格設定</span>
                <span class="node-api api-lib">キャラ</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('comp-flow')">
                <span class="node-icon-mini">③</span>
                <span class="node-label-mini">流れ設定</span>
                <span class="node-api api-lib">設定値</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('comp-content')">
                <span class="node-icon-mini">④</span>
                <span class="node-label-mini">内容設定</span>
                <span class="node-api api-lib">ポイント等</span>
              </div>
            </div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 4モード分のプロンプト -->
          <div class="flow-branch-vertical">
            <div class="branch-header">4モード分を生成</div>
            <div class="branch-items-vertical">
              <div class="flow-node-mini" @click="openPopup('mode-confirmation')">
                <span class="node-icon-mini">✅</span>
                <span class="node-label-mini">確認モード</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('mode-practice')">
                <span class="node-icon-mini">👔</span>
                <span class="node-label-mini">実践モード</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('mode-subtitle')">
                <span class="node-icon-mini">📖</span>
                <span class="node-label-mini">台本モード</span>
              </div>
              <div class="flow-node-mini" @click="openPopup('mode-demo')">
                <span class="node-icon-mini">✨</span>
                <span class="node-label-mini">お手本モード</span>
              </div>
            </div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- プロンプト表示 -->
          <div class="flow-node flow-node-end" @click="openPopup('prompt-display')">
            <div class="node-header">
              <span class="node-icon">👁️</span>
              <span class="node-label">出力パネル</span>
            </div>
            <div class="node-desc">合成プロンプト表示</div>
          </div>
        </div>
      </div>
    </div>

    <!-- フロー4: ロープレ実行 -->
    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-number">4</span>
        <span class="flow-section-title">ロープレ実行</span>
      </div>
      <div class="flow-container">
        <div class="flow-line">
          <!-- スタートボタン -->
          <div class="flow-node flow-node-start" @click="openPopup('play-start')">
            <div class="node-header">
              <span class="node-icon">▶️</span>
              <span class="node-label">スタート</span>
            </div>
            <div class="node-desc">ボタン押下</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 合成済みプロンプト使用 -->
          <div class="flow-node flow-node-data" @click="openPopup('use-merged')">
            <div class="node-header">
              <span class="node-icon">📋</span>
              <span class="node-label">合成プロンプト</span>
            </div>
            <div class="node-desc">事前に合成済み</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 音声会話 -->
          <div class="flow-node flow-node-realtime" @click="openPopup('realtime')">
            <div class="node-header">
              <span class="node-icon">🎤</span>
              <span class="node-label">音声会話</span>
              <span class="node-api api-realtime">Realtime API</span>
            </div>
            <div class="node-desc">リアルタイム音声認識・合成</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 会話ログ -->
          <div class="flow-node flow-node-data">
            <div class="node-header">
              <span class="node-icon">💬</span>
              <span class="node-label">会話ログ</span>
            </div>
            <div class="node-desc">全発話を記録</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- フィードバック生成 -->
          <div class="flow-node flow-node-ai" @click="openPopup('feedback')">
            <div class="node-header">
              <span class="node-icon">📊</span>
              <span class="node-label">評価生成</span>
              <span class="node-api api-responses">gpt-4.1</span>
            </div>
            <div class="node-desc">100点満点で採点</div>
          </div>

          <div class="flow-arrow">→</div>

          <!-- 結果表示 -->
          <div class="flow-node flow-node-end" @click="openPopup('result')">
            <div class="node-header">
              <span class="node-icon">🏆</span>
              <span class="node-label">結果表示</span>
            </div>
            <div class="node-desc">スコア・改善点</div>
          </div>
        </div>
      </div>
    </div>

    <!-- API凡例 -->
    <div class="api-legend">
      <span class="legend-title">使用API:</span>
      <span class="legend-item"><span class="node-api api-openai">GPT-4o</span> OpenAI Vision/Whisper (gpt-4o)</span>
      <span class="legend-item"><span class="node-api api-lib">lib</span> ライブラリ/固定処理（AI不使用）</span>
      <span class="legend-item"><span class="node-api api-responses">gpt-4.1</span> Responses API (gpt-4.1)</span>
      <span class="legend-item"><span class="node-api api-realtime">Realtime</span> Realtime API (gpt-4o-realtime-preview)</span>
    </div>

    <!-- ポップアップ -->
    <UModal v-model:open="showPopup" :title="popupTitle">
      <template #body>
        <div class="popup-content">
          <div class="popup-section">
            <h4 class="popup-section-title">処理概要</h4>
            <p class="popup-description">{{ popupDescription }}</p>
          </div>

          <div v-if="popupApi" class="popup-section">
            <h4 class="popup-section-title">使用API</h4>
            <UBadge :color="getApiColor(popupApi)" variant="subtle">{{ popupApi }}</UBadge>
          </div>

          <div v-if="popupPrompt" class="popup-section">
            <h4 class="popup-section-title">
              プロンプト / テンプレート
              <UButton
                variant="ghost"
                size="xs"
                icon="i-lucide-copy"
                class="popup-copy-btn"
                @click="copyPrompt"
              />
            </h4>
            <textarea
              v-model="popupPrompt"
              class="popup-prompt-textarea"
              :rows="15"
              readonly
            />
          </div>

          <div v-if="popupFilePath" class="popup-section">
            <span class="popup-file-path">{{ popupFilePath }}</span>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="popup-footer">
          <UButton variant="ghost" color="neutral" @click="showPopup = false">閉じる</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const showPopup = ref(false)
const popupTitle = ref('')
const popupDescription = ref('')
const popupApi = ref('')
const popupPrompt = ref('')
const popupFilePath = ref('')
const currentNodeId = ref('')

interface NodeInfo {
  title: string
  description: string
  api?: string
  filePath?: string
  prompt?: string
}

const nodeInfoMap: Record<string, NodeInfo> = {
  'upload': {
    title: 'ファイルアップロード',
    description: 'ユーザーがファイルをドラッグ&ドロップまたは選択してアップロードします。\n\n対応形式:\n- PDF\n- Excel (.xlsx, .xls)\n- PowerPoint (.pptx)\n- Word (.docx)\n- 音声 (MP3, WAV, M4A)\n- 動画 (MP4, MOV, WebM)\n- テキスト (.txt)',
  },
  'pdf': {
    title: 'PDF処理',
    description: 'PDFを画像として読み取り、GPT-4oのビジョン機能でテキストを抽出します。図表やレイアウトも理解して構造化されたテキストに変換します。',
    api: 'OpenAI API (GPT-4o Vision)',
    filePath: 'server/api/analyze.post.ts',
  },
  'excel': {
    title: 'Excel処理',
    description: 'xlsx.jsライブラリを使用してExcelファイルを解析し、各シートのデータをCSV形式に変換します。\n\nAIは使用せず、ローカルで処理します。',
    api: 'ライブラリ (xlsx.js)',
    filePath: 'server/utils/fileParser.ts'
  },
  'pptx': {
    title: 'PowerPoint / Word処理',
    description: 'JSZipライブラリでOOXML形式のファイルを解凍し、XMLからテキストを抽出します。\n\nスライドごと・段落ごとに構造化されたテキストを取得します。AIは使用しません。',
    api: 'ライブラリ (JSZip)',
    filePath: 'server/utils/fileParser.ts'
  },
  'audio': {
    title: '音声処理',
    description: 'OpenAI Whisper APIを使用して音声ファイルを文字起こしします。\n\n日本語に最適化されており、高精度なテキスト変換が可能です。',
    api: 'OpenAI API (Whisper)',
    filePath: 'server/api/upload.post.ts'
  },
  'video': {
    title: '動画処理',
    description: '動画ファイルから音声トラックを抽出し、OpenAI Whisper APIで文字起こしを行います。\n\n長時間の動画も対応可能です。',
    api: 'OpenAI API (Whisper)',
    filePath: 'server/api/upload.post.ts'
  },
  'range': {
    title: '範囲選択',
    description: 'ファイルの中から使用する範囲を選択します。不要な部分を除外することで、より精度の高いロープレ構築が可能になります。\n\n選択方法:\n- PDF/PPTX: ページ/スライド番号\n- Excel: シート名\n- 全部: すべて使用',
  },
  'type': {
    title: 'データ種別選択',
    description: 'アップロードしたファイルの種類を選択します。種別に応じて最適な処理方法が適用されます。\n\n種別:\n- 見本データ: お手本の会話や台本\n- 教材データ: 学習内容や資料\n- 自社データ: 商品・サービス情報\n- 顧客データ: 顧客・取引先情報',
  },
  'build-start': {
    title: '構築スタート',
    description: '「構築スタート」ボタンを押してロープレ構築フローを開始します。\n\nファイルをアップロード済みの場合、使用するファイルを選択するステップに進みます。\nファイルがない場合は直接ゴール選択に進みます。',
    filePath: 'app/components/ChatArea.vue (startRoleplayGeneration)',
  },
  'file-select': {
    title: '使用ファイル選択',
    description: 'アップロード済みのファイルから、今回の構築に使用するファイルを選択します。\n\n複数選択が可能で、選択されたファイルの内容がロープレ構築に使用されます。',
    filePath: 'app/components/ChatArea.vue (askForFileSelection)',
  },
  'goal': {
    title: 'ゴール選択',
    description: 'ロープレで達成したい目標を選択します。選択したゴールに応じて台本やプロンプトが最適化されます。\n\nゴール:\n- 暗記: 基本フレーズを覚える\n- 切り返し: 反論への対応力\n- ヒアリング: 情報引き出し力\n- 話し方: トーンや表現力',
  },
  'build': {
    title: 'ロープレ構築',
    description: 'OpenAI Responses APIを使用して、アップロードされたデータとゴールに基づいてロープレを構築します。\n\n処理内容:\n1. ファイル内容から重要ポイントを抽出\n2. ゴールに応じた学習ポイントを整理\n3. 概要・ポイント・台本を生成',
    api: 'OpenAI Responses API (gpt-4.1)',
    filePath: 'server/api/agent/chat.post.ts',
  },
  'prompt-gen-start': {
    title: 'プロンプト生成開始',
    description: '設計パネルの「プロンプト生成」ボタンを押して、4構成要素の合成を開始します。\n\nAIは使用せず、以下の4要素を即時に合成します：\n①モード毎の固定指示\n②人格設定\n③流れ設定\n④内容設定',
    filePath: 'app/components/BuildPanel.vue (confirmGeneratePrompts)',
  },
  'flow-settings': {
    title: '流れ設定ダイアログ',
    description: 'プロンプト生成前に、会話の流れに関する設定を行います。\n\n設定項目:\n- 相手の話し方（フレンドリー/ていねい/怖い）\n- 終了条件（ターン数上限、終了コール）\n- 不正解時の反応（確認モードのみ）\n\nこれらの設定は③流れ設定としてプロンプトに反映されます。',
    filePath: 'app/components/BuildPanel.vue (showConfirmDialog)',
  },
  'comp-mode-instruction': {
    title: '①モード毎の固定指示',
    description: 'モード毎に固定された基本指示文です。\n\nプロンプトの冒頭に挿入され、AIの役割と基本的な振る舞いを定義します。',
    api: '固定テンプレート（AI不使用）',
    filePath: 'app/composables/useBasePrompts.ts (MODE_INSTRUCTIONS)',
    prompt: `【確認モード】
あなたは先生の役として、相手が理解しているかを確認して。（問）と（正解）の組み合わせのリストを与えるので、これを元に、１つずつ問いかけて。

【実践モード】
あなたはお客様を演じ、以下に示す役割を演じて。話し相手は、内容の文脈によって変わるが、営業マンや、接客スタッフなどである。

【台本モード】
あなたはお客様として、相手の会話相手をして。ただし、あなたの発言は全て、下記に示される台本の通り、一語一句同じ内容を話して。相手の発言が、台本通りでなかったとしても、無視して自分のターンでは自分の発言を台本通りにして。

【お手本モード】
あなたは優秀なスタッフとして、以下に指示される内容を解釈し、お客様相手に会話して。`
  },
  'comp-character': {
    title: '②人格設定',
    description: 'キャラクター選択に紐づく、AIの人格設定です。\n\n「あなたの設定：」として追加されます。\n\n含まれる情報:\n- 名前\n- 年齢\n- 属性（職業・役職等）\n- 性格\n- 口癖',
    api: 'キャラクターデータ（AI不使用）',
    filePath: 'app/components/BuildPanel.vue (characters)',
    prompt: `あなたの設定：
- 名前: 高橋 明
- 年齢: 35歳
- 属性: IT企業 プロジェクトマネージャー
- 性格: 論理的で冷静、効率を重視する
- 口癖: 「具体的な数字で説明してください」`
  },
  'comp-flow': {
    title: '③流れ設定',
    description: 'プロンプト生成ダイアログで設定された内容から生成されます。\n\n【話し方】\n・フレンドリー: タメ口だが優しい話し方\n・ていねい: 敬語で優しい、間違えても励ます\n・怖い: タメ口で厳しく、命令口調\n\n【終了条件】\n・ターン数上限\n・終了コール\n\n【確認モードのみ】\n・不正解時の反応（正解を教える/ヒント/ヒントなし/触れない）',
    api: '設定値から生成（AI不使用）',
    filePath: 'app/composables/useBasePrompts.ts (generateFlowSettingsPrompt)',
    prompt: `◆話し方◆
端的に、伝えるべき内容を短く最低限で伝える。
敬語で、優しい話し方。間違えても励ましてくれる。
ただし、同じ内容の発言は繰り返さない。
問いは、書かれている内容をそのまま使うこと。

◆終了条件◆
会話は10ターンを上限として終了して。
プレイヤーまたはあなたが「会話終了」などの終了コールをした場合は、その時点で会話を終了して。

◆進行フロー◆（確認モードのみ）
（１）問いかけを行う。
（２）回答に対し、以下の分岐でフィードバックする。
・正解であると判定→正解！と言った後、一言だけフィードバックをして、次の問へ。
・不足や誤りがあり、正解でないと判定→不足や誤りがある部分を指摘し、正解を教え、次の問へ。
・相手がまじめに回答していない、何もいっていない等と判定→もう一度いうね、といって、問を繰り返す。
（３）全ての問が終わったら、会話終了。`
  },
  'comp-content': {
    title: '④内容設定',
    description: '設計パネルのポイント・台本・概要から構築されます。\n\n【シチュエーション】\n概要テキスト\n\n【問いかけリスト】（確認モード）\n問と正解のペア\n\n【台本】（台本モード）\n発話者と台詞のリスト\n\n【押さえるべきポイント】（実践/お手本モード）\nポイントと回答のリスト',
    api: '設計パネルデータから生成（AI不使用）',
    filePath: 'app/pages/content-creation.vue (generateSinglePrompt)',
    prompt: `【シチュエーション】
お客様は保険の見直しを検討している40代の会社員です。現在加入している保険の内容に不安を感じており、専門家のアドバイスを求めています。

【問いかけリスト】
1. （問）保険の見直しで最も重要なことは何ですか？
   （正解）現在のライフステージと将来の計画に合わせた保障内容の確認
   （ポイント）家族構成や収入の変化を考慮する

2. （問）保険料を抑えるにはどうすればよいですか？
   （正解）不要な特約の見直しと、保障の重複がないかチェックする
   （ポイント）他の保険や社会保障との重複を確認`
  },
  'mode-confirmation': {
    title: '確認モード',
    description: 'AIがQ&A形式でユーザーの理解度を確認します。\n\nポイントごとに質問を投げかけ、理解が不足している部分を補足説明します。\n\n【プロンプト構成】\n①モード固定指示（確認モード用）\n②人格設定（選択キャラクター）\n③流れ設定（不正解時の反応を含む）\n④内容設定（問いかけリスト）',
    filePath: 'app/composables/useBasePrompts.ts',
  },
  'mode-practice': {
    title: '実践モード',
    description: 'AIが顧客役として振る舞い、ユーザーの対応力を試します。\n\nリアルな営業シーンを想定した実践的なトレーニングです。\n\n【プロンプト構成】\n①モード固定指示（実践モード用）\n②人格設定（選択キャラクター）\n③流れ設定（話し方・終了条件）\n④内容設定（押さえるべきポイント）',
    filePath: 'app/composables/useBasePrompts.ts',
  },
  'mode-subtitle': {
    title: '台本モード',
    description: 'ユーザーが台本を読み上げ、AIが正しく話せているかチェックします。\n\nお手本の流れを学ぶ学習モードです。\n\n【プロンプト構成】\n①モード固定指示（台本モード用）\n②人格設定（選択キャラクター）\n③流れ設定（話し方・終了条件）\n④内容設定（台本）',
    filePath: 'app/composables/useBasePrompts.ts',
  },
  'mode-demo': {
    title: 'お手本モード',
    description: 'AIが先生役として模範的な営業トークを実演します。\n\nユーザーは顧客役として参加し、プロの対応を学びます。\n\n【プロンプト構成】\n①モード固定指示（お手本モード用）\n②人格設定（選択キャラクター）\n③流れ設定（話し方・終了条件）\n④内容設定（押さえるべきポイント）',
    filePath: 'app/composables/useBasePrompts.ts',
  },
  'prompt-display': {
    title: '出力パネル（合成プロンプト表示）',
    description: '合成されたプロンプトを出力パネルに表示します。\n\n【表示内容】\n4つの構成要素が合成された最終プロンプト：\n①モード毎の固定指示\n②人格設定\n③流れ設定\n④内容設定\n\nユーザーはここで最終的なプロンプトを確認・コピーできます。',
    filePath: 'app/pages/content-creation.vue (mergedPrompt)',
  },
  'use-merged': {
    title: '合成済みプロンプト使用',
    description: 'ロープレ開始時に、事前に合成済みのプロンプトを使用します。\n\n【動作】\n- 出力パネルに表示されている合成プロンプトをそのまま使用\n- Realtime APIへのinstructions設定に渡される\n\nスタート時に新たな処理は不要で、即座にロープレを開始できます。',
    filePath: 'app/pages/content-creation.vue (toggleRoleplay)',
  },
  'play-start': {
    title: 'ロープレ開始',
    description: 'スタートボタンを押してロープレを開始します。\n\n事前に合成済みのプロンプトを使用してRealtime APIとの接続を開始します。',
    filePath: 'app/pages/content-creation.vue (toggleRoleplay)',
  },
  'realtime': {
    title: '音声会話',
    description: 'OpenAI Realtime APIを使用して、リアルタイムの音声会話を実現します。\n\nユーザーの発話を即座に認識し、AIが自然な音声で応答します。WebSocketでサーバーと常時接続し、低遅延での会話を実現しています。\n\n【使用AIモデル】\n- gpt-4o-realtime-preview (Realtime API)',
    api: 'OpenAI Realtime API (gpt-4o-realtime-preview)',
    filePath: 'app/composables/useRealtimeAPI.ts'
  },
  'feedback': {
    title: '評価生成',
    description: '会話ログを分析し、100点満点で採点・評価を行います。\n\n各ポイントについて正答率を計算し、具体的な改善アドバイスを提供します。',
    api: 'OpenAI Responses API (gpt-4.1)',
    filePath: 'prompts/evaluation/feedback.md',
  },
  'result': {
    title: '結果表示',
    description: 'ロープレの評価結果を表示します。\n\n表示内容:\n- 総合スコア（100点満点）\n- 各ポイントの達成度\n- 改善アドバイス\n\n結果は履歴として保存され、成長を追跡できます。',
  }
}

const openPopup = (nodeId: string) => {
  currentNodeId.value = nodeId
  const info = nodeInfoMap[nodeId]
  if (info) {
    popupTitle.value = info.title
    popupDescription.value = info.description
    popupApi.value = info.api || ''
    popupPrompt.value = info.prompt || ''
    popupFilePath.value = info.filePath || ''
    showPopup.value = true
  }
}

const getApiColor = (api: string) => {
  if (api.includes('Realtime')) return 'info'
  if (api.includes('Responses')) return 'success'
  if (api.includes('OpenAI')) return 'success'
  if (api.includes('Claude')) return 'orange'
  if (api.includes('ライブラリ') || api.includes('固定') || api.includes('キャラクター') || api.includes('設定値') || api.includes('設計パネル')) return 'neutral'
  return 'neutral'
}

const copyPrompt = async () => {
  if (popupPrompt.value) {
    await navigator.clipboard.writeText(popupPrompt.value)
  }
}
</script>

<style scoped>
.structure-page {
  padding: 24px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  margin-bottom: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.page-description {
  font-size: 13px;
  color: #64748b;
}

/* フローセクション */
.flow-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.flow-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.flow-section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 14px;
  font-weight: 700;
  border-radius: 50%;
}

.flow-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.flow-section-badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  font-weight: 600;
  margin-left: auto;
}

/* フローコンテナ */
.flow-container {
  padding: 24px;
  overflow-x: auto;
}

.flow-line {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: fit-content;
}

/* 標準ノード */
.flow-node {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 10px;
  background: white;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
}

.flow-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.node-icon {
  font-size: 18px;
}

.node-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.node-desc {
  font-size: 11px;
  color: #6b7280;
  padding-left: 26px;
}

/* ノードタイプ別 */
.flow-node-start {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.flow-node-end {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.flow-node-question {
  border-color: #8b5cf6;
  background: #faf5ff;
}

.flow-node-ai {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.flow-node-realtime {
  border-color: #0ea5e9;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.flow-node-data {
  border-color: #94a3b8;
  background: #f8fafc;
}

/* 矢印 */
.flow-arrow {
  color: #9ca3af;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

/* 縦分岐 */
.flow-branch-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.branch-header {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.branch-items-vertical {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ミニノード（分岐内） */
.flow-node-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s;
}

.flow-node-mini:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.node-icon-mini {
  font-size: 14px;
  flex-shrink: 0;
}

.node-label-mini {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  flex-shrink: 0;
}

/* APIバッジ */
.node-api {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: auto;
}

.api-openai {
  background: #dcfce7;
  color: #166534;
}

.api-lib {
  background: #f3f4f6;
  color: #6b7280;
}

.api-responses {
  background: #d1fae5;
  color: #065f46;
}

.api-realtime {
  background: #dbeafe;
  color: #1e40af;
}

/* API凡例 */
.api-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 11px;
  color: #64748b;
  flex-wrap: wrap;
}

.legend-title {
  font-weight: 600;
  color: #475569;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ポップアップ */
.popup-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popup-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.popup-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-copy-btn {
  margin-left: auto;
}

.popup-description {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
}

.popup-prompt-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #334155;
  background: #f8fafc;
  resize: vertical;
}

.popup-prompt-textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.popup-file-path {
  font-size: 11px;
  color: #94a3b8;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .structure-page {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .api-legend {
    gap: 8px;
  }

  .flow-node {
    min-width: 120px;
    padding: 10px 12px;
  }

  .node-label {
    font-size: 12px;
  }
}
</style>
