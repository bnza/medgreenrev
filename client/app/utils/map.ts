import type { StyleLike } from 'ol/style/Style'
import type { FlatStyleLike } from 'ol/style/flat'
import { toFunction as toStyleFunction } from 'ol/style/Style'
import { Style, Text, Fill, Stroke } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import type { TextPlacement } from 'ol/style/Text'
import type { ColorLike } from 'ol/colorlike'
import type { Color } from 'ol/color'

export type NormalizedStyleFunction = (
  feature: FeatureLike,
  resolution: number,
) => Style[]

export type TextLabelOptions = {
  labelProperty: string
  visible: boolean
  placement?: TextPlacement
  size?: number
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
  offsetX?: number
  offsetY?: number
  overflow?: boolean
}

export type StyleCircleOptions = {
  radius: number
  fill: { color: Color | ColorLike }
  stroke: { color: Color | ColorLike; width?: number }
}

export type TextLabelStyleOptions = Omit<
  TextLabelOptions,
  'labelProperty' | 'visible'
>

export const DEFAULT_TEXT_LABEL_OPTIONS = {
  fill: {
    color: '#222',
  },
  stroke: {
    color: '#fff',
    width: 3,
  },
  offsetX: 10,
  offsetY: -10,
  textAlign: 'left',
  textBaseline: 'bottom',
  overflow: true,
} as const

function makeLabelStyle(
  text: string,
  resolution: number,
  options: TextLabelStyleOptions | undefined = {
    placement: 'point',
    size: 12,
  },
) {
  const {
    placement,
    size = 12,
    textAlign: optionsTextAlign,
    textBaseline: optionsTextBaseline,
    offsetX: optionsOffsetX,
    offsetY: optionsOffsetY,
  } = options || {}
  const scale = resolution < 10 ? 1.5 : 1.2
  const { fill, stroke, offsetX, offsetY, textBaseline, textAlign } =
    DEFAULT_TEXT_LABEL_OPTIONS
  return new Style({
    text: new Text({
      text: String(text),
      fill: new Fill({ color: fill.color }),
      font: `${size}px Montserrat, Manrope, sans-serif`,
      scale,
      stroke: new Stroke({
        color: stroke.color,
        width: stroke.width,
      }),
      textAlign: optionsTextAlign ?? textAlign,
      textBaseline: optionsTextBaseline ?? textBaseline,
      overflow: true,
      offsetX: optionsOffsetX ?? offsetX,
      offsetY: optionsOffsetY ?? offsetY,
      placement,
    }),
  })
}

export function makeTextLabelStyleFn(
  options: TextLabelOptions,
  showNumberMatched: boolean = false,
) {
  return (feature: FeatureLike, resolution: number) => {
    if (!options.visible) return []
    const styles: Style[] = []

    // Standard Label
    const text = feature.get(options.labelProperty)
    if (text !== undefined && text !== null) {
      styles.push(makeLabelStyle(String(text), resolution, options))
    }

    // Number Matched Label (Centered)
    if (showNumberMatched) {
      const numberMatched = feature.get('number_matched')
      if (numberMatched !== undefined && numberMatched !== null) {
        styles.push(
          makeLabelStyle(String(numberMatched), resolution, {
            ...options,
            textAlign: 'center',
            textBaseline: 'middle',
            offsetX: 0,
            offsetY: 0,
            overflow: true,
          }),
        )
      }
    }

    return styles
  }
}

// Normalize any supported base style into a function returning Style[]
export function normalizeBaseStyle(
  base: StyleLike | FlatStyleLike | null | undefined,
): NormalizedStyleFunction {
  if (!base) return () => []

  if (typeof base === 'function') {
    // Normalize any StyleLike result to Style[]
    return (f: FeatureLike, r: number): Style[] => {
      const out = base(f, r)
      if (!out) return []
      return Array.isArray(out) ? out : [out]
    }
  }

  // Distinguish classic StyleLike vs FlatStyleLike by shape
  const isClassicStyleObject = (obj: any): obj is StyleLike =>
    !!obj &&
    (typeof obj.getText === 'function' || typeof obj.getFill === 'function')

  if (Array.isArray(base)) {
    const styleLike = base.filter((s) => isClassicStyleObject(s))
    if (styleLike.length > 0) {
      const fn = toStyleFunction(styleLike)
      return (f: FeatureLike, r: number): Style[] => fn(f, r) as Style[]
    }
    // Flat style literals are not supported for composition with classic Styles; fallback to no base
    return () => []
  }

  if (isClassicStyleObject(base)) {
    const fn = toStyleFunction(base as any)
    return (f: FeatureLike, r: number): Style[] => fn(f, r) as Style[]
  }
  // Flat style literal not supported here; fallback
  return () => []
}

// Create a decorated style function that appends a dynamic label to the provided base style
export function decorateStyle(
  baseFn: NormalizedStyleFunction,
  styleFns: NormalizedStyleFunction[] = [],
) {
  // Return a style function that merges base + dynamic label
  return (feature: FeatureLike, resolution: number): Style[] => {
    const baseStyles: Style[] = baseFn(feature, resolution)
    const styles = styleFns.flatMap((fn) => fn(feature, resolution))
    return [...baseStyles, ...styles]
  }
}
