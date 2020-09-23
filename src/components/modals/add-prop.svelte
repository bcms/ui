<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { Group, Prop, PropType, Template } from '@becomes/cms-sdk';
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
  let entryPointerDisplayProps: Array<{
    name: string;
    value: string;
  }>;
  let entryPointerSelectedDisplayProp: string = 'main_title';
  let groupPointerSelected: string;
  let entryPointerSelected: string;
  let selectedArrayType: string;

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
      entryPointerDisplayProps = undefined;
      entryPointerSelectedDisplayProp = 'main_title';
      groupPointerSelected = undefined;
      entryPointerSelected = undefined;
      selectedArrayType = undefined;
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
        stage = stage + 1;
        return;
      }
    }
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
          on:input={(event) => {
            prop.name = GeneralService.string.toUriLowDash(event.detail);
          }} />
        {#if selectedType !== 'ARRAY'}
          {#if selectedType === 'GROUP_POINTER'}
            <SelectGroupPointer
              class="mt--20"
              selected={groupPointerSelected}
              on:select={(event) => {
                groupPointerSelected = event.detail;
              }} />
          {:else if selectedType === 'ENTRY_POINTER'}
            <SelectEntryPointer
              class="mt--20"
              on:select={(event) => {
                entryPointerSelected = event.detail;
              }} />
            {#if entryPointerSelected}
              <SelectEntryPointerDisplayProp
                class="mt--20"
                template={templates.find((e) => e._id === entryPointerSelected)}
                on:select={(event) => {
                  entryPointerSelectedDisplayProp = event.detail;
                }} />
            {/if}
            <!-- <Select
              class="mt--20"
              label="Select a template"
              on:change={(event) => {
                if (event.detail === '') {
                  entryPointerDisplayProps = undefined;
                  entryPointerSelectedDisplayProp = 'main_title';
                  return;
                }
                const template = templates.find((e) => e._id === event.detail);
                if (!template) {
                  popup.error('Cannot find template. See console for more details');
                  console.error(`Template with ID "${event.detail}" does not exist`);
                  return;
                }
                entryPointerDisplayProps = template.entryTemplate
                  .filter((e) => e.type === 'STRING')
                  .map((tempProps) => {
                    return { name: GeneralService.string.toPretty(tempProps.name), value: tempProps.name };
                  });
              }}>
              <SelectItem selected={true} text="Select one" value="" />
              {#each templates as template}
                <SelectItem
                  text={GeneralService.string.toPretty(template.name)}
                  value={template._id} />
              {/each}
            </Select> -->
            {#if entryPointerDisplayProps}
              <Select
                class="mt--20"
                label="Select a display property"
                on:change={(event) => {
                  entryPointerDisplayProps = event.detail;
                }}>
                <SelectItem selected={true} text="Title" value="main_title" />
                {#each entryPointerDisplayProps as prop}
                  <SelectItem text={prop.name} value={prop.name} />
                {/each}
              </Select>
            {/if}
          {/if}
        {:else}
          <Select
            class="mt--20"
            label="Select an array type"
            on:change={(event) => {
              selectedArrayType = event.detail;
            }}>
            <SelectItem selected={true} text="Select one" value="" />
            {#each arrayTypes as type}
              <SelectItem text={type.name} value={type.value} />
            {/each}
          </Select>
          {#if selectedArrayType}
            {#if selectedArrayType === 'GROUP_POINTER_ARRAY'}
              <SelectGroupPointer
                class="mt--20"
                selected={groupPointerSelected}
                on:select={(event) => {
                  groupPointerSelected = event.detail;
                }} />
            {:else if selectedArrayType === 'ENTRY_POINTER_ARRAY'}{/if}
          {/if}
        {/if}
        <ToggleInput class="mt--20" label="Required" />
      </div>
    {/if}
  </div>
</Modal>
