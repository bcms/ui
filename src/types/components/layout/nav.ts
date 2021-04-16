export interface BCMSNavItemType {
  type: 'parent' | 'child';
  name: string;
  visible: boolean;
  selected: boolean;
  ignoreSelected?: boolean;
  icon?: string;
  onClick?: string | (() => void);
  children?: BCMSNavItemType[];
}
