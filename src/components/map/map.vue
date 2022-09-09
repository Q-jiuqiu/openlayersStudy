<!--
 * @Author: quling
 * @Date: 2022-02-16 17:29:26
 * @LastEditors: quling
 * @LastEditTime: 2022-09-09 15:36:59
 * @Description:
-->
<template>
  <!-- 地图容器 用来挂载显示地图 -->
  <div>
    <button @click="handleBtnBig">放大</button>
    <button @click="handleBtnSmall">缩小</button>
    <button @click="handleBaiduLayerAdd">加载百度地图</button>
    <div id="map"></div>
  </div>
</template>

<script>
// 包括Openlayers
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'

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
        // new TileLayer({
        //   // OSM地图 -- 瓦片地图:每次对地图进行缩放、拖拽等操作时都会重新获取瓦片数据
        //   source: new OSM()
        // })

        new TileLayer({
          source: new XYZ({
            // XYZ 加载瓦片数据源
            // Open Street Map -- OMS地图
            url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'

            // 高德地图 瓦片地图
            // url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'

            // Yahoo地图
          //   tileSize: 512, // 切片服务使用的切片大小
          //   url: 'https://{0-3}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?lg=ENG&ppi=250&token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B'

          })
        })
      ],
      // 初始化视图
      // 视图允许指定地图的中心点、缩放级别、分辨率、视图方向等
      view: new View({
        // 中心点 指定的是经度/纬度坐标  成都的坐标
        center: [103.37515728753266, 30.59996766676398],
        // 缩放级别
        zoom: 2
      })
    })
  },
  methods: {
    // 叠加百度地图
    handleBaiduLayerAdd () {
      console.log(this.map.getLayers().item(0))
      this.map.removeLayer(this.map.getLayers().item(0)) // 移除地图
      const BaiDuSource = new XYZ({
        tilePixelRatio: 2, // 瓦片像素比率 默认值是1,表示像素为是256*256  -> 2表示为:512*512
        // 用于获取给定平铺坐标和投影的平铺URL
        tileUrlFunction: function (tileCoord) {
          console.log(arguments)
          var z = tileCoord[0]
          var x = tileCoord[1]
          var y = tileCoord[2]

          // 计算当前层级下瓦片总数的一半，用于定位整个地图的中心点
          var halfTileNum = Math.pow(2, z - 1)
          // 原点移到中心点后，计算xy方向上新的坐标位置
          var baiduX = x - halfTileNum
          var baiduY = y + halfTileNum

          // 百度瓦片服务url将负数使用M前缀来标识
          if (baiduX < 0) {
            baiduX = 'M' + -baiduX
          }
          if (baiduY < 0) {
            baiduY = 'M' + -baiduY
          }

          // 返回经过转换后，对应于百度在线瓦片的url
          return (
            'http://online2.map.bdimg.com/onlinelabel/?qt=tile&x=' +
            baiduX +
            '&y=' +
            baiduY +
            '&z=' +
            z +
            '&styles=pl&udt=20160321&scaler=2&p=0'
          )
        }
      })
      const BaiDuLayer = new TileLayer({
        source: BaiDuSource
      })
      this.map.addLayer(BaiDuLayer)
    },
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
      // 获取视图
      const view = this.map.getView()
      // 获取缩放级别
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
