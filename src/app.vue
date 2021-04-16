<template>
  <div class="layout">
    <BCMSNav />
    <div id='managerNav' />
    <div class="layout--body">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import 'assets/styles/main';
</style>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { BCMSNav } from '@/components';

const component = defineComponent({
  components: {
    BCMSNav,
  },
  setup() {
    const route = useRoute();
    const noHeader = computed(() => route.meta.noHeader);
    return { noHeader };
  },
});
export default component;
</script>
