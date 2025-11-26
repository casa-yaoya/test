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
    // セレクトのデフォルト設定
    select: {
      slots: {
        base: 'inline-flex items-center justify-between gap-1.5 rounded-md border border-gray-200 bg-white text-sm',
        leading: 'flex items-center',
        leadingIcon: 'shrink-0 text-gray-400',
        value: 'truncate text-left',
        trailing: 'flex items-center shrink-0',
        trailingIcon: 'shrink-0 text-gray-400'
      },
      variants: {
        size: {
          xs: { base: 'h-7 px-2 text-xs' },
          sm: { base: 'h-8 px-2.5 text-sm' },
          md: { base: 'h-9 px-3 text-sm' },
          lg: { base: 'h-10 px-3.5 text-base' },
          xl: { base: 'h-11 px-4 text-base' }
        }
      }
    },
    // セレクトメニュー（ドロップダウン部分）のデフォルト設定
    selectMenu: {
      slots: {
        content: 'bg-white border border-gray-200 rounded-md shadow-lg',
        item: 'flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50',
        itemLeadingIcon: 'shrink-0 text-gray-400',
        itemTrailingIcon: 'shrink-0 text-gray-400'
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
