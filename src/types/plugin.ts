export type BCMSPlugin = {
  originalName: string;
  displayName: string;
  path: string;
  icon?: string;
  component: string;
  props: any;
};

export type BCMSPluginNavItem = {
  label: string;
  name: string;
  icon?: string;
  link: string;
};
