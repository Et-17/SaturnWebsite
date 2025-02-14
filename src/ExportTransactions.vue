<script setup lang="ts">
import { export_transactions, get_account, get_counterparty, get_transaction, UUID } from './account_management/ledger_state';

const props = defineProps<{
  buttonIcon: string,
  transactions: UUID[]
}>();

function format_transaction(id: UUID): string[] {
  const transaction = get_transaction(id);
  return [
    get_account(transaction.account_id).name,           // Account
    get_counterparty(transaction.counterparty_id).name, // Counterparty
    transaction.amount.toString(),                      // Amount
    transaction.timestamp.toISOString()                 // Date/Time
  ]
}

async function format_transactions(ids: UUID[]): Promise<string[][]> {
  return ids.map(format_transaction);
}

async function export_transactions_button() {
  export_transactions(await format_transactions(props.transactions));
}

</script>

<template>
  <span class="material-symbols-outlined clickable" @click="export_transactions_button">
    {{ buttonIcon }}
  </span>
</template>