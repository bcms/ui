export interface Plugin {
  displayName: string;
  path: string;
  icon?: string;
  component: string;
  props: any;
}

export interface PluginNavItem {
  name: string;
  icon?: string;
  link: string;
}
