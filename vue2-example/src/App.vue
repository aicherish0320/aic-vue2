<template>
  <div>
    <!-- <ClickOutside></ClickOutside> -->
    <!-- <Lazy></Lazy> -->
    <FormVue></FormVue>
  </div>
</template>

<script>
import ClickOutside from '@/components/ClickOutside.vue'
import Lazy from './components/Lazy.vue'
import FormVue from './components/FormVue.vue'
export default {
  name: 'App',
  components: { ClickOutside, Lazy, FormVue }
}
</script>

<style lang="scss" scoped></style>
