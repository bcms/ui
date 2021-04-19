<script lang="tsx">
import { computed, defineComponent, onMounted, Teleport } from 'vue';
import type { BCMSTemplate } from '@becomes/cms-sdk/types';
import { useRoute, useRouter } from 'vue-router';
import { MutationTypes, useStore } from '../../../../store';
import {
  BCMSButton,
  BCMSManagerInfo,
  BCMSManagerNav,
  BCMSPropsViewer,
} from '../../../../components';

const component = defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const template = computed<{
      items: BCMSTemplate[];
      target: BCMSTemplate | undefined;
    }>(() => {
      const tmps = store.getters.template_items;
      const target = tmps.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.services.headMeta.set({ title: target.label });
      }
      return {
        items: tmps,
        target,
      };
    });

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'Templates' });
      if (!template.value.target) {
        await window.bcms.services.error.wrapper(
          async () => {
            return window.bcms.sdk.template.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.template_set, result);
          }
        );
        if (template.value.items.length > 0) {
          const target = template.value.items.find(
            (e) => e._id === route.params.id
          );
          if (!target) {
            await router.push({
              path: route.path + '/' + template.value.items[0]._id,
              replace: true,
            });
          }
        }
      }
    });

    return () => (
      <div>
        {template.value.target ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label="Templates"
              actionText="Add new template"
              items={template.value.items.map((e) => {
                return {
                  name: e.label,
                  link: `/dashboard/template/${e._id}`,
                  selected: template.value.target?._id === e._id,
                };
              })}
            />
          </Teleport>
        ) : (
          ''
        )}
        {template.value.items.length > 0 ? (
          <>
            {template.value.target ? (
              <>
                <BCMSManagerInfo
                  id={template.value.target._id}
                  name={template.value.target.label}
                  createdAt={template.value.target.createdAt}
                  updatedAt={template.value.target.updatedAt}
                />
                <BCMSPropsViewer props={template.value.target.props} />
              </>
            ) : (
              ''
            )}
          </>
        ) : (
          <div class="no-entities">
            <div class="no-entities--title">
              There are no entities available.
            </div>
            <BCMSButton
              onClick={() => {
                // dispacth('action');
              }}
            >
              Add new template
            </BCMSButton>
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
