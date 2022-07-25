<template>
  <div class="recommand">
    <div v-for="item in recommends" :key="item.index" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="" />
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    recommends: {
      type: Array,
      default() {},
    },
  },
};
</script>

<style scoped>
.recommand {
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 12px;

  padding: 10px 0px 20px;
  border-bottom: 10px #eee solid;
}
.recommend-item {
  /* width: 25%; */
  flex: 1;
}
.recommend-item img {
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}
</style>