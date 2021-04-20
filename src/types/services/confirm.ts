export type BCMSConfirmServicePrototype = (
  title: string,
  text: string,
  prompt?: string
) => Promise<boolean>;
