<script context="module" lang="ts">
  export const types: Array<{
    name: string;
    desc: string;
    value: string;
    hide?: boolean;
  }> = [
    {
      name: 'String',
      desc: 'Any character array value.',
      value: PropType.STRING,
    },
    {
      name: 'Rich Text',
      desc: 'Text with options for bold, itelicm, list...',
      value: PropType.RICH_TEXT,
    },
    {
      name: 'Number',
      desc: 'Any real number.',
      value: PropType.NUMBER,
    },
    {
      name: 'Date',
      desc: 'Unix timestamp - date in milliseconds.',
      value: PropType.DATE,
    },
    {
      name: 'Boolean',
      desc: 'Yes or no, true or false, 1 or 0.',
      value: PropType.BOOLEAN,
    },
    {
      name: 'Enumeration',
      desc: 'List of choices.',
      value: PropType.ENUMERATION,
    },
    {
      name: 'Media',
      desc: 'Select a media file using media picker',
      value: PropType.MEDIA,
    },
    {
      name: 'Group Pointer',
      desc: 'Extend properties od a group',
      value: PropType.GROUP_POINTER,
      hide: true,
    },
    {
      name: 'Entry Pointer',
      desc: 'Extend properties of an entry.',
      value: PropType.ENTRY_POINTER,
      hide: true,
    },
  ];
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import {
    Group,
    Prop,
    PropEntryPointer,
    PropEnum,
    PropGroupPointer,
    PropQuill,
    PropType,
    Template,
  } from '@becomes/cms-sdk';
  import {
    StoreService,
    GeneralService,
    sdk,
    NotificationService,
  } from '../../services';
  import Modal from './modal.svelte';
  import {
    TextInput,
    ToggleInput,
    SelectGroupPointer,
    SelectEntryPointer,
    MultiAddInput,
  } from '../input';

  export let excludeGroups: string[] = [];
  // export let excludeTemplates: string[] = [];

  const groupStoreUnsub = StoreService.subscribe(
    'group',
    async (value: Group[]) => {
      if (value) {
        groups = value;
      }
    }
  );
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value: Template[]) => {
      if (value) {
        templates = value;
      }
    }
  );
  const dispatch = createEventDispatcher();
  const name = 'AddPropModal';
  let prop: Prop = {
    label: '',
    name: '',
    array: false,
    required: false,
    type: PropType.BOOLEAN,
    value: [],
  };
  let stage = 0;
  let selectedType: string;
  let groups: Group[] = [];
  let templates: Template[] = [];
  let entryPointerSelectedDisplayProp = 'title';
  let groupPointerSelected = '';
  let entryPointerSelected = '';
  let actionName = 'Next';
  let errors = {
    name: '',
    enum: '',
    groupPointer: '',
    entryPointer: '',
  };

  function close() {
    StoreService.update(name, false);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function beforeDone() {
    if (stage === 0) {
      next();
      return false;
    } else if (stage === 1) {
      if (prop.label.replace(/ /g, '') === '') {
        errors.name = 'Name input cannot be empty.';
        return false;
      }
      errors.name = '';
      if (prop.type === PropType.ENUMERATION) {
        const value = prop.value as PropEnum;
        if (value.items.length === 0) {
          errors.enum = 'At least 1 item must be provided.';
          return false;
        }
        errors.enum = '';
      } else if (prop.type === PropType.GROUP_POINTER) {
        if (!groupPointerSelected) {
          errors.groupPointer = 'Please select a group.';
          return false;
        }
        errors.groupPointer = '';
        const group = groups.find((e) => e._id === groupPointerSelected);
        if (!group) {
          console.error('groups', groups, 'selected', groupPointerSelected);
          NotificationService.error('Failed to find a group.');
          return false;
        }
        const value: PropGroupPointer = {
          _id: group._id,
          items: [{ props: group.props }],
        };
        prop.value = value;
      } else if (prop.type === PropType.ENTRY_POINTER) {
        if (!entryPointerSelected) {
          errors.entryPointer = 'Please select a template.';
          return false;
        }
        errors.entryPointer = '';
        const value: PropEntryPointer = {
          templateId: entryPointerSelected,
          displayProp: entryPointerSelectedDisplayProp,
          entryIds: [],
        };
        prop.value = value;
      } else if (prop.type.endsWith('_ARRAY')) {
        prop.value = [];
      }
    }
    return true;
  }
  function done() {
    dispatch('done', JSON.parse(JSON.stringify(prop)));
    close();
  }
  function next() {
    switch (stage) {
      case 0: {
        if (!selectedType) {
          NotificationService.warning('You must select a type.');
          return;
        }
        switch (selectedType) {
          case PropType.STRING:
            {
              prop.type = PropType.STRING;
              prop.value = [''];
            }
            break;
          case PropType.RICH_TEXT:
            {
              prop.type = PropType.RICH_TEXT;
              const value: PropQuill = {
                ops: [],
                text: '',
              };
              prop.value = value;
            }
            break;
          case PropType.NUMBER:
            {
              prop.type = PropType.NUMBER;
              prop.value = [0];
            }
            break;
          case PropType.DATE:
            {
              prop.type = PropType.DATE;
              prop.value = [0];
            }
            break;
          case PropType.BOOLEAN:
            {
              prop.type = PropType.BOOLEAN;
              prop.value = [false];
            }
            break;
          case PropType.ENUMERATION:
            {
              prop.type = PropType.ENUMERATION;
              (prop.value as PropEnum) = {
                items: [],
                selected: '',
              };
            }
            break;
          case PropType.MEDIA:
            {
              prop.type = PropType.MEDIA;
              prop.value = [''];
            }
            break;
          case PropType.GROUP_POINTER:
            {
              prop.type = PropType.GROUP_POINTER;
              const value: PropGroupPointer = {
                _id: '',
                items: [],
              };
              prop.value = value;
            }
            break;
          case PropType.ENTRY_POINTER:
            {
              prop.type = PropType.ENTRY_POINTER;
              const value: PropEntryPointer = {
                entryIds: [''],
                displayProp: 'title',
                templateId: '',
              };
              prop.value = value;
            }
            break;
        }
        stage = stage + 1;
        actionName = 'Done';
        return;
      }
    }
  }
  function addEnumItems(items: string[]) {
    (prop.value as PropEnum).items = items;
  }
  function resetState() {
    prop = {
      label: '',
      name: '',
      array: false,
      required: false,
      type: PropType.BOOLEAN,
      value: [],
    };
    stage = 0;
    selectedType = undefined;
    entryPointerSelectedDisplayProp = 'title';
    groupPointerSelected = '';
    entryPointerSelected = '';
    actionName = 'Next';
    errors = {
      name: '',
      enum: '',
      groupPointer: '',
      entryPointer: '',
    };
  }

  onMount(async () => {
    groups = await GeneralService.errorWrapper(
      async () => {
        return await sdk.group.getAll();
      },
      async (value: Group[]) => {
        return value;
      }
    );
    templates = await GeneralService.errorWrapper<Template[], Template[]>(
      async () => {
        return await sdk.template.getAll();
      },
      async (value) => {
        return value;
      }
    );
    if (groups && templates) {
      StoreService.update('group', groups);
      StoreService.update('template', templates);
      if (templates.length > 0) {
        types.forEach((e) => {
          if (e.name === 'Entry Pointer') {
            e.hide = false;
          }
        });
      }
      if (groups.length > 0) {
        types.forEach((e) => {
          if (e.name === 'Group Pointer') {
            e.hide = false;
          }
        });
      }
    }
  });
  onDestroy(() => {
    groupStoreUnsub();
    templateStoreUnsub();
  });
</script>

<Modal
  name="AddPropModal"
  on:cancel={cancel}
  on:done={done}
  {actionName}
  {beforeDone}
  on:animationDone={() => {
    resetState();
  }}
  class="bcmsModal_addProp">
  <div slot="header">
    {#if stage === 0}
      <h2 class="bcmsModal--title">Add new property</h2>
    {:else}
      <button
        class="bcmsModal--header-addNewProp"
        on:click={() => {
          resetState();
        }}><span class="mr-10">&#9666;</span>
        <h2 class="bcmsModal--title">
          {selectedType
            .toLowerCase()
            .split('_')
            .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
            .join(' ')}
        </h2>
      </button>
    {/if}
  </div>
  <div class="bcmsModal--property customScrollbar">
    {#if stage === 0}
      <div>
        {#each types as propType}
          {#if !propType.hide}
            <button
              on:click={() => {
                selectedType = propType.value;
                next();
              }}
              class="bcmsModal--property-button mb-20"
              title={propType.desc}>
              <div class="bcmsModal--property-name mr-20">{propType.name}</div>
              <div class="bcmsModal--property-description">{propType.desc}</div>
            </button>
          {/if}
        {/each}
      </div>
    {:else}
      <div>
        <div class="bcmsModal--row">
          <TextInput
            label="Label"
            placeholder="Label"
            value={prop.label}
            invalidText={errors.name}
            on:input={(event) => {
              prop.label = event.detail;
            }} />
        </div>
        {#if selectedType === PropType.ENUMERATION}
          <div class="bcmsModal--row">
            <MultiAddInput
              label="Enumerations"
              placeholder="Type something and press Enter key"
              invalidText={errors.enum}
              formater={(value) => {
                return GeneralService.string.toEnum(value);
              }}
              validate={(items) => {
                if (items
                    .splice(0, items.length - 1)
                    .includes(items[items.length - 1])) {
                  return `Enumeration with name "${items[items.length - 1]}" is already added.`;
                }
              }}
              on:update={(event) => {
                addEnumItems(event.detail);
              }} />
          </div>
        {:else if selectedType === PropType.GROUP_POINTER}
          <div class="bcmsModal--row">
            <SelectGroupPointer
              selected={groupPointerSelected}
              invalidText={errors.groupPointer}
              exclude={excludeGroups}
              on:select={(event) => {
                groupPointerSelected = event.detail;
              }} />
          </div>
        {:else if selectedType === PropType.ENTRY_POINTER}
          <div class="bcmsModal--row">
            <SelectEntryPointer
              selected={entryPointerSelected}
              invalidText={errors.entryPointer}
              on:select={(event) => {
                entryPointerSelected = event.detail;
              }} />
          </div>
        {/if}
        {#if selectedType !== PropType.GROUP_POINTER}
          <div class="bcmsModal--row">
            <ToggleInput
              value={prop.required}
              label="Required"
              states={['Yes', 'No']}
              on:input={(event) => {
                prop.required = event.detail;
              }} />
          </div>
        {/if}
        {#if prop.type !== PropType.ENUMERATION && prop.type !== PropType.RICH_TEXT}
          <div class="bcmsModal--row">
            <ToggleInput
              value={prop.array}
              label="Array"
              states={['Yes', 'No']}
              on:input={(event) => {
                prop.array = event.detail;
              }} />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</Modal>
