<template>
 <div>hello world</div>
</template>

<script setup lang="ts">

const props = defineProps<{
  lmap: any; // Replace 'any' with the specific type if known
}>();

console.log("wrapper",props.lmap)

</script>

<style scoped></style>
