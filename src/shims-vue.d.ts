/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  import { VueMixin } from "@/types";
  const component: DefineComponent<{}, {}, any>
  export default component
}
