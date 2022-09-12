/*
 * @Author: quling
 * @Date: 2022-09-11 11:15:28
 * @LastEditors: quling
 * @LastEditTime: 2022-09-12 15:59:09
 * @Description: 高级视口定位
 */
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import { Fill, Stroke, Style } from 'ol/style'
import Select from 'ol/interaction/Select'

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

      const select = new Select({
        layers: [layer],
        style: new Style({
          fill: new Fill({
            color: '#1fee00'
          }),
          stroke: new Stroke({
            color: '#568920',
            width: 2
          }),
          zIndex: 1
        })
      })

      select.on('select', (e) => {
        // console.log('select', e)
        const features = e.selected
        console.log(features)
        const extent = features[0].getGeometry().getExtent()
        console.log(extent)
        const name = features[0].get('name')
        this.selectPosition = name
        this.map.getView().fit(extent)
      })

      this.map.addInteraction(select)

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
