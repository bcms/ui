<template>
  <router-view />
</template>

<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

const component = defineComponent({
  components: {},
  setup() {
    const route = useRoute();
    const noHeader = computed(() => route.meta.noHeader);
    return { noHeader };
  },
});
export default component;
</script>
