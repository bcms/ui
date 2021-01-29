export interface StatusUpdateData {
  _id?: string;
  color: string;
  label: string;
  type: 'create' | 'update' | 'remove';
}
