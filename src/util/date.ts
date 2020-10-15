export type DateUtilPrototype = {
  readableDate(
    payloadDate: number
  ): {
    dateFormat: string;
    tooltipDateFormat: string;
  };
};

function dateUtil(): DateUtilPrototype {
  return {
    readableDate(payloadDate) {
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

      const milliseconds = new Date().getTime();
      const diff = milliseconds - payloadDate;
      const hoursDiff = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutesDiff = Math.floor((diff / (1000 * 60)) % 60);

      const date = new Date(payloadDate);
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const totalSecondsAgo = Math.floor(diff / 1000);
      const totalMinutesAgo = Math.floor(totalSecondsAgo / 60);
      const totalHoursAgo = Math.floor(totalMinutesAgo / 60);
      const daysDiff = Math.floor(totalHoursAgo / 24);

      let dateFormat;

      const displayMinutes = daysDiff === 0 && totalMinutesAgo < 60;
      const displayHours = daysDiff === 0 && totalHoursAgo < 10;
      const displayDays = daysDiff < 5;

      const timeAgo = (interval, value) => {
        return `${value} ${interval}${value > 1 ? 's' : ''} ago`;
      };

      if (displayMinutes) {
        dateFormat = timeAgo('minute', minutesDiff);
      } else if (displayHours) {
        dateFormat = timeAgo('hour', hoursDiff);
      } else if (displayDays) {
        dateFormat = timeAgo('day', daysDiff);
      } else {
        dateFormat = `${day} ${months[month]}, ${year}`;
      }

      const padZero = (num) => {
        return String(num).padStart(2, '0');
      };

      const tooltipDateFormat = `${day} ${months[month]}, ${year} ${padZero(
        hours
      )}:${padZero(minutes)}`;

      return {
        dateFormat,
        tooltipDateFormat,
      };
    },
  };
}

export const DateUtil = dateUtil();
