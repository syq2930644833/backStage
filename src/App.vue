<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
export default {
  name: "App",
  created() {
    const { path } = this.$route
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      )
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })

    window.addEventListener("unload", () => {
      sessionStorage.clear()
      removeToken()
    })
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  padding: 0;
  margin: 0;
}
body{
  padding: 0;
  margin: 0;
}
</style>
