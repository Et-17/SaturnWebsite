<script setup lang="ts">
defineProps<{
  iconName: string,
  selected: boolean
}>();
</script>

<template>
  <div>
    <span class="material-symbols-outlined" :class="{ 'selected': selected }">
      {{ iconName }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
$icon-size: 2em;
$transition-speed: 0.25s;

div {
  cursor: pointer;
  padding: $icon-size * 0.5;
  transition: transform $transition-speed;
}

span {
  font-size: $icon-size;
  user-select: none;
  transition: font-variation-settings $transition-speed;
  font-variation-settings: 'FILL' 0;

  &.selected {
    font-variation-settings: 'FILL' 1;
  }

  div:hover>&:not(.selected) {
    font-variation-settings: 'FILL' 0.5;
  }
}
</style>
