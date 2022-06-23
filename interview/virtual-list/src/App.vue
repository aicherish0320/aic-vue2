<template>
  <div id="app">
    <VirList :size="40" :remain="8" :data="lists"></VirList>
  </div>
</template>

<script>
const lists = []
for (let i = 0; i < 1000; i++) {
  lists.push({
    id: i,
    value: i
  })
}

import VirList from './components/vir-list/index.vue'
export default {
  name: 'App',
  components: { VirList },
  data() {
    return {
      lists
    }
  }
}
</script>

<style lang="scss"></style>
