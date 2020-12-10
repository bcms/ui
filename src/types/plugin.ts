export type BCMSPlugin<T> = {
  originalName: string;
  displayName: string;
  path: string;
  icon?: string;
  component: string;
  props: T;
};

export type BCMSPluginNavItem = {
  label: string;
  name: string;
  icon?: string;
  link: string;
};
