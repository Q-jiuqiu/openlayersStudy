/*
 * @Author: quling
 * @Date: 2022-09-11 11:15:28
 * @LastEditors: quling
 * @LastEditTime: 2022-09-11 19:54:08
 * @Description: 高级视口定位
 */

import EsriJSON from 'ol/format/EsriJSON'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Fill, Stroke, Style } from 'ol/style'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { createXYZ } from 'ol/tilegrid'
// import { fromLonLat } from 'ol/proj'
import { tile as tileStrategy } from 'ol/loadingstrategy'
import $ from 'jquery'

export default {
  data () {
    return {
    }
  },
  methods: {
    addArcGisRESTFeatureService () {
      const serviceUrl =
        'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/' +
        'Petroleum/KSFields/FeatureServer/'
      const layer = '0'
      const esrijsonFormat = new EsriJSON()

      const styleCache = {
        'ABANDONED': new Style({
          fill: new Fill({
            color: 'rgba(225, 225, 225, 255)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 255)',
            width: 0.4
          })
        }),
        'GAS': new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 255)'
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0.4
          })
        }),
        'OIL': new Style({
          fill: new Fill({
            color: 'rgba(56, 168, 0, 255)'
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0
          })
        }),
        'OILGAS': new Style({
          fill: new Fill({
            color: 'rgba(168, 112, 0, 255)'
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0.4
          })

        })
      }

      const vectorSource = new VectorSource({
        // 用于从远程源加载功能的加载函数。如果未设置此项，并且设置了url，则源将创建并使用XHR功能加载程序
        loader: function (extent, resolution, projection, success, failure) {
          console.log(arguments)
          const url = serviceUrl + layer + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":102100}}'
            ) +
            '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
            '&outSR=102100'
          $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function (response) {
              if (response.error) {
                alert(
                  response.error.message + '\n' + response.error.details.join('\n')
                )
                failure()
              } else {
                // dataProjection will be read from document
                const features = esrijsonFormat.readFeatures(response, {
                  featureProjection: projection
                })
                if (features.length > 0) {
                  vectorSource.addFeatures(features)
                }
                success(features)
              }
            },
            error: failure
          })
        },
        strategy: tileStrategy(
          createXYZ({
            tileSize: 512
          })
        )
      })

      const vector = new VectorLayer({
        source: vectorSource,
        style: function (feature) {
          const classify = feature.get('activeprod')
          return styleCache[classify]
        }
      })

      const raster = new TileLayer({
        source: new XYZ({
          attributions:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
      })

      this.map.addLayer(raster)
      this.map.addLayer(vector)
    }
  }
}
