/*
 * @Author: quling
 * @Date: 2022-09-12 16:06:15
 * @LastEditors: quling
 * @LastEditTime: 2022-09-12 16:15:31
 * @Description: 瓦片服务加载--canvas
 */
import TileLayer from 'ol/layer/Tile'
import TileDebug from 'ol/source/TileDebug'

export default {
  data () {
    return {}
  },

  methods: {
    CanvasTile () {
      console.log('CanvasTile')
      const layer = new TileLayer({
        // 伪瓦片数据源,不会从服务器上获取瓦片,而是呈现瓦片网格/投影的网格轮廓以及每个瓦片的坐标
        source: new TileDebug()
      })
      this.map.addLayer(layer)
    }
  }
}
