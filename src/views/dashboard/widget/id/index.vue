<script lang="tsx">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  Teleport,
} from 'vue';
import {
  BCMSWidget,
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
    const gtwHelper = window.bcms.helpers.gtw<BCMSWidget>('widget');
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const widget = computed<{
      items: BCMSWidget[];
      target: BCMSWidget | undefined;
    }>(() => {
      const wids = store.getters.widget_items;
      const target = wids.find((e) => e._id === route.params.id);
      if (target) {
        window.bcms.services.headMeta.set({ title: target.label });
      }
      return {
        items: wids,
        target,
      };
    });

    const logic = {
      createNewItem() {
        window.bcms.services.modal.addUpdate.widget.show({
          title: 'Create new widget',
          widgetNames: widget.value.items.map((e) => e.name),
          mode: 'add',
          async onDone(data) {
            await gtwHelper.create(data);
          },
        });
      },
      async remove() {
        if (!widget.value.target) {
          return;
        }
        if (
          await window.bcms.services.confirm(
            `Delete "${widget.value.target.label}" Widget`,
            `Are you sure you want to delete <strong>${widget.value.target.label}</strong>` +
              'widget? This action is irreversible and widget will be removed from all ' +
              'entries.',
            widget.value.target.name
          )
        ) {
          await gtwHelper.delete(widget.value.target);
        }
      },
      edit() {
        const wid = widget.value.target as BCMSWidget;
        window.bcms.services.modal.addUpdate.widget.show({
          mode: 'update',
          label: wid.label,
          title: `Edit ${wid.label} Widget`,
          desc: wid.desc,
          widgetNames: widget.value.items.map((e) => e.name),
          async onDone(data) {
            await gtwHelper.update({
              _id: wid._id,
              label: data.label,
              desc: data.desc,
            });
          },
        });
      },
      prop: {
        add() {
          if (!widget.value.target) {
            return;
          }
          window.bcms.services.modal.props.add.show({
            takenPropNames: widget.value.target.props.map((e) => e.name),
            onDone(data) {
              const wid = widget.value.target as BCMSWidget;
              gtwHelper.addProp(wid._id, data);
            },
          });
        },
        async move(data: { direction: -1 | 1; index: number }) {
          const wid = widget.value.target as BCMSWidget;
          const prop = wid.props[data.index];
          await gtwHelper.updateProp({
            id: wid._id,
            prop,
            data: {
              label: prop.label,
              move: data.direction,
              required: prop.required,
            },
          });
        },
        async remove(index: number) {
          const wid = widget.value.target as BCMSWidget;
          const prop = wid.props[index];
          if (
            await window.bcms.services.confirm(
              `Remove property ${prop.label}`,
              `Are you sure you want to delete property ${prop.label}?`
            )
          ) {
            await gtwHelper.removeProp(wid._id, prop);
          }
        },
        async edit(index: number) {
          const wid = widget.value.target as BCMSWidget;
          const prop: BCMSProp = JSON.parse(JSON.stringify(wid.props[index]));
          window.bcms.services.modal.props.edit.show({
            title: `Edit property ${prop.name}`,
            prop,
            takenPropNames: wid.props
              .filter((_e, i) => i !== index)
              .map((e) => e.name),
            async onDone(data) {
              console.log(data.prop, prop);
              await gtwHelper.updateProp({
                id: wid._id,
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

    onMounted(async () => {
      window.bcms.services.headMeta.set({ title: 'Widgets' });
      if (!widget.value.target) {
        await window.bcms.services.error.wrapper(
          async () => {
            return window.bcms.sdk.widget.getAll();
          },
          async (result) => {
            store.commit(MutationTypes.widget_set, result);
          }
        );
        if (widget.value.items.length > 0) {
          const target = widget.value.items.find(
            (e) => e._id === route.params.id
          );
          if (!target) {
            await router.push({
              path: route.path + '/' + widget.value.items[0]._id,
              replace: true,
            });
          }
        }
      }
    });
    onBeforeUpdate(async () => {
      if (widget.value.items.length > 0 && !widget.value.target) {
        await router.push({
          path: `/dashboard/widget/${widget.value.items[0]._id}`,
          replace: true,
        });
      }
    });

    return () => (
      <div>
        {widget.value.target ? (
          <Teleport to="#managerNav">
            <BCMSManagerNav
              label="Widgets"
              actionText="Add new widget"
              items={widget.value.items.map((e) => {
                return {
                  name: e.label,
                  link: `/dashboard/widget/${e._id}`,
                  selected: widget.value.target?._id === e._id,
                };
              })}
              onAction={logic.createNewItem}
            />
          </Teleport>
        ) : (
          ''
        )}
        {widget.value.items.length > 0 ? (
          <>
            {widget.value.target ? (
              <>
                <BCMSManagerInfo
                  id={widget.value.target._id}
                  name={widget.value.target.label}
                  createdAt={widget.value.target.createdAt}
                  updatedAt={widget.value.target.updatedAt}
                  onEdit={logic.edit}
                />
                <BCMSPropsViewer
                  props={widget.value.target.props}
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
              Add new widget
            </BCMSButton>
          </div>
        )}
      </div>
    );
  },
});
export default component;
</script>
