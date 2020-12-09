export interface RouterPrototype {
  navigate(
    path: string,
    options: {
      replace: boolean;
    }
  ): void;
}
