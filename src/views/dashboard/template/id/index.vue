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
    const gtwHelper = window.bcms.helpers.gtw<BCMSTemplate>('template');
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

    const logic = {
      async remove() {
        if (!template.value.target) {
          return;
        }
        if (
          await window.bcms.services.confirm(
            `Delete "${template.value.target.label}" Template`,
            `Are you sure you want to delete <strong>${template.value.target.label}</strong>
              template? This action is irreversible and all entries in
              this template will also be deleted.`,
            template.value.target.name
          )
        ) {
          await window.bcms.services.error.wrapper(
            async () => {
              // TODO
              // await EntityManagerService.delete('template', template._id);
            },
            async () => {
              // NotificationService.success('Template was successfully deleted.');
            }
          );
        }
      },
    };

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
              onAction={() => {

              }}
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
                <BCMSPropsViewer
                  props={template.value.target.props}
                  onDeleteEntity={() => {
                    logic.remove();
                  }}
                  onAdd={() => {
                    if (!template.value.target) {
                      return;
                    }
                    window.bcms.services.modal.props.add.show({
                      takenPropNames: template.value.target.props.map(
                        (e) => e.name
                      ),
                      onDone(data) {
                        const tmp = template.value.target as BCMSTemplate;
                        gtwHelper.addProp(tmp._id, data);
                      },
                    });
                  }}
                />
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
