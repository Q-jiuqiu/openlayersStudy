// 高级MapBox 矢量图块
<template>
  <!-- 地图容器 用来挂载显示地图 -->
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
// 包括Openlayers
import 'ol/ol.css'
import { Map, View } from 'ol'
import MVT from 'ol/format/MVT'
import TileGrid from 'ol/tilegrid/TileGrid'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
// import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { get as getProjection } from 'ol/proj'

const key =
  'pk.eyJ1IjoicXVsaW5nIiwiYSI6ImNrenJ1bHNoczJsOTMydnFva3A0aGJwdzUifQ.xWT6T9BBSIBT50y1gN8EUg'

const resolutions = []
for (let i = 0; i <= 8; ++i) {
  resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
}
// Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
function tileUrlFunction (tileCoord) {
  return (
    'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
    '{z}/{x}/{y}.vector.pbf?access_token=' +
    key
  )
    .replace('{z}', String(tileCoord[0] * 2 - 1))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
    .replace(
      '{a-d}',
      'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
    )
}

export default {
  data () {
    return {
      // 地图对象
      map: null
    }
  },
  mounted () {
    // 初始化地图
    this.map = new Map({
      target: 'map',
      layers: [
        // 矢量图层
        new VectorTileLayer({
          // 矢量图层的源
          source: new VectorTileSource({
            attributions:
              '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
              '© <a href="https://www.openstreetmap.org/copyright">' +
              'OpenStreetMap contributors</a>',
            format: new MVT(),
            tileGrid: new TileGrid({
              extent: getProjection('EPSG:3857').getExtent(),
              resolutions: resolutions,
              tileSize: 512
            }),
            tileUrlFunction: tileUrlFunction
          })
          // style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text)
        })
      ],
      view: new View({
        center: [0, 0],
        minZoom: 1,
        zoom: 2
      })
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#map {
  width: 500px;
  height: 500px;
  border: 1px solid #ccc;
  background: #f8f4f0;
}
</style>
