<script setup lang="ts">
import { format_date } from '../readout_formatting/date';
import { format_currency } from '../readout_formatting/money';
import { get_transaction, UUID, get_counterparty, get_account } from '../account_management/ledger_state';
import { computed } from 'vue';
import TransactionModal from '../TransactionModal.vue';
import DeleteTransactionModal from '../DeleteModals/DeleteTransactionModal.vue';
import ExportTransactions from '../ExportTransactions.vue';

const props = defineProps<{
  counterparty_uuid: UUID;
}>();

const counterparty = computed(() => get_counterparty(props.counterparty_uuid));
</script>

<template>
  <span class="information-header">Counterparty: </span>
  <span class="information">{{ counterparty.name }}</span>
  <br>
  <span class="information-header">Description: </span>
  <span class="information">{{ counterparty.description ?? "None" }}</span>
  <br>
  <table id="counterparty-view-transaction-table">
    <thead>
      <tr>
        <th scope="col">Account</th>
        <th scope="col">Amount</th>
        <th scope="col">Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction of counterparty.transactions">
        <td>{{ get_account(get_transaction(transaction).account_id).name }}</td>
        <td class="align-right">{{ format_currency(get_transaction(transaction).amount) }}</td>
        <td>{{ format_date(get_transaction(transaction).timestamp) }}</td>
        <td>
          <TransactionModal button-icon="edit" :transactionUuid="transaction" />
        </td>
        <td>
          <DeleteTransactionModal button-icon="delete" :transaction-uuid="transaction" />
        </td>
      </tr>
      <tr>
        <td>
          <TransactionModal button-icon="add" :initialCounterpartyUuid="counterparty_uuid" />
        </td>
        <td v-for="_ in 3"></td>
        <td>
          <ExportTransactions button-icon="download" :transactions="counterparty.transactions" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  margin-top: 1.5em;
}
</style>
