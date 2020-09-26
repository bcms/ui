<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher } from 'svelte';
  import { popup } from '../popup.svelte';

  export { className as class };
  export let id: string = uuid.v4();
  export let invalidText = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let showMessage = true;
  let fileOver = false;
  let thumbnail = '';

  async function setThumbnail(file: File) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnail = reader.result as string;
        resolve();
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
  async function handleFiles(fileList: FileList) {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i = i + 1) {
      files.push(fileList.item(i));
    }
    const imageFile = files.find((e) => e.type.startsWith('image'));
    if (imageFile) {
      try {
        await setThumbnail(imageFile);
      } catch (error) {
        console.error(error);
        popup.error(
          'Some error occurred while parsing. See console for more information.'
        );
        return;
      }
    }
    showMessage = false;
    dispatch('input', files);
  }
</script>

<div class="input {className}">
  {#if invalidText}
    <div class="input--invalid">
      <span class="fas fa-exclamation icon" />
      {invalidText}
    </div>
  {/if}
  <div
    class="input--file {fileOver ? 'input--file-over' : ''}"
    on:dragover={(event) => {
      event.preventDefault();
      fileOver = true;
    }}
    on:dragend={() => {
      fileOver = false;
    }}
    on:dragleave={() => {
      fileOver = false;
    }}
    on:drop={(event) => {
      event.preventDefault();
      fileOver = false;
      handleFiles(event.dataTransfer.files);
    }}
    on:click={() => {
      document.getElementById(id).click();
    }}>
    {#if showMessage}
      <span class="input--file-message">Drag and drop file or click to upload</span>
    {:else if thumbnail}
      <img src={thumbnail} alt="thumbnail" />
    {:else}
      <div class="fas fa-file input--file-thumb-default" />
    {/if}
    <input
      {id}
      type="file"
      name="file"
      on:change={(event) => {
        handleFiles(event.target.files);
      }} />
  </div>
</div>
