<script setup lang="ts">
import { Ref, ref, toRaw } from 'vue';
import Modal from '../Modal.vue';
import { Account, accounts, get_account, new_account, save_ledger, UUID } from '../account_management/ledger_state';
import Error from '../Error.vue';

const props = defineProps<{
  buttonIcon: string,
  accountUuid?: UUID
}>();

const active = defineModel<boolean>('active', { default: false });

let account: Account | undefined = undefined;
if (props.accountUuid != undefined) {
  account = get_account(props.accountUuid);
}

let name: Ref<string> = ref(account?.name ?? "");
let description: Ref<string> = ref(account?.description ?? "");

const error_message = ref("");

// This function exits the modal and not the add button because if something
// goes wrong, I don't want to exit the modal
function finish() {
  if (name.value == "") {
    error_message.value = "Missing account name";
    return;
  }

  // Check if this modal is supposed to edit an account or make a new one
  if (props.accountUuid == undefined) {
    new_account(name.value, description.value);
    // Clear the fields
    name.value = "";
    description.value = "";
  } else if (account != undefined) {
    // If the description field is blank, we want to store it as undefined
    // in the Account object
    const proc_description = description.value.trim() == "" ?
      undefined : description.value.trim();
    accounts.value.set(props.accountUuid, {
      name: name.value.trim(),
      description: proc_description,
      balance: account.balance,
      transactions: toRaw(account.transactions),
      creation_timestamp: account.creation_timestamp
    });
    save_ledger();
  } else {
    error_message.value = "Could not find account to edit";
  }

  active.value = false;
}
</script>

<template>
  <span class="material-symbols-outlined clickable" @click="active = true">
    {{ buttonIcon }}
  </span>
  <Modal :active="active">
    <span class="input-label">Name:</span>
    <input type="text" v-model="name" />
    <br>

    <span class="input-label">Description:</span>
    <input type="text" v-model="description" />

    <Error v-if="error_message != ''">{{ error_message }}</Error>
    <div class="spacing" v-if="error_message == ''"></div>
    <div class="page-top-bar">
      <span class="clickable" @click="finish()">
        {{ accountUuid == undefined ? "Add" : "Save" }}
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

input {
  @extend .information;
  background-color: var(--input-background);
  width: 60%;
  border: unset;
  font-size: inherit;

  &:focus-visible {
    outline: unset;
  }
}

span.clickable:not(.material-symbols-outlined) {
  font-size: 1.25em;
}

.input-label {
  margin-inline-end: 0.5em;
}

.spacing {
  height: 1em;
}
</style>
