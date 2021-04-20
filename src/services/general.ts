import { BCMSGeneralServicePrototype } from '../types';

export function BCMSGeneralService() {
  const self: BCMSGeneralServicePrototype = {
    string: {
      toPretty(s) {
        if (s.indexOf('_') !== -1) {
          return s
            .split('_')
            .map((e) => {
              return (
                e.substring(0, 1).toUpperCase() +
                e.substring(1, e.length).toLowerCase()
              );
            })
            .join(' ');
        } else {
          return s
            .split('-')
            .map((e) => {
              return (
                e.substring(0, 1).toUpperCase() +
                e.substring(1, e.length).toLowerCase()
              );
            })
            .join(' ');
        }
      },
      toUri(s) {
        return s
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/_/g, '-')
          .replace(/[^0-9a-z---]+/g, '');
      },
      toUriLowDash(s) {
        return s
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^0-9a-z_-_]+/g, '');
      },
      toEnum(s) {
        return s
          .toUpperCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^0-9A-Z_-_]+/g, '');
      },
      toShort(s, length) {
        if (s.length > length) {
          const d = s.length - length;
          const firstPart = s.substring(0, s.length / 2 - d / 2);
          const lastPart = s.substring(s.length / 2 + d / 2);
          return firstPart + ' ... ' + lastPart;
        }
        return s;
      },
      textBetween(src, begin, end) {
        const startIndex = src.indexOf(begin);
        if (startIndex === -1) {
          return '';
        }
        const endIndex = src.indexOf(end, startIndex + begin.length);
        if (endIndex === -1) {
          return '';
        }
        return src.substring(startIndex + begin.length, endIndex);
      },
      allTextBetween(src, begin, end) {
        const output: string[] = [];
        const index = {
          begin: src.indexOf(begin, 0),
          end: 0,
        };
        if (index.begin === -1) {
          return [];
        }
        index.end = src.indexOf(end, index.begin);
        if (index.end === -1) {
          return [];
        }
        output.push(src.substring(index.begin + begin.length, index.end));
        // eslint-disable-next-line no-constant-condition
        while (true) {
          index.begin = src.indexOf(begin, index.end);
          if (index.begin === -1) {
            break;
          }
          index.end = src.indexOf(end, index.begin);
          if (index.end === -1) {
            break;
          }
          output.push(src.substring(index.begin + begin.length, index.end));
        }
        return output;
      },
    },
    query() {
      const queries: {
        [key: string]: string;
      } = {};
      const queryString = window.location.href.split('?');
      if (queryString.length === 2) {
        const queryParts = queryString[1].split('&');
        for (const i in queryParts) {
          const query = queryParts[i].split('=');
          if (query.length === 2) {
            queries[query[0]] = decodeURIComponent(query[1]);
          } else {
            console.error('Bad query: ' + queryParts[i]);
          }
        }
      }
      return queries;
    },
    addZerosAtBeginning(num, count) {
      return `${num}`.padStart(count ? count : 2, '0');
    },
    date: {
      prettyElapsedTimeSince(millis) {
        const timeDiff = Math.abs(Date.now() - millis);
        const days = parseInt(`${timeDiff / 86400000}`);
        if (days > 30) {
          return self.date.toReadable(millis);
        }
        const hours = parseInt(`${timeDiff / 3600000}`);
        const minutes = parseInt(`${timeDiff / 60000}`);
        if (days > 0) {
          return `${days} days ago`;
        } else if (hours > 0) {
          return `${hours} hours ago`;
        } else if (minutes > 0) {
          return `${minutes} minutes ago`;
        } else {
          return `just now`;
        }
      },
      toReadable(millis) {
        const months: string[] = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        const date = new Date(millis);
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${months[month]}, ${year} ${self.addZerosAtBeginning(
          hours
        )}:${self.addZerosAtBeginning(minutes)}`;
      },
    },
  };
  return self;
}
