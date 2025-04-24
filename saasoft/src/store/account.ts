import { defineStore } from 'pinia'
import type { Account } from '../types'

interface AccountState {
  hasUnsavedAccounts: boolean
  accounts: Account[]
}

const STORAGE_KEY = 'accounts'

export const useAccountStore = defineStore('account', {
  state: (): AccountState => ({
    hasUnsavedAccounts: false, // Для управления состоянием кнопки добавления аккаунта
    accounts: []
  }),
  actions: {
    init() {
      const storage = localStorage.getItem(STORAGE_KEY)
      if (storage) {
        this.accounts = JSON.parse(storage)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
        this.accounts = []
      }
    },
    addAccount() {
      this.accounts.push({
        id: crypto.randomUUID(),
        login: '',
        password: '',
        type: 'local',
        tags: []
      })
      this.hasUnsavedAccounts = true
    },
    saveAccount(index: number) {
      const savedAccountsString = localStorage.getItem(STORAGE_KEY)

      if (savedAccountsString) {
        const savedAccounts = JSON.parse(savedAccountsString)
        savedAccounts[index] = this.accounts[index]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAccounts))
      }

      this.hasUnsavedAccounts = false
    },
    deleteAccount(index: number) {
      if (this.accounts.length === index + 1) {
        this.accounts.pop()
        this.hasUnsavedAccounts = false
        return
      }

      const savedAccountsString = localStorage.getItem(STORAGE_KEY)

      if (savedAccountsString) {
        const savedAccounts = JSON.parse(savedAccountsString)
        savedAccounts.splice(index, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAccounts))
      }

      this.accounts.splice(index, 1)
    }
  }
})
