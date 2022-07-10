<template>
  <div class="goods">
    <goods-list-item
      v-for="item in goods"
      :key="item.index"
      :goods-item="item"
    />
    <!-- {{goods}} -->
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";
export default {
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style>
.goods {
  display: flex;
  /* 设置自动换行 */
  flex-wrap: wrap;
  justify-content: space-around;

  padding: 2px;
}

</style>