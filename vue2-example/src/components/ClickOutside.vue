<template>
  <div class="container" v-click-outside="handleBlur">
    <input type="text" @focus="handleFocus" />
    <div class="box" v-show="isShow">面板</div>
  </div>
</template>

<script>
export default {
  name: 'ClickOutside',
  data() {
    return {
      isShow: false
    }
  },
  directives: {
    clickOutside: {
      bind(el, dirs, vNode) {
        const handler = (e) => {
          if (!el.contains(e.target)) {
            vNode.context[dirs.expression]()
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  },
  methods: {
    handleFocus() {
      this.isShow = true
    },
    handleBlur() {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: cyan;
  display: inline-flex;
  flex-direction: column;
}
.box {
  width: 150px;
  height: 100px;
  border: 1px solid red;
}
</style>
