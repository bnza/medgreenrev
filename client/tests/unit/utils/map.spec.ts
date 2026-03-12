import { describe, it, expect, vi } from 'vitest'
import {
  makeTextLabelStyleFn,
  normalizeBaseStyle,
  decorateStyle,
} from '~/utils/map'
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'

function createFeature(properties: Record<string, unknown>) {
  const f = new Feature({ geometry: new Point([0, 0]) })
  for (const [key, value] of Object.entries(properties)) {
    f.set(key, value)
  }
  return f
}

describe('makeTextLabelStyleFn', () => {
  const baseOptions = {
    labelProperty: 'name',
    visible: true,
    placement: 'point' as const,
    size: 12,
  }

  it('returns one Style when showNumberMatched is false', () => {
    const fn = makeTextLabelStyleFn(baseOptions, false)
    const feature = createFeature({ name: 'Cabrera', number_matched: 8 })
    const styles = fn(feature, 1)

    expect(styles).toHaveLength(1)
    expect(styles[0]).toBeInstanceOf(Style)
    expect(styles[0].getText()).toBeInstanceOf(Text)
    expect(styles[0].getText()!.getText()).toBe('Cabrera')
  })

  it('returns two Styles when showNumberMatched is true', () => {
    const fn = makeTextLabelStyleFn(baseOptions, true)
    const feature = createFeature({ name: 'Cabrera', number_matched: 8 })
    const styles = fn(feature, 1)

    expect(styles).toHaveLength(2)

    // First style: standard label
    expect(styles[0].getText()!.getText()).toBe('Cabrera')

    // Second style: centered count
    expect(styles[1].getText()!.getText()).toBe('8')
    expect(styles[1].getText()!.getTextAlign()).toBe('center')
    expect(styles[1].getText()!.getTextBaseline()).toBe('middle')
    expect(styles[1].getText()!.getOffsetX()).toBe(0)
    expect(styles[1].getText()!.getOffsetY()).toBe(0)
  })

  it('returns empty array when visible is false', () => {
    const fn = makeTextLabelStyleFn({ ...baseOptions, visible: false }, true)
    const feature = createFeature({ name: 'X', number_matched: 5 })
    const styles = fn(feature, 1)

    expect(styles).toHaveLength(0)
  })
})

describe('decorateStyle', () => {
  it('merges base styles with label styles including showNumberMatched', () => {
    const circleStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({ color: 'black', width: 1 }),
      }),
    })

    const baseFn = normalizeBaseStyle(circleStyle)
    const labelFn = makeTextLabelStyleFn(
      {
        labelProperty: 'name',
        visible: true,
        placement: 'point',
        size: 12,
      },
      true,
    )

    const decorated = decorateStyle(baseFn, [labelFn])
    const feature = createFeature({ name: 'Cabrera', number_matched: 8 })
    const result = decorated(feature, 1)

    // Should have: circle + name label + count label
    expect(result).toHaveLength(3)
    expect(result[0].getImage()).toBeInstanceOf(CircleStyle)
    expect(result[1].getText()!.getText()).toBe('Cabrera')
    expect(result[2].getText()!.getText()).toBe('8')
  })
})
