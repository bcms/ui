<template>
  <div
    ref="list"
    class="
      bg-white
      shadow-cardLg
      overflow-y-auto
      max-h-80
      w-screen
      max-w-xs
      rounded-2.5
      z-50
    "
  >
    <button
      class="
        slashCommand--list-item
        group
        flex
        items-center
        w-full
        px-5
        py-3
        transition-colors
        duration-300
        hover:bg-grey hover:bg-opacity-10
        focus:bg-grey focus:bg-opacity-10
      "
      :class="{
        'slashCommand--list-item_active bg-grey bg-opacity-10':
          index === selectedIndex,
      }"
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(index)"
    >
      <BCMSIcon
        :src="item.icon"
        class="
          w-6
          h-6
          text-grey
          fill-current
          mr-3.5
          transition-colors
          duration-300
          group-hover:text-green
          group-focus:text-green
        "
      />
      <span
        class="
          pt-1
          line-clamp
          text-dark
          -tracking-0.01
          leading-tight
          transition-colors
          duration-300
          text-left
          group-hover:text-green
          group-focus:text-green
        "
      >
        {{ item.title }}
      </span>
    </button>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from '@vue/runtime-core';
import BCMSIcon from '../icon.vue';

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },
  components: { BCMSIcon },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  watch: {
    items() {
      this.selectedIndex = 0;
    },
  },
  methods: {
    onKeyDown({ event }: any) {
      if (event.key === 'ArrowUp') {
        this.upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        this.downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }

      return false;
    },
    scrollElementToView(index: number) {
      const list = this.$refs.list as HTMLElement;
      if (list) {
        const items = list.querySelectorAll('button');
        if (items[index]) {
          items[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    },
    upHandler() {
      const activeIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length;
      this.selectedIndex = activeIndex;
      this.scrollElementToView(activeIndex);
    },
    downHandler() {
      const activeIndex = (this.selectedIndex + 1) % this.items.length;
      this.selectedIndex = activeIndex;
      this.scrollElementToView(activeIndex);
    },
    enterHandler() {
      this.selectItem(this.selectedIndex);
    },
    selectItem(index: number) {
      const item = this.items[index];

      if (item) {
        this.command(item);
      }
    },
  },
});
</script>

<style lang="scss">
.slashCommand {
  &--list {
    &-item {
      &_active {
        svg {
          @apply text-green;
        }
        span {
          @apply text-green;
        }
      }
      .line-clamp {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
