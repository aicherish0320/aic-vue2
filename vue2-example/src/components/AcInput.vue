<template>
  <input type="text" v-model="computedValue" />
</template>

<script>
export default {
  name: 'AcFormInput',
  // model: {
  //   prop: 'abc',
  //   event: 'change'
  // }
  props: {
    value: String
  },
  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}

// 组件的 v-model 和 元素的 v-model 区别是？
// v-model 指令 + 事件
// v-model => :value @input 在输入中文的时候，v-model 做了处理

// el.addEventListener('compositionstart', onCompositionStart)
// e.target.composing

// .sync
// a.sync => update:a
</script>

<style lang="scss" scoped></style>
