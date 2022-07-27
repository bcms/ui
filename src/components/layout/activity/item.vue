<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import type { ActivityItem } from './index.vue';

const component = defineComponent({
  props: {
    item: {
      type: Object as PropType<ActivityItem>,
      required: true,
    },
  },
  setup(props) {
    const formattedDate = () => {
      const dateObj = new Date(props.item.date);

      const day = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      return `${day}, ${time}`;
    };

    return () => (
      <div class="flex items-start mb-5 last:mb-0">
        <div class="flex flex-shrink-0 mr-2.5">
          <img
            src="/assets/flags/sr.jpg"
            alt="Avatar"
            class="w-10 h-10 object-cover rounded-full"
          />
        </div>
        <div class="pt-2">
          <div class="-tracking-0.01 leading-tight mb-1">
            {props.item.type === 'comment'
              ? 'Tomislava Babic left a comment'
              : props.item.title}
          </div>
          <div class="text-grey -tracking-0.01 leading-tight mb-2.5">
            {formattedDate()}
          </div>
          <div class="flex items-center">
            {props.item.type === 'change' ? (
              <>
                <button class="-tracking-0.01 leading-tight text-green font-semibold mr-2.5">
                  View changes
                </button>
                <button class="-tracking-0.01 leading-tight text-grey font-semibold">
                  Revert
                </button>
              </>
            ) : (
              <div class="border border-grey rounded-3.5 px-4.5 py-2.5 -tracking-0.01 leading-tight">
                {props.item.comment}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
});

export default component;
</script>
