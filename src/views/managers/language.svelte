<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { GeneralService, LanguageService, sdk } from '../../services';
  import { Select, SelectItem, Button } from '../../components';
  import type { Language } from '@becomes/cms-sdk';

  let languages: Language[] = [];
  let languageCode = {
    value: '',
    error: '',
  };

  async function addLanguage() {
    if (languageCode.value === '') {
      languageCode.error = 'Please select a language to add.';
      return;
    }
    languageCode.error = '';
    const isoLanguage = LanguageService.get(languageCode.value);
    await GeneralService.errorWrapper(
      async () => {
        return await sdk.language.add(isoLanguage);
      },
      async (value: Language) => {
        languages = [...languages, value];
      }
    );
  }
  async function removeLanguage(lang: Language) {
    if (confirm('Are you sure you want to delete the language.')) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.language.deleteById(lang._id);
        },
        async () => {
          languages = languages.filter((e) => e._id !== lang._id);
        }
      );
    }
  }

  onMount(async () => {
    languages = await sdk.language.getAll();
    if (languages.length === 0) {
      let language = await sdk.language.add(LanguageService.get('en'));
      language = await sdk.language.update({
        _id: language._id,
        def: true,
      });
      languages = [language];
    }
  });
</script>

<div in:fade={{ delay: 250 }} out:fade={{ duration: 200 }} class="lm">
  <h3>Languages</h3>
  <div class="mt--20 add">
    <Select
      label="Select a language"
      invalidText={languageCode.error}
      on:change={(event) => {
        languageCode.value = event.detail;
      }}>
      <SelectItem text="Select one" value="" />
      {#each LanguageService.getAll() as isoLang}
        <SelectItem
          text="{isoLang.name} | {isoLang.nativeName}"
          value={isoLang.code} />
      {/each}
    </Select>
    <Button
      class="mt--20"
      icon="fas fa-plus"
      on:click={() => {
        addLanguage();
      }}>
      Add language
    </Button>
  </div>
  <div class="added">
    {#each languages as lang}
      <div class="item">
        <div class="name mt--auto mb--auto">
          {lang.name} | {lang.nativeName}
        </div>
        {#if !lang.def}
          <Button
            class="ml--auto"
            kind="ghost"
            onlyIcon={true}
            icon="fas fa-times"
            on:click={() => {
              removeLanguage(lang);
            }} />
        {/if}
      </div>
    {/each}
  </div>
</div>
