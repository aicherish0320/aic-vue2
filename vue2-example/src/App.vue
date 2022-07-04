<template>
  <div>
    <!-- <ClickOutside></ClickOutside> -->
    <Lazy></Lazy>
  </div>
</template>

<script>
import ClickOutside from '@/components/ClickOutside.vue'
import Lazy from './components/Lazy.vue'
export default {
  name: 'App',
  components: { ClickOutside, Lazy }
}
</script>

<style lang="scss" scoped></style>
