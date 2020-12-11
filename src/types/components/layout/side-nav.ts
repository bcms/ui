export interface SideNavItemType {
  type: 'parent' | 'child';
  name: string;
  visible: boolean;
  selected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  onClick?: string | (() => void);
  children?: SideNavItemType[];
}
