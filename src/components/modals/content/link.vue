<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import Modal from '../_modal.vue';
import {
  BCMSMediaInput,
  BCMSMultiSelect,
  BCMSSelect,
  BCMSTextInput,
} from '../../input';
import type {
  BCMSContentEditorLinkModalInputData,
  BCMSContentEditorLinkModalOutputData,
  BCMSModalInputDefaults,
  BCMSMultiSelectItemExtended,
} from '../../../types';
import { useTranslation } from '../../../translations';
import {
  BCMSEntryLite,
  BCMSJwtRoleName,
  BCMSPropType,
  BCMSPropValueMediaData,
} from '@becomes/cms-sdk/types';
import { BCMSPropWrapper } from '../../props/_wrapper';

interface Data
  extends BCMSModalInputDefaults<BCMSContentEditorLinkModalOutputData> {
  href: {
    value: string;
    error: string;
  };
}

const component = defineComponent({
  setup() {
    const store = window.bcms.vue.store;
    const translations = computed(() => {
      return useTranslation();
    });
    const type = ref<'url' | 'media' | 'entry'>('url');
    const mediaData = ref<BCMSPropValueMediaData>({
      _id: '',
      alt_text: '',
      caption: '',
    });
    const entryData = ref<BCMSEntryLite>({
      cid: '',
      templateId: '',
      userId: '',
      meta: [],
      _id: '',
      createdAt: 0,
      updatedAt: 0,
    });
    let entriesInitialized = false;
    const entriesLite = computed<BCMSMultiSelectItemExtended[]>(() => {
      const items = store.getters.entryLite_items;
      return items.map((item) => {
        return {};
      });
    });
    const show = ref(false);
    const modalData = ref<Data>(getData());

    window.bcms.modal.content.link = {
      hide() {
        show.value = false;
      },
      show(data) {
        modalData.value = getData(data);
        show.value = true;
      },
    };

    function getData(inputData?: BCMSContentEditorLinkModalInputData): Data {
      const d: Data = {
        title: translations.value.modal.contentLink.title,
        href: {
          value: '',
          error: '',
        },
        onCancel() {
          // ...
        },
        onDone() {
          // ...
        },
      };
      if (inputData) {
        if (inputData.title) {
          d.title = inputData.title;
        }
        if (inputData.onDone) {
          d.onDone = inputData.onDone;
        }
        if (inputData.onCancel) {
          d.onCancel = inputData.onCancel;
        }
        if (inputData.href) {
          const href = inputData.href;
          if (href.startsWith('entry:')) {
            type.value = 'entry';
            window.bcms.util.throwable(async () => {
              const [eid, tid] = href.replace('entry:', '').split('_');
              if (eid && tid) {
                const user = await window.bcms.sdk.user.get();
                const policy = user.customPool.policy;
                if (
                  user.roles[0].name === BCMSJwtRoleName.ADMIN ||
                  policy.templates.find((e) => e._id === tid)
                ) {
                  const entry = await window.bcms.sdk.entry.getLite({
                    templateId: tid,
                    entryId: eid,
                  });
                  entryData.value = entry;
                }
              }
              if (!entriesInitialized) {
                const templates = await window.bcms.sdk.template.getAll();
                for (let i = 0; i < templates.length; i++) {
                  const template = templates[i];
                  await window.bcms.sdk.entry.getAllLite({
                    templateId: template._id,
                  });
                }
                entriesInitialized = true;
              }
            });
          } else if (href.startsWith('media:')) {
            type.value = 'media';
            const [_id, alt_text, caption] = href
              .replace('media:', '')
              .split('@*_');
            mediaData.value = {
              _id,
              alt_text,
              caption,
            };
          }
          d.href.value = href;
        }
      }
      return d;
    }
    function cancel() {
      if (modalData.value.onCancel) {
        const result = modalData.value.onCancel();
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.content.link.hide();
    }
    function done() {
      if (modalData.value.onDone) {
        if (type.value === 'media') {
          mediaBuildHref();
        }
        const result = modalData.value.onDone({
          href: modalData.value.href.value,
        });
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(error);
          });
        }
      }
      window.bcms.modal.content.link.hide();
    }

    function mediaBuildHref() {
      if (mediaData.value._id) {
        modalData.value.href.value = `media:${mediaData.value._id}@*_${mediaData.value.alt_text}@*_${mediaData.value.caption}`;
      } else {
        modalData.value.href.value = '';
      }
    }

    return () => {
      return (
        <Modal
          title={modalData.value.title}
          show={show.value}
          actionName="Set"
          onDone={done}
          onCancel={cancel}
        >
          <div>
            <BCMSSelect
              label={translations.value.modal.contentLink.input.type.label}
              selected={type.value}
              options={translations.value.modal.contentLink.input.type.options.map(
                (e) => {
                  return {
                    label: e.label,
                    value: e.value,
                  };
                }
              )}
              onChange={(event) => {
                if (type.value !== 'url' && event.value === 'url') {
                  modalData.value.href.value = '';
                }
                type.value = event.value as never;
              }}
            />
            {type.value === 'entry' ? (
              <BCMSMultiSelect
                title="Select entry"
                onlyOne
                items={entriesLite.value
                  .map((entry) => {
                    if (
                      entryData.value._id &&
                      entry._id === entryData.value._id
                    ) {
                      return {
                        ...entry,
                        selected: true,
                      };
                    }
                    return entry;
                  })
                  .sort((a, b) => (b.title > a.title ? -1 : 1))}
                onChange={(items) => {
                  const prop = window.bcms.util.object.instance(props.prop);
                  if (items.length === 0) {
                    prop.data = [];
                  } else {
                    const [tid, eid] = items[0].id.split('-');
                    (prop.data as PropValueType)[0] = {
                      tid,
                      eid,
                    };
                  }
                  ctx.emit('update', prop);
                }}
              />
            ) : type.value === 'media' ? (
              <BCMSPropWrapper
                class="mt-10"
                id="link-media"
                prop={{
                  id: 'link-media',
                  data: [],
                  label: 'Select media',
                  required: true,
                  array: false,
                  type: BCMSPropType.MEDIA,
                }}
              >
                <BCMSMediaInput
                  value={mediaData.value}
                  onClick={() => {
                    window.bcms.modal.media.picker.show({
                      title: 'Select media',
                      media: window.bcms.vue.store.getters.media_findOne(
                        (parent) =>
                          parent._id ===
                          window.bcms.vue.store.getters.media_findOne(
                            (e) => e._id === mediaData.value._id
                          )?.parentId
                      ),
                      onDone: (data) => {
                        mediaData.value._id = data.media._id;
                        mediaBuildHref();
                      },
                    });
                  }}
                  onAltTextChange={(value) => {
                    mediaData.value.alt_text = value;
                    mediaBuildHref();
                  }}
                  onCaptionChange={(value) => {
                    mediaData.value.caption = value;
                    mediaBuildHref();
                  }}
                />
              </BCMSPropWrapper>
            ) : (
              <>
                <BCMSTextInput
                  class="mt-5"
                  label={translations.value.modal.contentLink.input.url.label}
                  invalidText={modalData.value.href.error}
                  focusOnLoad
                  value={modalData.value.href.value}
                  onInput={(value) => {
                    modalData.value.href.value = value;
                  }}
                />
              </>
            )}
          </div>
        </Modal>
      );
    };
  },
});
export default component;
</script>
