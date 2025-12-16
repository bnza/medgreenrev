import type { StyleLike } from 'ol/style/Style'
import type { FlatStyleLike } from 'ol/style/flat'
import { toFunction as toStyleFunction } from 'ol/style/Style'
import { Style, Text, Fill, Stroke } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import type { TextPlacement } from 'ol/style/Text'

export type NormalizedStyleFunction = (
  feature: FeatureLike,
  resolution: number,
) => Style[]

export type TextLabelOptions = {
  labelProperty: string
  visible: boolean
  placement?: TextPlacement
  size?: number
}

export type TextLabelStyleOptions = Omit<
  TextLabelOptions,
  'labelProperty' | 'visible'
>

function makeLabelStyle(
  text: string,
  resolution: number,
  { placement, size }: TextLabelStyleOptions | undefined = {
    placement: 'point',
    size: 12,
  },
) {
  const scale = resolution < 10 ? 1.5 : 1.2
  return new Style({
    text: new Text({
      text,
      fill: new Fill({ color: '#222' }),
      font: `${size}px Montserrat, Manrope, sans-serif`,
      scale,
      stroke: new Stroke({ color: '#fff', width: 3 }),
      textAlign: 'left',
      textBaseline: 'bottom',
      overflow: true,
      offsetX: 10,
      offsetY: -10,
      declutterMode: 'declutter',
      placement,
    }),
  })
}

export function makeTextLabelStyleFn(options: TextLabelOptions) {
  return (feature: FeatureLike, resolution: number) => {
    const text = (feature.get(options.labelProperty) ?? '') as string
    return options.visible ? [makeLabelStyle(text, resolution, options)] : []
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
