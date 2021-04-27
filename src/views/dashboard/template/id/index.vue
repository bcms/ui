<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  Teleport,
} from 'vue';
import {
  BCMSTemplate,
  BCMSPropType,
  BCMSPropEnum,
  BCMSProp,
} from '@becomes/cms-sdk/types';
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
          await gtwHelper.delete(template.value.target);
        }
      },
    };
    function createNewItem() {
      window.bcms.services.modal.addUpdate.template.show({
        title: 'Create new template',
        templateNames: template.value.items.map((e) => e.name),
        mode: 'add',
        async onDone(data) {
          await gtwHelper.create(data);
        },
      });
    }

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
    onBeforeUpdate(async () => {
      if (template.value.items.length > 0 && !template.value.target) {
        await router.push({
          path: `/dashboard/template/${template.value.items[0]._id}`,
          replace: true,
        });
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
                createNewItem();
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
                  onEdit={() => {
                    const tmp = template.value.target as BCMSTemplate;
                    window.bcms.services.modal.addUpdate.template.show({
                      mode: 'update',
                      label: tmp.label,
                      title: `Edit ${tmp.label} template`,
                      desc: tmp.desc,
                      templateNames: template.value.items.map((e) => e.name),
                      async onDone(data) {
                        await gtwHelper.update({
                          _id: tmp._id,
                          label: data.label,
                          desc: data.desc,
                        });
                      },
                    });
                  }}
                />
                <BCMSPropsViewer
                  props={template.value.target.props}
                  onDeleteEntity={async () => {
                    await logic.remove();
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
                  onPropMove={async (data) => {
                    const tmp = template.value.target as BCMSTemplate;
                    const prop = tmp.props[data.index];
                    await gtwHelper.updateProp({
                      id: tmp._id,
                      prop,
                      data: {
                        label: prop.label,
                        move: data.direction,
                        required: prop.required,
                      },
                    });
                  }}
                  onPropDelete={async (index) => {
                    const tmp = template.value.target as BCMSTemplate;
                    const prop = tmp.props[index];
                    if (
                      await window.bcms.services.confirm(
                        `Remove property ${prop.label}`,
                        `Are you sure you want to delete property ${prop.label}?`
                      )
                    ) {
                      await gtwHelper.removeProp(tmp._id, prop);
                    }
                  }}
                  onPropEdit={(index) => {
                    const tmp = template.value.target as BCMSTemplate;
                    const prop: BCMSProp = JSON.parse(
                      JSON.stringify(tmp.props[index])
                    );
                    window.bcms.services.modal.props.edit.show({
                      title: `Edit property ${prop.name}`,
                      prop,
                      takenPropNames: tmp.props
                        .filter((_e, i) => i !== index)
                        .map((e) => e.name),
                      async onDone(data) {
                        console.log(data.prop, prop);
                        await gtwHelper.updateProp({
                          id: tmp._id,
                          prop: prop,
                          data: {
                            required: data.prop.required,
                            move: 0,
                            label: data.prop.label,
                            enumItems:
                              data.prop.type === BCMSPropType.ENUMERATION
                                ? (data.prop.value as BCMSPropEnum).items
                                : undefined,
                          },
                        });
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
                createNewItem();
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
