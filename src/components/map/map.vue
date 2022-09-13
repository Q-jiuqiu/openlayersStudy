<!--
 * @Author: quling
 * @Date: 2022-02-16 17:29:26
 * @LastEditors: quling
 * @LastEditTime: 2022-09-13 10:33:48
 * @Description:
-->
<template>
  <!-- 地图容器 用来挂载显示地图 -->
  <div>
    <button @click="handleBtnBig">放大</button>
    <button @click="handleBtnSmall">缩小</button>
    <button @click="handleBaiduLayerAdd">加载百度地图</button>
    <button @click="handleBaiduLayerAdd2">加载百度地图--分辨率</button>
    <button @click="addGeoJSON">叠加geojson</button>
    <button  @click="zoomToGeoJSON">定位到geojson的第一个feature--锦江区</button>
    <button @click="addArcGisRESTFeatureService">叠加ArcGis服务</button>
    <button @click="boxSelection">给GeoJSON增加选择事件</button>
    <p>现在选中的是：{{selectPosition}}</p>
    <button @click="CanvasTile">CanvasTile</button>
    <div>
      <button @click="addLayer">添加图层</button>
      Show european countries larger than <Select @on-select='handleSelectChange' style="width:200px">
        <Option value="0">0</Option>
        <Option value="5000">5000</Option>
        <Option value="10000">10000</Option>
        <Option value="15000">15000</Option>
        <Option value="100000">100000</Option>
      </Select>
      km<sup>2</sup>
    </div>
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
import TileImage from 'ol/source/TileImage'
import TileGrid from 'ol/tilegrid/TileGrid'
import { transform, addProjection, addCoordinateTransforms } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import AdvanceViewPosition from './utils/AdvanceViewPosition'
import addArcGisRESTFeatureService from './utils/addArcGisRESTFeatureService'
import BoxSelection from './utils/BoxSelection'
import CanvasTile from './utils/CanvasTiles'
import CartoDBSource from './utils/CartoDBSource'

export default {
  mixins: [AdvanceViewPosition, addArcGisRESTFeatureService, BoxSelection, CanvasTile, CartoDBSource],
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
        // 中心点 指定的是经度/纬度坐标  成都的坐标  transform坐标转换,将4326坐标系的坐标[104.06, 30.67]转成3857坐标系里的坐标
        center: transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'),
        // 缩放级别
        zoom: 10,
        // 视口边距
        padding: [170, 50, 30, 150]
      })
    })
  },
  methods: {
    // 添加图层
    addLayer (layers) {
      this.map.addLayer(layers)
    },
    // 叠加百度地图 -- 分辨率
    handleBaiduLayerAdd2 () {
      const projBD09 = new Projection({
        code: 'BD:09',
        extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],
        units: 'm',
        axisOrientation: 'neu',
        global: false
      })

      addProjection(projBD09)
      addCoordinateTransforms('EPSG:4326', 'BD:09', function (coordinate) {
        console.log('1', arguments)
      }, function (coordinate) {
        console.log('2', arguments)
      }
      )

      this.map.setView({
        center: transform([113.03914, 28.20354], 'EPSG:4326', 'BD:09'),
        projection: 'BD:09'
      })

      // 自定义分辨率和瓦片坐标系
      const resolutions = []
      const maxZoom = 18

      // 计算百度使用的分辨率
      for (let i = 0; i <= maxZoom; i++) {
        resolutions[i] = Math.pow(2, maxZoom - i)
      }

      console.log(resolutions)

      const tilegrid = new TileGrid({
        origin: [0, 0], // 设置原点坐标
        resolutions: resolutions
      })

      this.map.removeLayer(this.map.getLayers().item(0)) // 移除地图
      const BaiDuSource = new TileImage({
        projection: 'BD:09', // 投影
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, tilePixelRatio, projection) {
          const z = tileCoord[0]
          let x = tileCoord[1]
          let y = tileCoord[2]

          // 百度瓦片服务url将负数使用M前缀来标识
          if (x < 0) {
            x = 'M' + (-x)
          }
          if (y < 0) {
            y = 'M' + (-y)
          }

          return `http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20160426&scaler=1&p=0`
        }
      })
      const BaiDuLayer = new TileLayer({
        source: BaiDuSource
      })
      this.map.addLayer(BaiDuLayer)
    },
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
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
