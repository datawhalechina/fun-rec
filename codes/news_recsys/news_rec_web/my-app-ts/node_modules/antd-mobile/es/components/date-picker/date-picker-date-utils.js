import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
const precisionRankRecord = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};
export function defaultRenderLabel(type, data) {
  switch (type) {
    case 'minute':
    case 'second':
    case 'hour':
      return ('0' + data.toString()).slice(-2);

    default:
      return data.toString();
  }
}
export function generateDatePickerColumns(selected, min, max, precision, renderLabel, filter) {
  const ret = [];
  const minYear = min.getFullYear();
  const minMonth = min.getMonth() + 1;
  const minDay = min.getDate();
  const minHour = min.getHours();
  const minMinute = min.getMinutes();
  const minSecond = min.getSeconds();
  const maxYear = max.getFullYear();
  const maxMonth = max.getMonth() + 1;
  const maxDay = max.getDate();
  const maxHour = max.getHours();
  const maxMinute = max.getMinutes();
  const maxSecond = max.getSeconds();
  const rank = precisionRankRecord[precision];

  if (rank >= precisionRankRecord.year) {
    const years = [];

    for (let i = minYear; i <= maxYear; i++) {
      const value = i.toString();
      years.push({
        label: renderLabel ? renderLabel('year', i) : value,
        value
      });
    }

    ret.push(years);
  }

  const selectedYear = parseInt(selected[0]);
  const firstDayInSelectedMonth = dayjs(convertStringArrayToDate([selected[0], selected[1], '1']));
  const selectedMonth = parseInt(selected[1]);
  const selectedDay = parseInt(selected[2]);
  const selectedHour = parseInt(selected[3]);
  const selectedMinute = parseInt(selected[4]);
  const isInMinYear = selectedYear === minYear;
  const isInMaxYear = selectedYear === maxYear;
  const isInMinMonth = isInMinYear && selectedMonth === minMonth;
  const isInMaxMonth = isInMaxYear && selectedMonth === maxMonth;
  const isInMinDay = isInMinMonth && selectedDay === minDay;
  const isInMaxDay = isInMaxMonth && selectedDay === maxDay;
  const isInMinHour = isInMinDay && selectedHour === minHour;
  const isInMaxHour = isInMaxDay && selectedHour === maxHour;
  const isInMinMinute = isInMinHour && selectedMinute === minMinute;
  const isInMaxMinute = isInMaxHour && selectedMinute === maxMinute;

  const generateColumn = (from, to, precision) => {
    let column = [];

    for (let i = from; i <= to; i++) {
      column.push(i);
    }

    const prefix = selected.slice(0, precisionRankRecord[precision]);
    const currentFilter = filter === null || filter === void 0 ? void 0 : filter[precision];

    if (currentFilter && typeof currentFilter === 'function') {
      column = column.filter(i => currentFilter(i, {
        get date() {
          const stringArray = [...prefix, i.toString()];
          return convertStringArrayToDate(stringArray);
        }

      }));
    }

    return column;
  };

  if (rank >= precisionRankRecord.month) {
    const lower = isInMinYear ? minMonth : 1;
    const upper = isInMaxYear ? maxMonth : 12;
    const months = generateColumn(lower, upper, 'month');
    ret.push(months.map(v => {
      return {
        label: renderLabel('month', v),
        value: v.toString()
      };
    }));
  }

  if (rank >= precisionRankRecord.day) {
    const lower = isInMinMonth ? minDay : 1;
    const upper = isInMaxMonth ? maxDay : firstDayInSelectedMonth.daysInMonth();
    const days = generateColumn(lower, upper, 'day');
    ret.push(days.map(v => {
      return {
        label: renderLabel('day', v),
        value: v.toString()
      };
    }));
  }

  if (rank >= precisionRankRecord.hour) {
    const lower = isInMinDay ? minHour : 0;
    const upper = isInMaxDay ? maxHour : 23;
    const hours = generateColumn(lower, upper, 'hour');
    ret.push(hours.map(v => {
      return {
        label: renderLabel('hour', v),
        value: v.toString()
      };
    }));
  }

  if (rank >= precisionRankRecord.minute) {
    const lower = isInMinHour ? minMinute : 0;
    const upper = isInMaxHour ? maxMinute : 59;
    const minutes = generateColumn(lower, upper, 'minute');
    ret.push(minutes.map(v => {
      return {
        label: renderLabel('minute', v),
        value: v.toString()
      };
    }));
  }

  if (rank >= precisionRankRecord.second) {
    const lower = isInMinMinute ? minSecond : 0;
    const upper = isInMaxMinute ? maxSecond : 59;
    const seconds = generateColumn(lower, upper, 'second');
    ret.push(seconds.map(v => {
      return {
        label: renderLabel('second', v),
        value: v.toString()
      };
    }));
  }

  return ret;
}
export function convertDateToStringArray(date) {
  if (!date) return [];
  return [date.getFullYear().toString(), (date.getMonth() + 1).toString(), date.getDate().toString(), date.getHours().toString(), date.getMinutes().toString(), date.getSeconds().toString()];
}
export function convertStringArrayToDate(value) {
  var _a, _b, _c, _d, _e, _f;

  const yearString = (_a = value[0]) !== null && _a !== void 0 ? _a : '1900';
  const monthString = (_b = value[1]) !== null && _b !== void 0 ? _b : '1';
  const dateString = (_c = value[2]) !== null && _c !== void 0 ? _c : '1';
  const hourString = (_d = value[3]) !== null && _d !== void 0 ? _d : '0';
  const minuteString = (_e = value[4]) !== null && _e !== void 0 ? _e : '0';
  const secondString = (_f = value[5]) !== null && _f !== void 0 ? _f : '0';
  return new Date(parseInt(yearString), parseInt(monthString) - 1, parseInt(dateString), parseInt(hourString), parseInt(minuteString), parseInt(secondString));
}