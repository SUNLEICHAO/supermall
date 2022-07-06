<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper :banners="banners"></home-swiper>
    <recommend-view :recommends = "recommends"/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView.vue'

import { getHomeMultidata } from "../../network/home";

export default {
  components: {
		name: "Home",
    NavBar,
    HomeSwiper,
    RecommendView
  },
  data() {
      return {
        // result: null,
        banners: [],
        recommends: [],
      };
    },
  created() {
    // 1.(组件创建完了，然后发送网络请求)请求多个数据
    // （异步操作）
    getHomeMultidata().then((res) => {
      // console.log(res);
      // this.result = res;
      this.banners = res.data.banner.list;
      // console.log(666);
      this.recommends = res.data.recommend.list;
      console.log(res.data.recommend);
    });
  },
};
</script>

<style>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>