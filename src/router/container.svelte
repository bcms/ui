<script lang="ts">
  import { Router } from './core';

  let component: any;
  let props: any;
  let params: any;
  let data: any;

  Router.listen((_component, _params, _props, _options) => {
    console.log(_component);
    component = _component;
    params = _params;
    props = _props;
    data = _options ? _options.data : undefined;
  });

  Router.navigate(window.location.pathname);
</script>

{#if component}
  <svelte:component this={component} {props} {params} {data} />
{/if}
