/*
 * @Author: quling
 * @Date: 2022-09-11 11:15:28
 * @LastEditors: quling
 * @LastEditTime: 2022-09-12 15:15:41
 * @Description: 给GeoJSON增加选择事件
 */

import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import Select from 'ol/interaction/Select'
import DragBox from 'ol/interaction/DragBox'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { rotate } from 'ol/transform'

export default {
  data () {
    return {
      selectPosition: 'None'
    }
  },
  methods: {
    boxSelection () {
      const source = new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON()
      })

      const style = new Style({
        fill: new Fill({
          color: '#eeeeee'
        })
      })

      const layer = new VectorLayer({
        source,
        background: '#1a2b39',
        style: function (feature) {
          const color = feature.get('COLOR') || '#eeeeee'
          style.getFill().setColor(color)
          return style
        }
      })

      this.map.addLayer(layer)

      const selectStyle = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2
        })
      })

      const select = new Select({
        style: function (feature) {
          const color = feature.get('COLOR_BIO') || '#eeeeee'
          selectStyle.getFill().setColor(color)
          return selectStyle
        }
      })

      this.map.addInteraction(select)

      console.log(select.getKeys(), select.getFeatures())

      const selectedFeatures = select.getFeatures()

      // DragBox:允许用户通过在地图上单击和拖动来绘制向量框
      const dragBox = new DragBox({
        // 监听shift按键,按下shift再拖拽可以画框放大
        condition: platformModifierKeyOnly
      })

      // 监听画框结束事件
      dragBox.on('boxend', function () {
        console.log('boxend')
        // 获取绘制的框的范围
        const extent = dragBox.getGeometry().getExtent()
        // getFeaturesInExtent 获取与提供范围相较的要素(features)
        // intersectsExtent 判断与提供范围是否相较
        const boxFeatures = source
          .getFeaturesInExtent(extent)
          .filter(feature => feature.getGeometry().intersectsExtent(extent))

        console.log('1', boxFeatures)

        const rotation = this.map.getView.getRotation()
        const oblique = rotation % (Math.PI / 2) !== 0

        if (oblique) {
          const anchor = [104.06, 30.67]
          const geometry = dragBox.getGeometry().clone()
          geometry.rotate(-rotation, anchor)
          const extent = geometry.getExtent()
          boxFeatures.forEach(feature => {
            const geometry = rotate(-rotation, anchor)
            if (geometry.intersectsExtent(extent)) {
              selectedFeatures.push(feature)
            }
          })
        } else {
          selectedFeatures.extent(boxFeatures)
        }
      })

      // 监听画框开始事件
      dragBox.on('boxstart', function () {
        selectedFeatures.clear()
      })

      selectedFeatures.on(['add', 'remove'], () => {
        console.log('selectedFeatures.on', selectedFeatures.getArray())
        const names = selectedFeatures.getArray().map(function (feature) {
          return feature.get('ECO_NAME')
        })
        if (names.length > 0) {
          this.selectPosition = names.join(', ')
        } else {
          this.selectPosition = 'None'
        }
      })
    }
  }
}
