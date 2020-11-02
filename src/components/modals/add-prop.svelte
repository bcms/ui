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
  import { slide } from 'svelte/transition';
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
  import { StoreService, GeneralService, sdk, popup } from '../../services';
  import Modal from './modal.svelte';
  import {
    TextInput,
    ToggleInput,
    SelectGroupPointer,
    SelectEntryPointer,
    MultiAddInput,
  } from '../input';

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
  let templateForDisProp: Template;
  let entryPointerSelectedDisplayProp: string = 'title';
  let groupPointerSelected: string;
  let entryPointerSelected: string;
  let errors = {
    name: '',
    enum: '',
    groupPointer: '',
    entryPointer: '',
  };

  function close() {
    setTimeout(() => {
      StoreService.update(name, false);
    }, 200);
    setTimeout(() => {
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
      groupPointerSelected = undefined;
      entryPointerSelected = undefined;
      templateForDisProp = undefined;
      errors = {
        name: '',
        enum: '',
        groupPointer: '',
        entryPointer: '',
      };
    }, 500);
  }
  function cancel() {
    dispatch('cancel');
    close();
  }
  function done() {
    if (stage === 0) {
      next();
      return;
    } else if (stage === 1) {
      if (prop.label.replace(/ /g, '') === '') {
        errors.name = 'Name input cannot be empty.';
        return;
      }
      errors.name = '';
      if (prop.type === 'ENUMERATION') {
        const value = prop.value as PropEnum;
        if (value.items.length === 0) {
          errors.enum = 'At least 1 item must be provided.';
          return;
        }
        errors.enum = '';
      } else if (prop.type === PropType.GROUP_POINTER) {
        if (!groupPointerSelected) {
          errors.groupPointer = 'Please select a group.';
          return;
        }
        errors.groupPointer = '';
        const group = groups.find((e) => e._id === groupPointerSelected);
        if (!group) {
          console.error('groups', groups, 'selected', groupPointerSelected);
          popup.error('Failed to find a group.');
          return;
        }
        const value: PropGroupPointer = {
          _id: group._id,
          items: [{ props: group.props }],
        };
        prop.value = value;
      } else if (prop.type === PropType.ENTRY_POINTER) {
        if (!entryPointerSelected) {
          errors.entryPointer = 'Please select a template.';
          return;
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
    dispatch('done', JSON.parse(JSON.stringify(prop)));
    close();
  }
  function next() {
    switch (stage) {
      case 0: {
        if (!selectedType) {
          popup.error('You must select a type.');
          return;
        }
        switch (selectedType) {
          case 'STRING':
            {
              prop.type = PropType.STRING;
              prop.value = [''];
            }
            break;
          case 'NUMBER':
            {
              prop.type = PropType.NUMBER;
              prop.value = [0];
            }
            break;
          case 'BOOLEAN':
            {
              prop.type = PropType.BOOLEAN;
              prop.value = [false];
            }
            break;
          case 'DATE':
            {
              prop.type = PropType.DATE;
              prop.value = [0];
            }
            break;
          case 'ENUMERATION':
            {
              prop.type = PropType.ENUMERATION;
              (prop.value as PropEnum) = {
                items: [],
                selected: '',
              };
            }
            break;
          case 'MEDIA':
            {
              prop.type = PropType.MEDIA;
              prop.value = [''];
            }
            break;
          case 'GROUP_POINTER':
            {
              prop.type = PropType.GROUP_POINTER;
              const value: PropGroupPointer = {
                _id: '',
                items: [],
              };
              prop.value = value;
            }
            break;
          case 'ENTRY_POINTER':
            {
              prop.type = PropType.ENTRY_POINTER;
              const value: PropEntryPointer = {
                entryIds: [],
                displayProp: 'title',
                templateId: '',
              };
              prop.value = value;
            }
            break;
          case 'RICH_TEXT': {
            prop.type = PropType.RICH_TEXT;
            const value: PropQuill = {
              ops: [],
              text: '',
            };
            prop.value = value;
          }
        }
        stage = stage + 1;
        return;
      }
    }
  }
  function addEnumItems(items: string[]) {
    (prop.value as PropEnum).items = items;
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
    templates = await GeneralService.errorWrapper(
      async () => {
        return await sdk.template.getAll();
      },
      async (value: Group[]) => {
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
  title="Add new property"
  on:cancel={cancel}
  on:done={done}>
  <div class="modal--add-prop">
    {#if stage === 0}
      <div out:slide={{ duration: 300 }}>
        <h4>Selete a property type</h4>
        <div class="modal--add-prop-types">
          {#each types as propType}
            {#if !propType.hide}
              <button
                on:click={() => {
                  selectedType = propType.value;
                  next();
                }}>
                <div class="name">{propType.name}</div>
                <div class="desc">{propType.desc}</div>
              </button>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <div in:slide={{ duration: 300 }}>
        <h4>Property information</h4>
        <TextInput
          class="mt--20"
          label="Label"
          placeholder="Label"
          value={prop.label}
          invalidText={errors.name}
          on:input={(event) => {
            prop.label = event.detail;
          }} />
        {#if selectedType === PropType.ENUMERATION}
          <MultiAddInput
            class="mt--20"
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
        {:else if selectedType === PropType.GROUP_POINTER}
          <SelectGroupPointer
            class="mt--20"
            selected={groupPointerSelected}
            invalidText={errors.groupPointer}
            on:select={(event) => {
              groupPointerSelected = event.detail;
            }} />
        {:else if selectedType === PropType.ENTRY_POINTER}
          <SelectEntryPointer
            class="mt--20"
            invalidText={errors.entryPointer}
            on:select={(event) => {
              entryPointerSelected = event.detail;
              templateForDisProp = templates.find((e) => e._id === entryPointerSelected);
            }} />
        {/if}
        <p class="bcmsInput--label mt--20">Required</p>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="checkboxLabel">
          <ToggleInput
            on:input={(event) => {
              prop.required = event.detail;
            }} />
          <span
            class="checkboxLabel--textContent ml--10">{prop.required ? 'Yes' : 'No'}</span>
        </label>
        {#if prop.type !== PropType.ENUMERATION}
          <p class="bcmsInput--label mt--20">Array</p>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="checkboxLabel">
            <ToggleInput
              on:input={(event) => {
                prop.array = event.detail;
              }} />
            <span
              class="checkboxLabel--textContent ml--10">{prop.array ? 'Yes' : 'No'}</span>
          </label>
        {/if}
      </div>
    {/if}
  </div>
</Modal>
