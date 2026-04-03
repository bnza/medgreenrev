import type { FeatureCollection } from 'geojson'

type Crs = {
  type: 'name'
  properties: {
    name: string
  }
}

export type ExtentResponse = {
  extent: [number, number, number, number]
  crs: Crs
}

type WFS20FeatureCollectionAttributes = {
  numberMatched: number
  numberReturned: number
  timeStamp: string
  crs: Crs | null
}

export type WFS20FeatureCollection = FeatureCollection &
  WFS20FeatureCollectionAttributes

export type BaseMap = 'osm' | 'esri'
