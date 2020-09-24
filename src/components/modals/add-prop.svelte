<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import {
    Group,
    Prop,
    PropEntryPointer,
    PropEntryPointerArray,
    PropEnum,
    PropGroupPointer,
    PropGroupPointerArray,
    PropType,
    Template,
  } from '@becomes/cms-sdk';
  import { StoreService, GeneralService, sdk } from '../../services';
  import Modal from './modal.svelte';
  import { popup } from '../popup.svelte';
  import {
    TextInput,
    ToggleInput,
    Select,
    SelectItem,
    SelectGroupPointer,
    SelectEntryPointer,
    SelectEntryPointerDisplayProp,
    MultiAddInput,
  } from '../input';

  const dispatch = createEventDispatcher();
  const name = 'AddPropModal';
  const types: Array<{
    name: string;
    desc: string;
    value: string;
  }> = [
    {
      name: 'String',
      desc: 'Any character array value.',
      value: PropType.STRING,
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
    },
    {
      name: 'Entry Pointer',
      desc: 'Extend properties of an entry.',
      value: PropType.ENTRY_POINTER,
    },
    {
      name: 'Array',
      desc: 'Sequence of elements.',
      value: 'ARRAY',
    },
  ];
  const arrayTypes: Array<{
    name: string;
    value: string;
  }> = [
    {
      name: 'String',
      value: PropType.STRING_ARRAY,
    },
    {
      name: 'Number',
      value: PropType.NUMBER_ARRAY,
    },
    {
      name: 'Boolean',
      value: PropType.BOOLEAN_ARRAY,
    },
    {
      name: 'Group pointer',
      value: PropType.GROUP_POINTER_ARRAY,
    },
    {
      name: 'Entry pointer',
      value: PropType.ENTRY_POINTER_ARRAY,
    },
  ];
  let prop: Prop = {
    name: '',
    required: false,
    type: PropType.BOOLEAN,
    value: false,
  };
  let stage = 0;
  let selectedType: string;
  let groups: Group[] = [];
  let templates: Template[] = [];
  let templateForDisProp: Template;
  let entryPointerSelectedDisplayProp: string = 'main_title';
  let groupPointerSelected: string;
  let entryPointerSelected: string;
  let selectedArrayType: string;
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
        name: '',
        required: false,
        type: PropType.BOOLEAN,
        value: false,
      };
      stage = 0;
      selectedType = undefined;
      entryPointerSelectedDisplayProp = 'main_title';
      groupPointerSelected = undefined;
      entryPointerSelected = undefined;
      selectedArrayType = undefined;
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
      if (prop.name.replace(/ /g, '') === '') {
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
      } else if (
        prop.type === PropType.GROUP_POINTER ||
        prop.type === PropType.GROUP_POINTER_ARRAY
      ) {
        if (!groupPointerSelected) {
          errors.groupPointer = 'Please select a group.';
          return;
        }
        errors.groupPointer = '';
        const group = groups.find((e) => e._id === groupPointerSelected);
        const value: PropGroupPointer = {
          _id: group._id,
          props: group.props,
        };
        prop.value = value;
        if (prop.type === 'GROUP_POINTER_ARRAY') {
          prop.type = PropType.GROUP_POINTER_ARRAY;
          (prop.value as PropGroupPointerArray).array = [];
        }
      } else if (
        prop.type === PropType.ENTRY_POINTER ||
        prop.type === PropType.ENTRY_POINTER_ARRAY
      ) {
        if (!entryPointerSelected) {
          errors.entryPointer = 'Please select a template.';
          return;
        }
        errors.entryPointer = '';
        const value: PropEntryPointer = {
          templateId: entryPointerSelected,
          displayProp: entryPointerSelectedDisplayProp,
          entryId: '',
        };
        prop.value = value;
        if (prop.type === 'ENTRY_POINTER_ARRAY') {
          prop.value.entryId = undefined;
          (prop.value as any).entryIds = [];
        }
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
              prop.value = '';
            }
            break;
          case 'NUMBER':
            {
              prop.type = PropType.NUMBER;
              prop.value = 0;
            }
            break;
          case 'BOOLEAN':
            {
              prop.type = PropType.BOOLEAN;
              prop.value = false;
            }
            break;
          case 'DATE':
            {
              prop.type = PropType.DATE;
              prop.value = 0;
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
              prop.value = '';
            }
            break;
          case 'GROUP_POINTER':
            {
              prop.type = PropType.GROUP_POINTER;
              const value: PropGroupPointer = {
                _id: '',
                props: [],
              };
              prop.value = value;
            }
            break;
          case 'ENTRY_POINTER':
            {
              prop.type = PropType.ENTRY_POINTER;
              const value: PropEntryPointer = {
                entryId: '',
                displayProp: 'main_title',
                templateId: '',
              };
              prop.value = value;
            }
            break;
          case 'ARRAY':
            {
              prop.type = PropType.STRING_ARRAY;
              prop.value = [];
            }
            break;
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
    groups = await sdk.group.getAll();
    templates = await sdk.template.getAll();
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
            <button
              on:click={() => {
                selectedType = propType.value;
                next();
              }}>
              <div class="name">{propType.name}</div>
              <div class="desc">{propType.desc}</div>
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <div in:slide={{ duration: 300 }}>
        <h4>Property information</h4>
        <TextInput
          class="mt--20"
          label="Name"
          placeholder="Name"
          value={prop.name}
          invalidText={errors.name}
          on:input={(event) => {
            prop.name = GeneralService.string.toUriLowDash(event.detail);
          }} />
        {#if selectedType !== 'ARRAY'}
          {#if selectedType === 'ENUMERATION'}
            <MultiAddInput
              class="mt--20"
              label="Enumerations"
              helperText="Type some value and press Enter key to add it."
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
          {:else if selectedType === 'GROUP_POINTER'}
            <SelectGroupPointer
              class="mt--20"
              selected={groupPointerSelected}
              invalidText={errors.groupPointer}
              on:select={(event) => {
                groupPointerSelected = event.detail;
              }} />
          {:else if selectedType === 'ENTRY_POINTER'}
            <SelectEntryPointer
              class="mt--20"
              invalidText={errors.entryPointer}
              on:select={(event) => {
                entryPointerSelected = event.detail;
                templateForDisProp = templates.find((e) => e._id === entryPointerSelected);
              }} />
            {#if templateForDisProp}
              <SelectEntryPointerDisplayProp
                class="mt--20"
                template={templateForDisProp}
                on:select={(event) => {
                  entryPointerSelectedDisplayProp = event.detail;
                }} />
            {/if}
          {/if}
        {:else}
          <Select
            class="mt--20"
            label="Select an array type"
            on:change={(event) => {
              selectedArrayType = event.detail;
              prop.type = event.detail;
            }}>
            {#each arrayTypes as type, i}
              <SelectItem
                selected={i === 0 ? true : false}
                text={type.name}
                value={type.value} />
            {/each}
          </Select>
          {#if selectedArrayType}
            {#if selectedArrayType === 'GROUP_POINTER_ARRAY'}
              <SelectGroupPointer
                class="mt--20"
                selected={groupPointerSelected}
                invalidText={errors.groupPointer}
                on:select={(event) => {
                  groupPointerSelected = event.detail;
                }} />
            {:else if selectedArrayType === 'ENTRY_POINTER_ARRAY'}
              <SelectEntryPointer
                class="mt--20"
                invalidText={errors.entryPointer}
                on:select={(event) => {
                  entryPointerSelected = event.detail;
                  templateForDisProp = templates.find((e) => e._id === entryPointerSelected);
                }} />
              {#if templateForDisProp}
                <SelectEntryPointerDisplayProp
                  class="mt--20"
                  template={templateForDisProp}
                  on:select={(event) => {
                    entryPointerSelectedDisplayProp = event.detail;
                  }} />
              {/if}
            {/if}
          {/if}
        {/if}
        <ToggleInput
          class="mt--20"
          label="Required"
          on:input={(event) => {
            prop.required = event.detail;
          }} />
      </div>
    {/if}
  </div>
</Modal>
