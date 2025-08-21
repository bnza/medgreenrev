interface UseResponsiveTableOptions {
  /** Selector for elements to subtract height from (e.g., headers, toolbars) */
  excludeSelectors?: string[]
  /** Fixed offset in pixels */
  fixedOffset?: number
  /** Minimum table height */
  minHeight?: number
  /** Maximum table height */
  maxHeight?: number
  /** Debounce delay for resize events */
  debounceMs?: number
}

export default function useResponsiveTable(
  options: UseResponsiveTableOptions = {},
) {
  const {
    excludeSelectors = ['.v-app-bar', '.v-toolbar', '.v-pagination'],
    fixedOffset = 100,
    minHeight = 300,
    maxHeight = Infinity,
    debounceMs = 150,
  } = options

  const windowHeight = ref(0)
  const excludedHeight = ref(0)
  let resizeTimeout: NodeJS.Timeout | null = null

  // Calculate height of excluded elements
  const calculateExcludedHeight = async () => {
    await nextTick()

    let totalHeight = 0
    excludeSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        totalHeight += rect.height
      })
    })

    excludedHeight.value = totalHeight
  }

  // Calculate the available table height
  const availableHeight = computed(() => {
    const calculated = windowHeight.value - excludedHeight.value - fixedOffset
    return Math.max(minHeight, Math.min(maxHeight, calculated))
  })

  const tableHeightPx = computed(() => `${availableHeight.value}px`)
  const tableHeightNumber = computed(() => availableHeight.value)

  // Debounced resize handler
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(async () => {
      windowHeight.value = window.innerHeight
      await calculateExcludedHeight()
    }, debounceMs)
  }

  // Initialize
  const initialize = async () => {
    windowHeight.value = window.innerHeight
    await calculateExcludedHeight()
  }

  onMounted(async () => {
    await initialize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
  })

  return {
    windowHeight: readonly(windowHeight),
    excludedHeight: readonly(excludedHeight),
    availableHeight: readonly(availableHeight),
    tableHeightPx: readonly(tableHeightPx),
    tableHeightNumber: readonly(tableHeightNumber),
    recalculate: initialize,
  }
}
