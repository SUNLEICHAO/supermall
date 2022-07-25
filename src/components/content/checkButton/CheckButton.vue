<template>
  <div class="check-button" :class="{checked:isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
export default {
  props: {
    isChecked: {
      type:Boolean,
      default: true,
    }
  }

}
</script>

<style>
  .check-button{
    border-radius: 20%;
    border: 2px solid #aaa;
  }
  .checked {
    background-color: orange;
    border-color: red;
  }
</style>