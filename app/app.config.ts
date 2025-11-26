export default defineAppConfig({
  ui: {
    // カラー設定
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    // ボタンのデフォルト設定
    button: {
      slots: {
        base: 'rounded-md font-medium border-[0.5px]'
      },
      variants: {
        size: {
          xs: { base: 'px-2 py-1 text-xs' },
          sm: { base: 'px-3 py-1.5 text-sm' },
          md: { base: 'px-3.5 py-2 text-sm' },
          lg: { base: 'px-4 py-2.5 text-base' },
          xl: { base: 'px-5 py-3 text-base' }
        }
      }
    },
    // インプットのデフォルト設定
    input: {
      slots: {
        root: 'rounded-md border border-gray-200'
      },
      variants: {
        size: {
          sm: { base: 'px-2.5 py-1.5 text-sm' },
          md: { base: 'px-3 py-2 text-sm' },
          lg: { base: 'px-3.5 py-2.5 text-base' }
        }
      }
    },
    // セレクトのデフォルト設定（デフォルトの配置を維持）
    select: {
      defaultVariants: {
        variant: 'outline'
      }
    },
    // カードのデフォルト設定
    card: {
      slots: {
        root: 'rounded-lg border border-gray-200 bg-white shadow-sm',
        body: 'p-5'
      }
    },
    // チェックボックスのデフォルト設定
    checkbox: {
      slots: {
        base: 'rounded border border-gray-300'
      }
    },
    // アイコンのデフォルト設定
    icon: {
      slots: {
        base: 'shrink-0'
      }
    }
  }
})
