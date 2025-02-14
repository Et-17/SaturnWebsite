<script setup lang="ts">
defineProps<{
  active: boolean
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="active" class="modal-backdrop">
      <div class="modal">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  width: fit-content;
  height: fit-content;
  padding: var(--outer-gutter);
  position: fixed;
  margin: auto;
  inset: 0;
  background-color: var(--palette-background);
}

.modal-backdrop {
  position: fixed;
  margin: auto;
  background-color: #00000090;
  inset: 0;
}
</style>
