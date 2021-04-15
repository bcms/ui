export interface EntryFilterOption {
  label: string;
  dateCreated?: {
    year: number;
    month: number;
    day: number;
  };
  dateUpdated?: {
    year: number;
    month: number;
    day: number;
  };
}

export interface EntryFilterSearch {
  name: string;
}

export interface EntryFilter {
  search: EntryFilterSearch;
  isOpen: boolean;
  options: EntryFilterOption[];
}
