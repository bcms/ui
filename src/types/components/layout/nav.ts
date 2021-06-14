export interface BCMSNavItemType {
  type: 'parent' | 'child';
  name: string;
  visible: boolean;
  selected: boolean;
  ignoreSelected?: boolean;
  icon?: string;
  onClick?: string | ((event?: Event) => void);
  children?: BCMSNavItemType[];
}
