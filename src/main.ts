import App from './app.svelte';

const app = new App({
  target: document.body,
  props: {
    globalProps: {},
  },
  hydrate: true,
});

export default app;
