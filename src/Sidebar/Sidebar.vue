<script setup lang="ts">
import { load_example_ledger } from '../account_management/ledger_state';
import SidebarButton from './SidebarButton.vue';
import { ref } from 'vue';

const current_page = defineModel<string>('current');

defineEmits<{
  switchPage: [newPage: string]
}>();

// This stores the buttons in the format of [event code, text]
const buttons: [string, string][] = [
  ["recent-transactions", "home"],
  ["accounts", "account_balance"],
  ["counterparties", "storefront"]
];

const help_selected = ref(false);
function open_readme() {
  help_selected.value = true;
  window.location.href = 'https://github.com/Et-17/SaturnWebsite';
}
</script>

<template>
  <div id="sidebar">
    <template v-for="button in buttons">
      <SidebarButton @click="current_page = button[0]" :icon-name="button[1]" :selected="button[0] == current_page" />
    </template>
    <SidebarButton @click="open_readme" icon-name="help_center" :selected="help_selected" />
    <span class="clickable ibm-plex-serif" @click="load_example_ledger">
      Open example ledger
    </span>
  </div>
</template>

<style lang="scss" scoped>
#sidebar {
  position: fixed;
  inset-block-start: var(--outer-gutter);
  inset-inline-start: var(--outer-gutter);
  inset-block-end: var(--outer-gutter);
}

#sidebar span {
  position: fixed;
  inset-block-end: var(--outer-gutter);
}
</style>
