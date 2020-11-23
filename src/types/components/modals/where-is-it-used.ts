export interface WhereIsItUsedItem {
  type: 'entry' | 'group' | 'widget' | 'template';
  label: string;
  id: string;
  template?: {
    id: string;
    label: string;
  }
}
