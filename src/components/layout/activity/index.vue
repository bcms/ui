<script lang="tsx">
import { computed, defineComponent, ref, Transition } from 'vue';
import { BCMSActivityItem } from '.';
import { BCMSIcon } from '../..';

export interface ActivityItem {
  title?: string;
  date: number;
  type: 'comment' | 'change';
  comment?: string;
}

const component = defineComponent({
  setup() {
    const show = ref(true);
    const activeTab = ref<'all' | 'comment' | 'change'>('all');
    const list = ref<HTMLElement | null>(null);

    const activities: Array<ActivityItem> = [
      {
        type: 'comment',
        date: 1658912019000,
        comment: 'Employees provided with secure login and data encryption',
      },
      {
        type: 'change',
        date: 1658480019000,
        title: 'Momcilo Popov created this entry',
      },
      {
        type: 'change',
        date: 1658048019000,
        title: 'Momcilo Popov updated this entry',
      },
      {
        type: 'comment',
        date: 1657011219000,
        comment: 'Employees provided with secure login and data encryption',
      },
      {
        type: 'change',
        date: 1595844817000,
        title: 'Momcilo Popov updated this entry',
      },
      {
        type: 'comment',
        date: 1627380633000,
        comment: 'Employees provided with secure login and data encryption',
      },
    ];

    const filteredActivities = computed(() => {
      return [...activities]
        .sort((a, b) => b.date - a.date)
        .filter((e) =>
          activeTab.value === 'all' ? true : e.type === activeTab.value
        );
    });

    const groupedActivities = computed(() => {
      return filteredActivities.value.reduce((acc, curr) => {
        const date = new Date(curr.date);

        if (date.toDateString() === new Date().toDateString()) {
          if (!acc.today) {
            acc.today = [curr];
          } else {
            acc.today.push(curr);
          }
        } else if (
          date.getTime() >
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        ) {
          if (!acc['this month']) {
            acc['this month'] = [curr];
          } else {
            acc['this month'].push(curr);
          }
        } else if (date.getFullYear() === new Date().getFullYear()) {
          if (!acc['this year']) {
            acc['this year'] = [curr];
          } else {
            acc['this year'].push(curr);
          }
        } else {
          const year = date.getFullYear();

          if (!acc[`year: ${year}`]) {
            acc[`year: ${year}`] = [curr];
          } else {
            acc[`year: ${year}`].push(curr);
          }
        }

        return acc;
      }, {} as { [key: string]: Array<ActivityItem> });
    });

    return () => (
      <div class="fixed z-[1000] bottom-11 right-20">
        <button
          class="w-10 h-10 flex justify-center items-center bg-green rounded-full"
          onClick={() => {
            show.value = !show.value;
          }}
        >
          <BCMSIcon src="/activity" class="w-6 h-6 text-white fill-current" />
        </button>
        <Transition name="fade">
          {show.value && (
            <div
              ref={list}
              class="absolute -top-3.5 left-10 max-w-[500px] max-h-[530px] overflow-y-auto -translate-x-full w-screen -translate-y-full bg-white shadow-cardLg rounded-2.5 pl-5 pr-17.5 pb-6"
              v-clickOutside={() => (show.value = false)}
            >
              <div class="sticky top-0 flex items-center bg-white py-6">
                <button
                  class={`-tracking-0.01 leading-tight px-2.5 ${
                    activeTab.value === 'all' ? 'text-green font-semibold' : ''
                  }`}
                  onClick={() => {
                    activeTab.value = 'all';
                  }}
                >
                  All
                </button>
                <button
                  class={`-tracking-0.01 leading-tight px-2.5 ${
                    activeTab.value === 'comment'
                      ? 'text-green font-semibold'
                      : ''
                  }`}
                  onClick={() => {
                    activeTab.value = 'comment';
                  }}
                >
                  Comments
                </button>
                <button
                  class={`-tracking-0.01 leading-tight px-2.5 ${
                    activeTab.value === 'change'
                      ? 'text-green font-semibold'
                      : ''
                  }`}
                  onClick={() => {
                    activeTab.value = 'change';
                  }}
                >
                  Changes
                </button>
              </div>
              {Object.keys(groupedActivities.value).map((label, index) => {
                return (
                  <div key={index}>
                    <div
                      class={`text-xs leading-normal tracking-0.06 uppercase mb-5 ${
                        index !== 0 ? 'mt-7.5' : ''
                      } `}
                    >
                      {label}
                    </div>
                    {groupedActivities.value[label].map(
                      (activity, activityIndex) => {
                        return (
                          <BCMSActivityItem
                            item={activity}
                            key={activityIndex}
                          />
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Transition>
      </div>
    );
  },
});

export default component;
</script>
