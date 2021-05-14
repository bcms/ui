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

const lastState = {
  id: '',
};

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
      createNewItem() {
        window.bcms.services.modal.addUpdate.template.show({
          title: 'Create new template',
          templateNames: template.value.items.map((e) => e.name),
          mode: 'add',
          async onDone(data) {
            await gtwHelper.create(data);
          },
        });
      },
      async remove() {
        if (!template.value.target) {
          return;
        }
        if (
          await window.bcms.services.confirm(
            `Delete "${template.value.target.label}" Template`,
            `Are you sure you want to delete <strong>${template.value.target.label}</strong>` +
              'template? This action is irreversible and all entries from this template will be deleted.',
            template.value.target.name
          )
        ) {
          await gtwHelper.delete(template.value.target);
          lastState.id = template.value.items[0]._id;
          await router.push({
            path: `/dashboard/template/${template.value.items[0]._id}`,
            replace: true,
          });
        }
      },
      edit() {
        const tmp = template.value.target as BCMSTemplate;
        window.bcms.services.modal.addUpdate.template.show({
          mode: 'update',
          label: tmp.label,
          title: `Edit ${tmp.label} Template`,
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
      },
      prop: {
        add() {
          if (!template.value.target) {
            return;
          }
          window.bcms.services.modal.props.add.show({
            takenPropNames: template.value.target.props.map((e) => e.name),
            onDone(data) {
              const tmp = template.value.target as BCMSTemplate;
              gtwHelper.addProp(tmp._id, data);
            },
          });
        },
        async move(data: { direction: -1 | 1; index: number }) {
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
        },
        async remove(index: number) {
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
        },
        async edit(index: number) {
          const tmp = template.value.target as BCMSTemplate;
          const prop: BCMSProp = JSON.parse(JSON.stringify(tmp.props[index]));
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
        },
      },
    };
    async function redirect() {
      if (!lastState.id && route.params.id) {
        lastState.id = route.params.id as string;
      }
      const targetId = lastState.id
        ? lastState.id
        : template.value.items[0]._id;
      if (targetId) {
        await router.push({
          path: '/dashboard/template/' + targetId,
          replace: true,
        });
      }
    }

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'templates' });
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
          await redirect();
        }
      } else {
        await redirect();
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
                  onClick: () => {
                    lastState.id = e._id;
                    router.push({
                      path: `/dashboard/template/${e._id}`,
                      replace: true,
                    });
                  },
                };
              })}
              onAction={logic.createNewItem}
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
                  onEdit={logic.edit}
                />
                <BCMSPropsViewer
                  props={template.value.target.props}
                  onDeleteEntity={logic.remove}
                  onAdd={logic.prop.add}
                  onPropMove={logic.prop.move}
                  onPropDelete={logic.prop.remove}
                  onPropEdit={logic.prop.edit}
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
            <BCMSButton onClick={logic.createNewItem}>
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
