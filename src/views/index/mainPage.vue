<template>
  <div>
    <div class="buttonGroup">
      <button @click="showType=0">无障碍地图</button>
      <button @click="showType=1">高级MapBox矢量图</button>
    </div>
    <my-map v-if="showType===0"></my-map>
    <map-box v-if="showType===1"></map-box>
  </div>
</template>

<script>
import myMap from '../../components/map'
import mapBox from '../../components/mapMapBox'
export default {
  components: {
    myMap,
    mapBox
  },
  data () {
    return {
      showType: 0
    }
  }
}
</script>

<style>
</style>
