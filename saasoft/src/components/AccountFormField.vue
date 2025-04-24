<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, InputText, Select } from 'primevue'
import { InputTag } from './input-tag'
import { useAccountStore } from '../store'
import { useAccountValidation } from '../composables/useAccountValidation'
import type { Account, AccountType, AccountTag, AccountTypeOption } from '../types'

const accountStore = useAccountStore()

const { account, index } = defineProps<{
  index: number
  account: Account
}>()

const { validationErrors, validate } = useAccountValidation()

const accountRecordProxy = ref<Account>({ ...account })

const accountTypes = ref<AccountTypeOption[]>([
  { label: 'Локальный', value: 'local' },
  { label: 'LDAP', value: 'LDAP' }
])

const handleValidate = () => {
  const isValid = validate(accountRecordProxy.value)
  if (isValid) {
    accountStore.accounts[index] = accountRecordProxy.value
    accountStore.saveAccount(index)
  }
}

const onAccountTypeChange = ({ value }: { value: AccountType }) => {
  if (value === 'LDAP') {
    accountRecordProxy.value.password = null
  } else {
    accountRecordProxy.value.password = account.password
  }
  handleValidate()
}

const accountTags = computed({
  get() {
    return accountRecordProxy.value.tags.map((tag: AccountTag) => tag.text)
  },
  set(value: string[]) {
    accountRecordProxy.value.tags = value.map((tag: string) => ({ text: tag }))
  }
})
</script>

<template>
  <div class="account-form-field">
    <div style="display: flex; gap: 1rem">
      <InputTag
        v-model="accountTags"
        placeholder="Метки"
        :invalid="!!validationErrors.tags.length"
        @change="handleValidate()"
      />
      <Select
        v-model="accountRecordProxy.type"
        :options="accountTypes"
        option-label="label"
        option-value="value"
        placeholder="Выберите тип аккаунта"
        @change="onAccountTypeChange"
        :pt="{
          root: {
            style: {
              height: '48px'
            }
          },
          label: {
            style: {
              width: '150px',
              textAlign: 'start'
            }
          }
        }"
      ></Select>
      <InputText
        v-model="accountRecordProxy.login"
        placeholder="Login"
        :invalid="!!validationErrors.login.length"
        @blur="handleValidate"
        style="height: 48px"
      />
      <InputText
        v-if="accountRecordProxy.type === 'local'"
        v-model="accountRecordProxy.password"
        type="password"
        placeholder="Password"
        :invalid="!!validationErrors.password.length"
        @blur="handleValidate"
        style="height: 48px"
      />
      <div
        v-else
        style="width: 192px"
      ></div>
      <Button
        icon="pi pi-trash"
        severity="danger"
        size="small"
        @click="accountStore.deleteAccount(index)"
        style="width: 3rem; height: 3rem"
      />
    </div>
  </div>
</template>

<style>
.p-inputtext {
  width: 192px;
  max-width: 192px;
}
</style>
