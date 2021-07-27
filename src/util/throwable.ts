import { Throwable } from '../types';

let throwable: Throwable;

export function useThrowable(): Throwable {
  if (!throwable) {
    throwable = async <ThrowableResult, OnSuccessResult, OnErrorResult>(
      throwableFn: () => Promise<ThrowableResult>,
      onSuccess?: (data: ThrowableResult) => Promise<OnSuccessResult>,
      onError?: (error: unknown) => Promise<OnErrorResult>
    ): Promise<OnSuccessResult | OnErrorResult> => {
      let output: ThrowableResult;
      try {
        output = await throwableFn();
      } catch (e) {
        if (onError) {
          return await onError(e);
        } else {
          // eslint-disable-next-line no-console
          console.error(e);
          if (e.message && e.message.indexOf('->') !== -1) {
            window.bcms.notification.error(e.message.split('->')[1]);
          } else {
            window.bcms.notification.error(e.message);
          }
          return e;
        }
      }
      if (onSuccess) {
        return await onSuccess(output);
      }
      return undefined as never;
    };
  }
  return throwable;
}
