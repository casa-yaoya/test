export default defineAppConfig({
  ui: {
    // カラー設定
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },

    // ボタン - Nuxt UI v3デフォルトを拡張
    button: {
      defaultVariants: {
        size: 'sm',
        color: 'primary',
        variant: 'solid'
      }
    },

    // セレクト - Nuxt UI v3デフォルトを使用（カスタムCSSで上書きしない）
    select: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      }
    },

    // インプット
    input: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      }
    },

    // カード
    card: {
      slots: {
        root: 'bg-white rounded-xl border border-slate-200 shadow-sm',
        header: 'px-5 py-4 border-b border-slate-100',
        body: 'p-5',
        footer: 'px-5 py-4 border-t border-slate-100'
      }
    },

    // チェックボックス
    checkbox: {
      defaultVariants: {
        color: 'primary'
      }
    },

    // バッジ
    badge: {
      defaultVariants: {
        size: 'sm',
        color: 'primary',
        variant: 'soft'
      }
    }
  }
})
