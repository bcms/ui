export interface BCMSGeneralServicePrototype {
  query(): { [key: string]: string };
  addZerosAtBeginning(num: number, count?: number): string;
  date: {
    prettyElapsedTimeSince(millis: number): string;
    toReadable(millis: number): string;
  };
  string: {
    toPretty(s: string): string;
    toUri(s: string): string;
    toUriLowDash(s: string): string;
    toEnum(s: string): string;
    toShort(s: string, length: number): string;
    textBetween(src: string, begin: string, end: string): string;
    allTextBetween(src: string, begin: string, end: string): string[];
  };
  objectInstance<T>(o: T): T;
}
