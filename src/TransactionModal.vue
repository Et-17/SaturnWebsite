<script setup lang="ts">
import { Ref, ref } from 'vue';
import Modal from './Modal.vue';
import { accounts, counterparties, get_transaction, new_transaction, recalc_account_balance, save_ledger, Transaction, transactions, UUID } from './account_management/ledger_state';
import Error from './Error.vue';

const props = defineProps<{
  buttonIcon: string
  transactionUuid?: UUID,
  initialAccountUuid?: UUID,
  initialCounterpartyUuid?: UUID
}>();

const active = defineModel<boolean>('active', { default: false });

let transaction: Transaction | undefined = undefined;
if (props.transactionUuid != undefined) {
  transaction = get_transaction(props.transactionUuid);
}

// This is the v-model for the account input. Essentially, this variable will
// reflect what the account input says: the user can change the input and we
// can change the variable programmaticaly to change the input. Here, we set
// the initial value to the account_id field of the given transaction if a
// transaction is specified. If it isn't, then we try to set it to the passed
// initial account value. If the user didn't specify that, then it will default
// to undefined, which makes the account dropdown to say "Select"
let account_id: Ref<UUID | undefined> = ref(transaction?.account_id ?? props.initialAccountUuid);
// Same thing for the counterparty id
let counterparty_id: Ref<UUID | undefined> = ref(transaction?.counterparty_id ?? props.initialCounterpartyUuid);
let amount: Ref<number> = ref(transaction?.amount ?? 0);

const error_message = ref("");

// This function exits the modal and not the add button because if something
// goes wrong, I don't want to exit the modal
function finish() {
  if (account_id.value == undefined) {
    error_message.value = "Missing account id";
    return;
  }
  if (counterparty_id.value == undefined) {
    error_message.value = "Missing counterparty id";
    return;
  }

  // Check if this modal is supposed to edit a transaction or make a new one
  if (props.transactionUuid == undefined) {
    new_transaction(account_id.value, counterparty_id.value, amount.value);
    // Clear the fields for the next addition
    account_id.value = props.initialAccountUuid;
    counterparty_id.value = props.initialCounterpartyUuid;
    amount.value = 0;
  } else if (transaction != undefined) {
    transactions.value.set(props.transactionUuid, {
      account_id: account_id.value,
      counterparty_id: counterparty_id.value,
      amount: amount.value,
      timestamp: transaction?.timestamp
    });
    recalc_account_balance(account_id.value);
    save_ledger();
  } else {
    error_message.value = "Could not find transaction to edit"
  }

  active.value = false;
}

</script>

<template>
  <span class="material-symbols-outlined clickable" @click="active = true">
    {{ buttonIcon }}
  </span>
  <Modal :active="active">
    <span class="input-label">Account: </span>
    <select name="account" id="account-dropdown" v-model="account_id">
      <option v-for="account in accounts" :value="account[0]" :key="account[0]">
        {{ account[1].name }}
      </option>
      <option :value="undefined">
        Select
      </option>
    </select>
    <br>

    <span class="input-label">Counterparty: </span>
    <select name="counterparty" id="counterparty-dropdown" v-model="counterparty_id">
      <option v-for="counterparty in counterparties" :value="counterparty[0]" :key="counterparty[0]">
        {{ counterparty[1].name }}
      </option>
      <option :value="undefined">
        Select
      </option>
    </select>
    <br>

    <span class="input-label">Amount: </span>
    <span class="unit">$</span>
    <input type="number" v-model="amount">
    <Error v-if="error_message != ''">{{ error_message }}</Error>
    <div class="spacing" v-if="error_message == ''"></div>
    <div class="page-top-bar">
      <span class="clickable" @click="finish()">
        {{ transactionUuid == undefined ? "Add" : "Save" }}
      </span>
      <span class="clickable" @click="active = false">
        Cancel
      </span>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
span:not(.material-symbols-outlined) {
  @extend .information-header;
  line-height: 200%;
}

select {
  @extend .information;
  background-color: var(--input-background);
  border: unset;
  font-size: inherit;

  &:focus-visible {
    outline: unset;
  }
}

input {
  @extend .information;
  width: 30%;
  border: unset;
  font-size: inherit;
  text-align: right;

  &:focus-visible {
    outline: unset;
  }
}

span.clickable:not(.material-symbols-outlined) {
  font-size: 1.25em;
}

.unit,
input {
  background-color: var(--input-background);
}

.input-label {
  // Fun fact: in printing press typography, one half of an "em space" is also 
  // called an "en space" or a "nut"
  margin-inline-end: 0.5em;
}

.spacing {
  height: 1em;
}
</style>
