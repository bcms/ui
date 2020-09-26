<script lang="ts">
  export {className as class};
  export let progress: number = 20;

  let className = '';
</script>

<div class="progress-bar {className}">
  <div
    class="progress-bar--fill"
    style="width: {progress < 0 ? 0 : progress > 100 ? 100 : progress}%;" />
</div>
