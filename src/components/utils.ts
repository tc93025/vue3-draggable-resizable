import {
  ContainerProvider,
  ParentSize,
  ReferenceLineMap,
  ResizingHandle
} from './types'
import { ALL_HANDLES } from './Vue3DraggableResizable'

export const IDENTITY = Symbol('Vue3DraggableResizable')

export function getElSize(el: Element) {
  const style = window.getComputedStyle(el)
  return {
    width: parseFloat(style.getPropertyValue('width')),
    height: parseFloat(style.getPropertyValue('height'))
  }
}

export function addEvent<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) {
  if (!el) {
    return
  }
  el.addEventListener(event, handler)
}
export function removeEvent<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) {
  if (!el) {
    return
  }
  el.removeEventListener(event, handler)
}

export function filterHandles(handles: ResizingHandle[]) {
  if (handles && handles.length > 0) {
    return [...new Set([...handles].filter((i) => ALL_HANDLES.includes(i)))]
  } else {
    return []
  }
}

export function getId() {
  return String(Math.random()).substr(2) + String(Date.now())
}

export function getReferenceLineMap(
  containerProvider: ContainerProvider,
  parentSize: ParentSize,
  id?: string
) {
  if (containerProvider.disabled.value) {
    return null
  }
  const referenceLine = {
    row: [] as number[],
    col: [] as number[]
  }
  const { parentWidth, parentHeight } = parentSize
  referenceLine.row.push(...containerProvider.adsorbRows)
  referenceLine.col.push(...containerProvider.adsorbCols)
  if (containerProvider.adsorbParent.value) {
    referenceLine.row.push(0, parentHeight.value, parentHeight.value / 2)
    referenceLine.col.push(0, parentWidth.value, parentWidth.value / 2)
  }
  const widgetPositionStore = containerProvider.getPositionStore(id)
  Object.values(widgetPositionStore).forEach(({ x, y, w, h }) => {
    referenceLine.row.push(y, y + h, y + h / 2)
    referenceLine.col.push(x, x + w, x + w / 2)
  })
  const referenceLineMap: ReferenceLineMap = {
    row: referenceLine.row.reduce((pre, cur) => {
      return { ...pre, [cur]: { min: cur - 5, max: cur + 5, value: cur } }
    }, {}),
    col: referenceLine.col.reduce((pre, cur) => {
      return { ...pre, [cur]: { min: cur - 5, max: cur + 5, value: cur } }
    }, {})
  }
  return referenceLineMap
}
