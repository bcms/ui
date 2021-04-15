import { BCMSErrorServicePrototype } from '@/types';

function errorService() {
  const self: BCMSErrorServicePrototype = {
    async wrapper<T, K>(
      throwable: () => Promise<T>,
      ifSuccess: (data: T) => Promise<K>,
      returnError?: boolean,
      errorAsWarning?: boolean
    ): Promise<K | undefined> {
      let output: T;
      try {
        output = await throwable();
      } catch (error) {
        if (returnError) {
          return error;
        }
        console.error(error);
        if (error.status && error.status === 401) {
          // self.navigate(`/`);
        } else {
          if (error) {
            if (errorAsWarning) {
              window.bcms.services.notification.warning(error.message);
            } else {
              window.bcms.services.notification.error(error.message);
            }
          }
        }
        return;
      }
      return await ifSuccess(output);
    },
  };
  return self;
}

export const BCMSErrorService = errorService();
