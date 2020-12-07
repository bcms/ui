export interface MediaFilterOption {
  label: string;
  dropdown?: {
    items: Array<{
      label: string;
      value: string;
    }>;
    selected: {
      label: string;
      value: string;
    };
  };
  date?: {
    year: number;
    month: number;
    day: number;
  };
}

export interface MediaFilterSearch {
  name: string;
}

export interface MediaFilter {
  search: MediaFilterSearch;
  isOpen: boolean;
  options: MediaFilterOption[];
}
