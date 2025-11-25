// Table sorting composable
// テーブルのソート機能を提供

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  column: string
  direction: SortDirection
}

export const useTableSort = <T extends Record<string, any>>(
  initialData: Ref<T[]> | ComputedRef<T[]>
) => {
  const sortState = ref<SortState>({
    column: '',
    direction: null
  })

  // ソート実行
  const sortedData = computed(() => {
    const data = [...initialData.value]

    if (!sortState.value.column || !sortState.value.direction) {
      return data
    }

    const { column, direction } = sortState.value

    return data.sort((a, b) => {
      let valueA = a[column]
      let valueB = b[column]

      // 日付の比較
      if (valueA instanceof Date && valueB instanceof Date) {
        return direction === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime()
      }

      // 数値の比較
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA
      }

      // 文字列の比較
      const strA = String(valueA || '').toLowerCase()
      const strB = String(valueB || '').toLowerCase()

      if (direction === 'asc') {
        return strA.localeCompare(strB, 'ja')
      } else {
        return strB.localeCompare(strA, 'ja')
      }
    })
  })

  // カラムクリック時のソート切り替え
  const toggleSort = (column: string) => {
    if (sortState.value.column === column) {
      // 同じカラムの場合、方向を切り替え
      if (sortState.value.direction === 'asc') {
        sortState.value.direction = 'desc'
      } else if (sortState.value.direction === 'desc') {
        // リセット
        sortState.value.column = ''
        sortState.value.direction = null
      } else {
        sortState.value.direction = 'asc'
      }
    } else {
      // 新しいカラムの場合、昇順で開始
      sortState.value.column = column
      sortState.value.direction = 'asc'
    }
  }

  // ソートアイコンの取得
  const getSortIcon = (column: string): string => {
    if (sortState.value.column !== column) {
      return '⇅' // 未ソート
    }
    if (sortState.value.direction === 'asc') {
      return '↑' // 昇順
    }
    if (sortState.value.direction === 'desc') {
      return '↓' // 降順
    }
    return '⇅'
  }

  // 特定のカラムがソートされているかチェック
  const isSorted = (column: string): boolean => {
    return sortState.value.column === column && sortState.value.direction !== null
  }

  // ソートをリセット
  const resetSort = () => {
    sortState.value.column = ''
    sortState.value.direction = null
  }

  return {
    sortState,
    sortedData,
    toggleSort,
    getSortIcon,
    isSorted,
    resetSort
  }
}
