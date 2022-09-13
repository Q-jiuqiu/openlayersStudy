/*
 * @Author: quling
 * @Date: 2022-09-13 10:20:33
 * @LastEditors: quling
 * @LastEditTime: 2022-09-13 10:52:58
 * @Description:
 */
import CartoDB from 'ol/source/CartoDB'
import TileLayer from 'ol/layer/Tile'

export default {
  data () {
    return {
      mapConfig: {
        'layers': [
          {
            'type': 'cartodb',
            'options': {
              'cartocss_version': '2.1.1',
              'cartocss': '#layer { polygon-fill: #F00; }'
            }
          }
        ]
      }
    }
  },
  methods: {
    handleSelectChange ({ value }) {
      console.log(value)
      this.setArea(value)
      const cartoDBSource = new CartoDB({
        account: 'documentation',
        config: this.mapConfig
      })
      cartoDBSource.setConfig(this.mapConfig)
      const tile = new TileLayer({
        source: cartoDBSource
      })
      this.addLayer(tile)
      const view = this.map.getView()
      view.setCenter([8500000, 8500000])
      view.setZoom(2)
    },
    setArea (n) {
      this.mapConfig.layers[0].options.sql = 'select * from european_countries_e where area > ' + n
    }
  }
}
