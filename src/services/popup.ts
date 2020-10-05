export const popup = {
  info: (content: string) => {},
  success: (content: string) => {},
  error: (content: string) => {},
  hide: () => {},
  remove: (id: string) => {},
  push: (type: MessageType, content: string) => {},
};
export type MessageType = 'error' | 'success';