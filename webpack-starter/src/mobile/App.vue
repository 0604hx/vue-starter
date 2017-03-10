<template>
  <div id="template">
    <div class="clock">{{dt}}</div>
    <div>这是手机版入口的示例，默认不加入router，通常用于单页面展示用。更新于 2017年3月10日14:53:02<div>
  </div>
</template>
<style>
  .clock {text-align:center; color:#2f2;font-size:4rem;}
</style>
<script>
  import moment from 'moment-min'

  export default {
    data () {
      return {
        dt:""
      }
    },
    computed: {
    },
    created (){
      console.log("created , start clock interval...")
      setInterval(this.tick, 1000)
    },
    methods :{
      tick (){
        this.dt = moment().format("YYYY-MM-DD HH:mm:ss")
      }
    }
  }
</script>

<style>
html {
  height: 100%;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
