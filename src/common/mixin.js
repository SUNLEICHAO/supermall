import { debounce } from "@/common/utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
    }
  },
  mounted() {
    const newRefresh = debounce(this.$refs.scroll.refresh, 100);

    // 对监听的事件进行保存
    this.itemImageListener = () => {
      // 不借助防抖
      // this.$refs.scroll.refresh();
      // console.log("-----");
      // 借助防抖函数
      newRefresh();
    };

    // 监听item图片加载完成
    this.$bus.$on("itemImaLoad", this.itemImageListener);
  }
}

// 详情页运用了，首页没运用
export const backTopMixin = {
  components: {
    BackTop,
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 750);
    },
    listenShoBackTop(position) {
      this.isShowBackTop = -position.y > 1000;
    }
  }
}