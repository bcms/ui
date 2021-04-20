export interface BCMSWhereIsItUsedItem {
  type: 'entry' | 'group' | 'widget' | 'template';
  label: string;
  id: string;
  template?: {
    id: string;
    label: string;
  }
}
