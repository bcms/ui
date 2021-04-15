export interface BCMSErrorServicePrototype {
  wrapper<T, K>(
    throwable: () => Promise<T>,
    ifSuccess: (data: T) => Promise<K>,
    returnError?: boolean,
    errorAsWarning?: boolean
  ): Promise<K | undefined>;
}
