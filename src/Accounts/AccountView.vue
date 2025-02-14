<script setup lang="ts">
import { format_currency } from '../readout_formatting/money';
import { format_date } from '../readout_formatting/date';
import { UUID, get_transaction, get_account, get_counterparty } from '../account_management/ledger_state';
import { computed } from 'vue';
import TransactionModal from '../TransactionModal.vue';
import DeleteTransactionModal from '../DeleteModals/DeleteTransactionModal.vue';
import ExportTransactions from '../ExportTransactions.vue';

const props = defineProps<{
  account_uuid: UUID;
}>();

const account = computed(() => get_account(props.account_uuid))
</script>

<template>
  <span class="information-header">Account: </span>
  <span class="information">{{ account.name }}</span>
  <br>
  <span class="information-header">Balance: </span>
  <span class="information">{{ format_currency(account.balance) }}</span>
  <br>
  <span class="information-header">Created: </span>
  <span class="information">{{ format_date(account.creation_timestamp) }}</span>
  <br>
  <span class="information-header">Description: </span>
  <span class="information">{{ account.description ?? "None" }}</span>
  <table id="account-view-transaction-table">
    <thead>
      <tr>
        <th scope="col">Counterparty</th>
        <th scope="col">Amount</th>
        <th scope="col">Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="account != null" v-for="transaction of account.transactions">
        <td>{{ get_counterparty(get_transaction(transaction).counterparty_id).name }}</td>
        <td class="align-right">{{ format_currency(get_transaction(transaction).amount) }}</td>
        <td>{{ format_date(get_transaction(transaction).timestamp) }}</td>
        <td>
          <TransactionModal button-icon="edit" :transaction-uuid="transaction" />
        </td>
        <td>
          <DeleteTransactionModal button-icon="delete" :transaction-uuid="transaction" />
        </td>
      </tr>
      <tr>
        <td>
          <TransactionModal button-icon="add" :initial-account-uuid="account_uuid" />
        </td>
        <td v-for="_ in 3"></td>
        <td>
          <ExportTransactions button-icon="download" :transactions="account.transactions" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
#account-view {
  max-width: fit-content;
  margin-top: var(--outer-gutter);
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}

#account-view-transaction-table {
  margin-top: 1.5em;
}
</style>
