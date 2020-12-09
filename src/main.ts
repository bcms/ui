import App from './app.svelte';

declare global {
  interface Window {
    dev?: boolean | string;
  }
}

const app = new App({
  target: document.body,
  props: {
    globalProps: {},
  },
  hydrate: true,
});

export default app;
