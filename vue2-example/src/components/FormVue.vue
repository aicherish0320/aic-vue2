<template>
  <AcForm :model="ruleForm" :rules="rules" ref="ruleFormRef">
    <h1>{{ ruleForm.username }}</h1>
    <AcFormItem label="用户名" prop="username">
      <AcInput v-model="ruleForm.username"></AcInput>
    </AcFormItem>
    <AcFormItem label="密码" prop="password">
      <AcInput v-model="ruleForm.password"></AcInput>
    </AcFormItem>
    <AcFormItem>
      <button @click="submitForm">提交</button>
    </AcFormItem>
  </AcForm>
</template>

<script>
import AcForm from './AcForm.vue'
import AcFormItem from './AcFormItem.vue'
import AcInput from './AcInput.vue'
export default {
  name: 'FormVue',
  components: {
    AcForm,
    AcFormItem,
    AcInput
  },
  data() {
    return {
      ruleForm: {
        username: 'jack',
        password: '123'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleFormRef.validate((valid) => {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
