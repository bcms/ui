export type BCMSPlugin = {
  displayName: string;
  path: string;
  icon?: string;
  component: string;
  props: any;
};

export type BCMSPluginNavItem = {
  name: string;
  icon?: string;
  link: string;
};