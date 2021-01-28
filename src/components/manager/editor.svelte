<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import type {
    Group,
    Prop,
    PropEntryPointer,
    PropGroupPointer,
    Template,
  } from '@becomes/cms-sdk';

  import {
    GeneralService,
    StoreService,
    TooltipService,
    cy,
    KeyboardService,
  } from '../../services';
  import { OverflowMenu, OverflowMenuItem } from '../overflow';
  import Link from '../link.svelte';
  import { EditPropModal } from '../modals';
  import Button from '../button.svelte';
  import { LinkIcon, LockIcon, UnlockIcon } from '../icons';

  export let sourceComponent: 'template' | 'widget' | 'group' = 'widget';
  export let props: Prop[] = [];
  export let whereIsItUsed: boolean = false;

  const dispatch = createEventDispatcher();
  const keyboardUnsub = KeyboardService.subscribe(['p', 'd'], async (event) => {
    switch (event.key) {
      case 'p':
        {
          dispatch('add');
        }
        break;
      case 'd':
        {
          dispatch('deleteEntity');
        }
        break;
    }
  });
  const groupStoreUnsub = StoreService.subscribe(
    'group',
    async (value?: Group[]) => {
      if (value) {
        groups = value;
      }
    }
  );
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value?: Template[]) => {
      if (value) {
        templates = value;
      }
    }
  );
  let targetPropForEdit: Prop;
  let tooltip = TooltipService.bind('');
  let groups: Group[] = [];
  let templates: Template[] = [];

  function getGroupId(prop: Prop): string {
    return (prop.value as PropGroupPointer)._id;
  }
  function getGroupLabel(prop: Prop): string {
    const group = groups.find(
      (e) => e._id === (prop.value as PropGroupPointer)._id
    );
    return group ? group.label : 'Loading ...';
  }
  function getTemplateId(prop: Prop): string {
    return (prop.value as PropEntryPointer).templateId;
  }
  function getTemplateLabel(prop: Prop): string {
    const template = templates.find(
      (e) => e._id === (prop.value as PropEntryPointer).templateId
    );
    return template ? template.label : 'Loading ...';
  }
  function getManagerName(): string {
    return window.location.pathname.split('/')[2];
  }

  function getTooltipMessage(prop: Prop) {
    return prop.array
      ? GeneralService.string.toPretty(prop.type) + ' Array'
      : GeneralService.string.toPretty(prop.type);
  }

  onDestroy(() => {
    keyboardUnsub();
    groupStoreUnsub();
    templateStoreUnsub();
  });
</script>

<div class="managerPropsEditor">
  <div class="managerPropsEditor--top managerPropsEditor--cols">
    <div class="managerPropsEditor--top-buttons">
      <Button
        cyTag="add-prop-button"
        class="mr-10"
        on:click={() => {
          dispatch('add');
        }}>
        Add property
      </Button>
      <Button
        cyTag="delete-manager-button"
        class="mr-10"
        kind="danger"
        on:click={() => {
          dispatch('deleteEntity');
        }}>
        Delete
        {getManagerName()}
      </Button>
      {#if whereIsItUsed}
        <Button
          cyTag="where-is-it-used-button"
          kind="ghost"
          on:click={() => {
            dispatch('search');
          }}>
          <span>See where is it used</span>
        </Button>
      {/if}
    </div>
    <p class="managerPropsEditor--top-propsCount">
      {props.length || 'No'}
      properties in this
      <span class="managerPropsEditor--top-managerName">
        {getManagerName()}
      </span>
    </p>
  </div>
  <div class="managerPropsEditor--bottom">
    {#if props.length > 0}
      <ul class="managerPropsEditor--list">
        <li class="managerPropsEditor--list-item managerPropsEditor--cols">
          <div class="managerPropsEditor--list-label">
            <span />
            <span>Label</span>
          </div>
          <div class="managerPropsEditor--list-name">Name</div>
          <div class="managerPropsEditor--list-type"><span>Type</span></div>
        </li>
        {#each props as prop, propIndex}
          <li class="managerPropsEditor--list-item managerPropsEditor--cols">
            <div
              class="managerPropsEditor--list-label
                managerPropsEditor--list-item-col"
              data-column-name="Label"
              title={prop.label}>
              <span use:cy={prop.required ? 'required' : 'not-required'}>
                {#if prop.required}
                  <LockIcon />
                {:else}
                  <UnlockIcon />
                {/if}
              </span>
              <span>{prop.label}</span>
            </div>
            <div
              class="managerPropsEditor--list-name
                managerPropsEditor--list-item-col"
              data-column-name="Name"
              title={prop.name}>
              {prop.name}
            </div>
            <div
              class="managerPropsEditor--list-type
                managerPropsEditor--list-item-col {prop.type === 'GROUP_POINTER' || prop.type === 'ENTRY_POINTER' ? 'managerPropsEditor--list-type_link' : ''}"
              data-column-name="Type">
              {#if prop.type === 'GROUP_POINTER' && groups.length > 0}
                <Link href="/dashboard/group/editor/{getGroupId(prop)}">
                  <LinkIcon />
                  <span
                    use:tooltip={{ message: getTooltipMessage(prop) }}>{getGroupLabel(prop)}</span>
                </Link>
              {:else if prop.type === 'ENTRY_POINTER' && templates.length > 0}
                <Link href="/dashboard/template/editor/{getTemplateId(prop)}">
                  <LinkIcon />
                  <span
                    use:tooltip={{ message: getTooltipMessage(prop) }}>{getTemplateLabel(prop)}</span>
                </Link>
              {:else}
                <span>{GeneralService.string.toPretty(prop.type)}</span>
                <span class="ml-5">{prop.array ? 'Array' : ''} </span>
              {/if}
            </div>
            {#if !['title', 'slug'].includes(prop.name) || sourceComponent !== 'template'}
              <OverflowMenu cyTag="prop-overflow" position="right">
                {#if props.length > 1 && sourceComponent === 'template' ? propIndex !== 2 : propIndex !== 0}
                  <OverflowMenuItem
                    cyTag="prop-overflow-mu"
                    text="Move up"
                    icon="arrow-up"
                    on:click={() => {
                      dispatch('edit', {
                        move: -1,
                        name: prop.name,
                        label: prop.label,
                        required: prop.required,
                      });
                    }} />
                {/if}
                {#if propIndex !== props.length - 1}
                  <OverflowMenuItem
                    cyTag="prop-overflow-md"
                    text="Move down"
                    icon="arrow-down"
                    on:click={() => {
                      dispatch('edit', {
                        move: 1,
                        name: prop.name,
                        label: prop.label,
                        required: prop.required,
                      });
                    }} />
                {/if}
                <OverflowMenuItem
                  cyTag="prop-overflow-edit"
                  text="Edit"
                  icon="edit"
                  on:click={() => {
                    targetPropForEdit = prop;
                    StoreService.update('EditPropModal', true);
                  }} />
                <OverflowMenuItem
                  cyTag="prop-overflow-del"
                  text="Delete"
                  icon="trash"
                  on:click={() => {
                    dispatch('deleteProp', prop);
                  }} />
              </OverflowMenu>
            {:else}
              <div />
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <div class="managerPropsEditor--empty">
        Click "Add property" to start building this
        {getManagerName()}
      </div>
    {/if}
  </div>
</div>
<EditPropModal
  prop={targetPropForEdit}
  on:done={(event) => {
    dispatch('edit', {
      move: 0,
      name: targetPropForEdit.name,
      ...event.detail,
    });
  }} />
