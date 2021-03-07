<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import * as uuid from 'uuid';
  import { Uppy } from '@uppy/core';
  import type { UppyFile } from '@uppy/core';
  import UppyDashboard from '@uppy/dashboard';
  import UppyImageEditor from '@uppy/image-editor';
  import { StoreService } from '../../../services';
  import Modal from '../modal.svelte';

  const modalName = 'MediaUploaderModal';
  const id = uuid.v4();
  let uppy: Uppy;
  let selfUnsub: () => void = () => {};
  let onDone: (files: UppyFile[]) => Promise<void>;
  let onCancel: () => Promise<void>;

  function close() {
    StoreService.update(modalName, {
      show: false,
    });
    uppy.cancelAll();
  }
  function cancel() {
    if (typeof onCancel === 'function') {
      onCancel().catch((error) => {
        console.error(error);
      });
    }
    close();
  }
  function done() {
    if (typeof onDone === 'function') {
      onDone(uppy.getFiles()).catch((error) => {
        console.error(error);
      });
    }
    close();
  }

  onMount(() => {
    selfUnsub = StoreService.subscribe(
      modalName,
      async (value: { show: boolean; onDone: any; onCancel: any }) => {
        onDone = value.onDone;
        onCancel = value.onCancel;
      }
    );
    const element = document.getElementById(id);
    if (!uppy && element) {
      uppy = new Uppy()
        .use(UppyDashboard, {
          inline: true,
          target: element,
          hideUploadButton: true,
        })
        .use(UppyImageEditor, {
          target: UppyDashboard,
          quality: 0.8,
        });
    }
  });
  onDestroy(() => {
    selfUnsub();
    if (uppy) {
      uppy.cancelAll();
      uppy.close();
    }
  });
</script>

<Modal title="Upload media" name={modalName} on:cancel={cancel} on:done={done}>
  <div {id} class="bcmsUppy" />
</Modal>
