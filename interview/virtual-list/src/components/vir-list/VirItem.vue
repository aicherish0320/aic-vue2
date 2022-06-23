<template>
  <div class="vir-item">{{ list.value }}</div>
</template>

<script>
export default {
  name: 'VirItem',
  props: ['list']
}
</script>

<style lang="scss" scoped>
.vir-item {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 2px solid #ccc;
}
</style>
