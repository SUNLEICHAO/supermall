<template>
  <div id="detail">
    <!-- 详情页{{ iid }} -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- <div>
        <ul>
          <li v-for="item in $store.state.cartList" :key="item.index">
            {{ item }}
          </li>
        </ul>
      </div> -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />

    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "../../network/detail";
import { itemListenerMixin, backTopMixin } from "common/mixin";
import { debounce } from "@/common/utils";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopYs: [],
      getThemeTopY: null,
      message: "",
      show: false,
    };
  },
  created() {
    // 1 保存传入的iid
    this.iid = this.$route.params.iid;

    // 2 根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1 获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3 创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5 获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6 评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // created不行：压根不能获取元素
      // mounted也不行，数据还没有获取到

      // 1 第一次获取，值不对
      // 原因：this.$ref.params.$el压根没有渲染
      // this.themeTopYs = [];

      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      // console.log(this.themeTopYs);

      // 渲染结束后调用该函数
      this.$nextTick(() => {
        // 2 第二次获取 ：值不对
        // 原因：图片没有计算在内
        // 根据最新的数据，对应的DOM已经被渲染出来
        // 但是图片依然没有加载完（目前获取到的offsetTop不会包含其中的图片）
        // offsteTop值不对的时候，都是因为图片的问题
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);
      });
    });

    // 3 请求推荐数据
    getRecommend().then((res) => {
      // console.log(res.data.list);
      this.recommend = res.data.list;
    });

    // 4 给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      // 图片加载完，可以获取到正确的高度
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      // console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {
    // 该部分内容由混入代码替代
  },
  updated() {},
  destroyed() {
    // console.log('会捏');
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      // console.log("刷新");
      // console.log(this.$refs.scroll.refresh());
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
      // console.log(this.themeTopYs[index]);
    },
    contentScroll(position) {
      // 1 获取y值
      const positionY = -position.y;

      // 2 positionY和主题中值进行对比
      // [0, 7938, 9120, 9452]
      //
      // positionY 在 0 和 7938 之间，index = 0
      // positionY 在 =7938 和 9120 之间，index = 1
      // positionY 在 =9120 和 9452 之间，index = 2

      // positionY 超过或等于9452，index = 3

      // 根据positionY与的关系，设定index=0/1/2/3
      // console.log(positionY);
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // if (
        //   positionY > this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[i + 1]
        // ) {
        //   console.log(i);
        // }

        // if (
        //   // 先判断当前的i是否和改变的一致
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // )

        // hack做法
        // 数组末尾增添一个最大值，可直接进行判断，遍历长度-1，判断长度减少，有利于性能
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 3 是否显示“回到顶部”
      // this.isShowBackTop = -position.y > 1000;
      // 抽不出去，利用mixin中的demo运行该功能
      this.listenShoBackTop(position);
    },
    addToCart() {
      // 1 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      console.log(product);

      // 2 购物车需要保存(1 Promise 2 mapActions)
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      // #1 常规调用
      // this.$store.dispatch('addCart',product).then(res=>{
      //   // 3 提示———添加到购物车成功
      //   console.log(res);
      // })

      // #2 映射到这里再调用
      this.addCart(product).then((res) => {
        // this.show = true;
        // this.message = res;
        // // console.log(res);
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);

        this.$toast.show()
        // console.log(this.$toast);
      });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 56px);
}
</style>