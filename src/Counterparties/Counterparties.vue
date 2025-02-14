<script setup lang="ts">
import { UUID } from '../account_management/ledger_state'
import { Ref, ref } from 'vue'
import CounterpartiesTable from './CounterpartiesTable.vue'
import CounterpartyView from './CounterpartyView.vue'

const currently_viewing: Ref<UUID | null> = ref(null)
</script>

<template>
  <div class="page">
    <div class="page-top-bar">
      <span class="header"> Counterparties </span>
      <span v-if="currently_viewing != null" class="back-button" @click="currently_viewing = null">
        Back
      </span>
    </div>
    <CounterpartiesTable v-if="currently_viewing == null"
      @open-counterparty="(uuid: UUID) => (currently_viewing = uuid)" />
    <CounterpartyView v-if="currently_viewing != null" :counterparty_uuid="currently_viewing" />
  </div>
</template>
