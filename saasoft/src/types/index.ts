export type AccountType = 'local' | 'LDAP'

export interface AccountTag {
  text: string
}

export interface Account {
  id: string
  login: string
  password: string | null
  type: AccountType
  tags: AccountTag[]
}

export interface AccountState {
  valid: boolean
  accounts: Account[]
}

export interface AccountValidationErrors {
  tags: string[]
  login: string[]
  password: string[]
}

export interface AccountTypeOption {
  label: string
  value: AccountType
}
