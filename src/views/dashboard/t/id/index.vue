<script lang="tsx">
import { Teleport } from 'vue';
import {
  BCMSPropEntryPointerData,
  BCMSPropEnumData,
  BCMSPropType,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import { computed, defineComponent, onMounted, ref } from '@vue/runtime-core';
import {
  BCMSButton,
  BCMSManagerInfo,
  BCMSPropsViewer,
  BCMSManagerNav,
  BCMSEmptyStateIllustration,
} from '../../../../components';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const lastState = {
  tid: '',
};

const component = defineComponent({
  setup() {
    const { t: i18n } = useI18n();
    const throwable = window.bcms.util.throwable;
    const meta = window.bcms.meta;
    const store = window.bcms.vue.store;
    const router = useRouter();
    const route = useRoute();
    const template = computed<{
      items: BCMSTemplate[];
      target?: BCMSTemplate;
    }>(() => {
      const target = store.getters.template_findOne(
        (e) => e.cid === (route.params.tid as string)
      );
      if (target) {
        meta.set({
          title: i18n('template.meta.dynamicTitle', {
            label: target.label,
          }),
        });
      }
      return {
        items: store.getters.template_items,
        target,
      };
    });
    const mounted = ref(false);

    const logic = {
      createNewItem() {
        window.bcms.modal.addUpdate.template.show({
          title: i18n('modal.addUpdateTemplate.newTitle'),
          templateNames: template.value.items.map((e) => e.name),
          mode: 'add',
          async onDone(data) {
            await throwable(
              async () => {
                return await window.bcms.sdk.template.create({
                  label: data.label,
                  desc: data.desc,
                  singleEntry: data.singleEntry,
                });
              },
              async (result) => {
                await router.push(`/dashboard/t/${result.cid}`);
              }
            );
          },
        });
      },
      async remove() {
        const target = template.value.target as BCMSTemplate;
        if (
          await window.bcms.confirm(
            i18n('template.confirm.remove.title', {
              label: target.label,
            }),
            i18n('template.confirm.remove.description', {
              label: target.label,
            }),
            target.name
          )
        ) {
          await throwable(
            async () => {
              await window.bcms.sdk.template.deleteById(target._id);
            },
            async () => {
              lastState.tid = template.value.items[0]
                ? template.value.items[0].cid
                : '';
              await router.push({
                path: `/dashboard/t/${lastState.tid}`,
                replace: true,
              });
            }
          );
        }
      },
      edit() {
        const target = template.value.target as BCMSTemplate;
        window.bcms.modal.addUpdate.template.show({
          mode: 'update',
          label: target.label,
          title: i18n('modal.addUpdateTemplate.editTitle', {
            label: target.label,
          }),
          desc: target.desc,
          singleEntry: target.singleEntry,
          templateNames: template.value.items.map((e) => e.name),
          async onDone(data) {
            await throwable(async () => {
              await window.bcms.sdk.template.update({
                _id: target._id,
                label: data.label,
                desc: data.desc,
                singleEntry: data.singleEntry,
              });
            });
          },
        });
      },
      prop: {
        add() {
          const target = template.value.target as BCMSTemplate;
          window.bcms.modal.props.add.show({
            takenPropNames: target.props.map((e) => e.name),
            async onDone(data) {
              await throwable(async () => {
                await window.bcms.sdk.template.update({
                  _id: target._id,
                  propChanges: [
                    {
                      add: data,
                    },
                  ],
                });
              });
            },
          });
        },
        async move(data: { direction: -1 | 1; index: number }) {
          const target = template.value.target as BCMSTemplate;
          const prop = target.props[data.index];
          await throwable(async () => {
            await window.bcms.sdk.template.update({
              _id: target._id,
              propChanges: [
                {
                  update: {
                    id: prop.id,
                    label: prop.label,
                    required: prop.required,
                    move: data.direction,
                  },
                },
              ],
            });
          });
        },
        async remove(index: number) {
          const target = template.value.target as BCMSTemplate;
          const prop = target.props[index];
          if (
            await window.bcms.confirm(
              i18n('template.confirm.removeProperty.title', {
                label: prop.label,
              }),
              i18n('template.confirm.removeProperty.description', {
                label: prop.label,
              })
            )
          ) {
            await throwable(async () => {
              await window.bcms.sdk.template.update({
                _id: target._id,
                propChanges: [
                  {
                    remove: prop.id,
                  },
                ],
              });
            });
          }
        },
        edit(index: number) {
          const target = template.value.target as BCMSTemplate;
          const prop = target.props[index];
          window.bcms.modal.props.edit.show({
            title: i18n('modal.editProp.title', { label: prop.name }),
            prop,
            takenPropNames: target.props
              .filter((_e, i) => i !== index)
              .map((e) => e.name),
            async onDone(data) {
              await throwable(async () => {
                await window.bcms.sdk.template.update({
                  _id: target._id,
                  propChanges: [
                    {
                      update: {
                        id: prop.id,
                        label: data.prop.label,
                        required: data.prop.required,
                        move: 0,
                        enumItems:
                          prop.type === BCMSPropType.ENUMERATION
                            ? (data.prop.defaultData as BCMSPropEnumData).items
                            : undefined,
                        array: data.prop.array,
                        entryPointer:
                          prop.type === BCMSPropType.ENTRY_POINTER
                            ? (data.prop
                                .defaultData as BCMSPropEntryPointerData[])
                            : undefined,
                      },
                    },
                  ],
                });
              });
            },
          });
        },
      },
    };
    async function redirect() {
      if (!lastState.tid && route.params.tid) {
        lastState.tid = route.params.tid as string;
      }
      const targetId = lastState.tid
        ? lastState.tid
        : template.value.items[0].cid;
      if (targetId) {
        await router.push({
          path: '/dashboard/t/' + targetId,
          replace: true,
        });
      }
    }

    onMounted(async () => {
      if (!template.value.target) {
        await throwable(async () => {
          await window.bcms.sdk.template.getAll();
        });
        if (template.value.items.length > 0) {
          await redirect();
        }
      } else {
        await redirect();
      }
      mounted.value = true;
    });

    return () => (
      <div>
        {template.value.target && mounted.value ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label={i18n('template.nav.label')}
              actionText={i18n('template.nav.actionText')}
              items={template.value.items.map((e) => {
                return {
                  name: e.label,
                  link: `/dashboard/t/${e.cid}`,
                  selected: template.value.target?.cid === e.cid,
                  onClick: () => {
                    lastState.tid = e.cid;
                    router.push({
                      path: `/dashboard/t/${e.cid}`,
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
          template.value.target ? (
            <>
              <BCMSManagerInfo
                id={template.value.target._id}
                name={template.value.target.label}
                createdAt={template.value.target.createdAt}
                updatedAt={template.value.target.updatedAt}
                onEdit={logic.edit}
                description={template.value.target.desc}
                key={template.value.target._id}
              />
              <BCMSPropsViewer
                name={'template'}
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
          )
        ) : (
          <div class="mt-7 desktop:mt-0">
            <div class="flex items-start justify-between">
              <div class="flex flex-col space-y-5">
                <span class="text-9.5 -tracking-0.03 leading-none">
                  {i18n('template.emptyState.title')}
                </span>
                <div class="leading-tight -tracking-0.01">
                  {i18n('template.emptyState.subtitle')}
                </div>
              </div>
              <BCMSButton onClick={logic.createNewItem}>
                {i18n('template.emptyState.actionText')}
              </BCMSButton>
            </div>
            <BCMSEmptyStateIllustration
              src="/templates.png"
              maxWidth="335px"
              maxHeight="320px"
              class="mt-20 md:absolute md:bottom-32 md:right-32"
            />
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
