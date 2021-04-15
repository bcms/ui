export type DateUtilPrototype = {
  readableDate(
    payloadDate: number
  ): {
    dateFormat: string;
    tooltipDateFormat: string;
  };
};