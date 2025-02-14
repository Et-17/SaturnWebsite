<script setup lang="ts">
</script>

<template>
  <div>
    <span class="material-symbols-outlined">
      error
    </span>
    <span>
      Error
    </span>
    <br>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
div {
  @extend .ibm-plex-serif;
  border: solid 2px red;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding: 3%;
}

span.material-symbols-outlined {
  padding-inline-end: 1%;
}

span {
  font-size: 1.25em;
}
</style>
