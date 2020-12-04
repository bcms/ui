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
  import Button from '../button.svelte';

  export let excludeGroups: string[] = [];
  export let excludeTemplates: string[] = [];

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
  let entryPointerSelectedDisplayProp: string = 'title';
  let groupPointerSelected: string = '';
  let entryPointerSelected: string = '';
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
      resetState();
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
          NotificationService.error('Failed to find a group.');
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
          NotificationService.error('You must select a type.');
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
                entryIds: [''],
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

<Modal name="AddPropModal" on:cancel={cancel} class="bcmsModal_addProp">
  <div slot="header">
    {#if stage === 0}
      <h2 class="bcmsModal--title">Add new property</h2>
    {:else}
      <div class="bcmsModal--header">
        <button
          class="bcmsModal--header-addNewProp"
          on:click={() => {
            resetState();
          }}><span class="mr--10">&#9666;</span>
          <h2 class="bcmsModal--title bcmsModal--title_sm">Add new property</h2>
        </button>
      </div>
    {/if}
  </div>
  <div class="bcmsModal--property" data-simplebar>
    {#if stage === 0}
      <div out:slide={{ duration: 300 }}>
        {#each types as propType}
          {#if !propType.hide}
            <button
              on:click={() => {
                selectedType = propType.value;
                next();
              }}
              class="bcmsModal--property-button mb--20">
              <div class="bcmsModal--property-name mr--20">{propType.name}</div>
              <div class="bcmsModal--property-description">{propType.desc}</div>
            </button>
          {/if}
        {/each}
      </div>
    {:else}
      <div in:slide={{ duration: 300 }}>
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
              exclude={excludeTemplates}
              invalidText={errors.entryPointer}
              on:select={(event) => {
                entryPointerSelected = event.detail;
              }} />
          </div>
        {/if}
        <div class="bcmsModal--row">
          <p class="bcmsInput--label">Required</p>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="checkboxLabel">
            <ToggleInput
              on:input={(event) => {
                prop.required = event.detail;
              }} />
            <span
              class="checkboxLabel--textContent ml--10">{prop.required ? 'Yes' : 'No'}</span>
          </label>
        </div>
        {#if prop.type !== PropType.ENUMERATION && prop.type !== PropType.RICH_TEXT}
          <div class="bcmsModal--row">
            <p class="bcmsInput--label">Array</p>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="checkboxLabel">
              <ToggleInput
                on:input={(event) => {
                  prop.array = event.detail;
                }} />
              <span
                class="checkboxLabel--textContent ml--10">{prop.array ? 'Yes' : 'No'}</span>
            </label>
          </div>
        {/if}
        <div class="bcmsModal--row bcmsModal--row_submit">
          <Button on:click={done}><span>Add</span></Button>
          <Button kind="ghost" on:click={close}>Cancel</Button>
        </div>
      </div>
    {/if}
  </div>
</Modal>
