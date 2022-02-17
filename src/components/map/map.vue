<template>
  <!-- 地图容器 用来挂载显示地图 -->
  <div>
    <div id="map"></div>
    <button @click="handleBtnBig">放大</button>
    <button @click="handleBtnSmall">缩小</button>
  </div>
</template>

<script>
// 包括Openlayers
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
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
      // 绑定到容器 div#map
      target: 'map',
      // 数组 存放图层
      // 图层是用包含源的类型(图形、平铺或者矢量)来创建的。源是用于获取地图图块的协议
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      // 初始化视图
      // 视图允许指定地图的中心点、缩放级别、分辨率、视图方向等
      view: new View({
        // 中心点 指定的是经度/纬度坐标
        center: [0, 0],
        // 缩放级别
        zoom: 2
      })
    })
  },
  methods: {
    // 放大
    handleBtnBig () {
      const { view, zoom } = this.getMapZoom()
      view.setZoom(zoom + 1)
    },
    // 缩小
    handleBtnSmall () {
      const { view, zoom } = this.getMapZoom()
      view.setZoom(zoom - 1)
    },
    // 获取地图缩放级别
    getMapZoom () {
      const view = this.map.getView()
      const zoom = view.getZoom()
      return { view, zoom }
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  width: 500px;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
