export interface BCMSPropsCheckerServicePrototype {
  register(checker: () => boolean): () => void;
  check(): boolean;
}
