/*
 * @Author: quling
 * @Date: 2022-09-11 11:15:28
 * @LastEditors: quling
 * @LastEditTime: 2022-09-11 16:54:58
 * @Description: 高级视口定位
 */
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import {Fill, Stroke, Style} from 'ol/style'

export default {
  data () {
    return {
      source: null
    }
  },
  methods: {
    addGeoJSON () {
      console.log('addGeoJSON')
      this.source = new VectorSource({
        url: 'https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json',
        format: new GeoJSON()
      })

      const style = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.6)'
        }),
        stroke: new Stroke({
          color: '#BDBDBD',
          width: 2
        })
      })

      const layer = new VectorLayer({
        source: this.source,
        style: style
      })

      this.map.addLayer(layer)
    },
    zoomToGeoJSON () {
      if (this.source) {
        const features = this.source.getFeatures()[0]
        console.log(features)
        console.log(features.getKeys())
        console.log(features.get('name'))
        const GeoJSON = features.getGeometry()
        // 叠加feature
        const source = new VectorSource({})
        source.addFeature(features)
        const style = new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.6)'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2
          })
        })
        const layer = new VectorLayer({
          source,
          style
        })
        this.map.addLayer(layer)
        const extent = source.getExtent()
        console.log(extent)
        // 定位
        this.map.getView().fit(GeoJSON)
        // this.map.getView().fit(extent)

        console.log(GeoJSON.getCoordinates())
      }
    }
  }
}
