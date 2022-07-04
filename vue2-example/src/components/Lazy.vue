<template>
  <ul class="box">
    <li v-for="list in lists" :key="list.id">
      <!-- <img :src="list" alt="img" /> -->
      <img v-lazy="list" alt="img" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Lazy',
  data() {
    return {
      lists: []
    }
  },
  mounted() {
    fetch('http://localhost:3001/list')
      .then((res) => res.json())
      .then((data) => {
        this.lists = data
      })
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 400px;
  height: 400px;
  overflow-y: scroll;
  img {
    width: 100px;
  }
}
</style>
