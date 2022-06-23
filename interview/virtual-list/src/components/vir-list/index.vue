<template>
  <div
    class="vir-container"
    :style="{ height: containerHeight }"
    ref="virContainerRef"
    @scroll="onContainerScroll"
  >
    <section class="scroll-bar" :style="{ height: contentHeight }"></section>
    <section class="content" :style="{ transform: contentTranslateY }">
      <VirItem
        v-for="list in remainLists"
        :key="list.id"
        :list="list"
      ></VirItem>
    </section>
  </div>
</template>

<script>
import VirItem from './VirItem.vue'
export default {
  name: 'VirList',
  props: ['size', 'remain', 'data'],
  components: {
    VirItem
  },
  data() {
    return {
      start: 0,
      end: this.remain
    }
  },
  computed: {
    containerHeight() {
      return this.size * this.remain + 'px'
    },
    contentHeight() {
      return this.size * this.data.length + 'px'
    },
    remainLists() {
      return this.data.slice(this.start, this.end)
    },
    contentTranslateY() {
      return `translateY(${this.start * this.size}px)`
    }
  },
  methods: {
    onContainerScroll(e) {
      const scrollSize = Math.floor(e.target.scrollTop / this.size)
      this.start = scrollSize
      this.end = this.start + this.remain
    }
  }
}
</script>

<style lang="scss" scoped>
.vir-container {
  overflow-y: auto;
  position: relative;
  background: rgb(216, 246, 187);
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
