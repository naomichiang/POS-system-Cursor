// 共用邏輯：上下捲動控制
import { ref, type Ref, onUnmounted, nextTick, watch } from 'vue'

// 軸向：垂直、水平
type Axis = 'vertical' | 'horizontal'

// 選項：軸向、步長、閾值
interface UseScrollControlsOptions {
  axis?: Axis
  step?: number
  threshold?: number
}

export function useScrollControls(
  scrollEl: Ref<HTMLElement | null>,
  options: UseScrollControlsOptions = {}
) {
  const axis: Axis = options.axis ?? 'vertical'
  const step = options.step ?? 200
  const threshold = options.threshold ?? 5 // 閾值：多少像素後顯示上下切換按鈕

  const showArrows = ref(false) // 是否顯示上下切換按鈕
  const isAtStart = ref(true)
  const isAtEnd = ref(true)

  let scrollElInst: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null

  const updateScrollState = () => {
    const el = scrollEl.value
    if (!el) return

    if (axis === 'vertical') {
      const { scrollHeight, clientHeight, scrollTop } = el
      showArrows.value = scrollHeight > clientHeight
      isAtStart.value = scrollTop <= threshold
      isAtEnd.value = scrollTop + clientHeight >= scrollHeight - threshold
    } else {
      const { scrollWidth, clientWidth, scrollLeft } = el // 水平軸向：捲動寬度、容器寬度、捲動位置
      showArrows.value = scrollWidth > clientWidth
      isAtStart.value = scrollLeft <= threshold
      isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - threshold
    }
  }

  const scrollPrev = () => {
    const el = scrollEl.value
    if (!el || isAtStart.value) return // 如果沒有元素或已經到達開始位置，則不進行捲動

    if (axis === 'vertical') {
      if (el.scrollTop < step) {
        // 如果捲動位置小於步長，則捲動到開始位置
        el.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ top: -step, behavior: 'smooth' })
      }
    } else {
      if (el.scrollLeft < step) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' })
      }
    }
  }

  const scrollNext = () => {
    const el = scrollEl.value
    if (!el || isAtEnd.value) return

    if (axis === 'vertical') {
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll - el.scrollTop < step) {
        el.scrollTo({ top: maxScroll, behavior: 'smooth' })
      } else {
        el.scrollBy({ top: step, behavior: 'smooth' })
      }
    } else {
      const maxScroll = el.scrollWidth - el.clientWidth
      const remaining = maxScroll - el.scrollLeft
      if (remaining < step) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }
  }

  const handleScroll = () => { // 處理捲動事件
    updateScrollState()
  }

  const cleanupListeners = () => { // 清理捲動事件監聽
    if (scrollElInst) {
      scrollElInst.removeEventListener('scroll', handleScroll)
      scrollElInst = null
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  const setupListeners = (el: HTMLElement | null) => { // 設置捲動事件監聽
    if (!el) return
    scrollElInst = el
    scrollElInst.addEventListener('scroll', handleScroll)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateScrollState)
      resizeObserver.observe(scrollElInst)
    }
    nextTick(updateScrollState)
  }

  watch(
    scrollEl,
    (el) => { // 監聽捲動元素變化
      cleanupListeners()
      setupListeners(el)
    },
    { immediate: true }
  )

  onUnmounted(() => { // 卸載時清理捲動事件監聽
    cleanupListeners()
  })

  return {
    showArrows,
    isAtStart,
    isAtEnd,
    scrollPrev,
    scrollNext,
    updateScrollState,
  }
}

