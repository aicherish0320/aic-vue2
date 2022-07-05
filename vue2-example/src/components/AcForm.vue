<template>
  <form @submit.prevent>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'AcForm'
}
</script>

<style lang="scss" scoped></style>
