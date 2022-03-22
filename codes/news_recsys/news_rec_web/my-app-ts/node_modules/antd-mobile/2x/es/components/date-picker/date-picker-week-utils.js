import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
const precisionRankRecord = {
  year: 0,
  week: 1,
  'week-day': 2
};
export function defaultRenderLabel(type, data) {
  return data.toString();
}
export function generateDatePickerColumns(selected, min, max, precision, renderLabel, filter) {
  const ret = [];
  const minYear = min.getFullYear();
  const maxYear = max.getFullYear();
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
  const isInMinYear = selectedYear === minYear;
  const isInMaxYear = selectedYear === maxYear;
  const minDay = dayjs(min);
  const maxDay = dayjs(max);
  const minWeek = minDay.isoWeek();
  const maxWeek = maxDay.isoWeek();
  const minWeekday = minDay.isoWeekday();
  const maxWeekday = maxDay.isoWeekday();
  const selectedWeek = parseInt(selected[1]);
  const isInMinWeek = isInMinYear && selectedWeek === minWeek;
  const isInMaxWeek = isInMaxYear && selectedWeek === maxWeek;
  const selectedYearWeeks = dayjs(`${selectedYear}-01-01`).isoWeeksInYear();

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

  if (rank >= precisionRankRecord.week) {
    const lower = isInMinYear ? minWeek : 1;
    const upper = isInMaxYear ? maxWeek : selectedYearWeeks;
    const weeks = generateColumn(lower, upper, 'week');
    ret.push(weeks.map(v => {
      return {
        label: renderLabel('week', v),
        value: v.toString()
      };
    }));
  }

  if (rank >= precisionRankRecord['week-day']) {
    const lower = isInMinWeek ? minWeekday : 1;
    const upper = isInMaxWeek ? maxWeekday : 7;
    const weeks = generateColumn(lower, upper, 'week-day');
    ret.push(weeks.map(v => {
      return {
        label: renderLabel('week-day', v),
        value: v.toString()
      };
    }));
  }

  return ret;
}
export function convertDateToStringArray(date) {
  if (!date) return [];
  const day = dayjs(date);
  return [day.isoWeekYear().toString(), day.isoWeek().toString(), day.isoWeekday().toString()];
}
export function convertStringArrayToDate(value) {
  var _a, _b, _c;

  const yearString = (_a = value[0]) !== null && _a !== void 0 ? _a : '1900';
  const weekString = (_b = value[1]) !== null && _b !== void 0 ? _b : '1';
  const weekdayString = (_c = value[2]) !== null && _c !== void 0 ? _c : '1';
  const day = dayjs().year(parseInt(yearString)).isoWeek(parseInt(weekString)).isoWeekday(parseInt(weekdayString)).hour(0).minute(0).second(0);
  return day.toDate();
}