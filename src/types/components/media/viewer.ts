export interface MediaViewFilterOption {
  label: string;
  value: string;
}

export interface MediaViewFilter {
  label: string;
  type: 'dropdown';
  options: MediaViewFilterOption[];
  value: MediaViewFilterOption;
}