<script setup lang="ts">
import { ref } from 'vue';
import { delete_account, UUID } from '../account_management/ledger_state';
import Modal from '../Modal.vue';
import Error from '../Error.vue';

const active = defineModel<boolean>('active', { default: false });

const props = defineProps<{
  buttonIcon: string
  accountUuid: UUID
}>();

const error_message = ref("");

function remove() {
  delete_account(props.accountUuid)
    .catch(() => error_message.value = "Error deleting account")
    .then(() => active.value = false)
}
</script>

<template>
  <span class="material-symbols-outlined clickable" @click="active = true">
    {{ buttonIcon }}
  </span>
  <Modal :active=active>
    <div>
      Are you <strong>sure</strong> that you want to delete this account? <br>
      All transactions associated with it will be deleted as well.
    </div>
    <Error v-if="error_message != ''">{{ error_message }}</Error>
    <div class="spacing" v-if="error_message == ''"></div>
    <div class="page-top-bar">
      <span class="clickable" @click="remove">
        Delete
      </span>
      <span class="clickable" @click="active = false">
        Cancel
      </span>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
div:not(.material-symbols-outlined) {
  @extend .information-header;
  line-height: 125%;
}

span.clickable:not(.material-symbols-outlined) {
  font-size: 1.25em;
}

strong {
  font-style: italic;
}

.spacing {
  height: 1em;
}
</style>
