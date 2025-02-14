<script setup lang="ts">
import { UUID } from '../account_management/ledger_state'
import AccountsTable from './AccountsTable.vue'
import { ref, Ref } from 'vue'
import AccountView from './AccountView.vue'

const currently_viewing: Ref<UUID | null> = ref(null)
</script>

<template>
  <div class="page">
    <div class="page-top-bar">
      <span class="header"> Accounts </span>
      <span v-if="currently_viewing != null" class="back-button" @click="currently_viewing = null">
        Back
      </span>
    </div>
    <AccountsTable v-if="currently_viewing == null" @open-account="(uuid: UUID) => (currently_viewing = uuid)" />
    <AccountView v-if="currently_viewing != null" :account_uuid="currently_viewing" />
  </div>
</template>
