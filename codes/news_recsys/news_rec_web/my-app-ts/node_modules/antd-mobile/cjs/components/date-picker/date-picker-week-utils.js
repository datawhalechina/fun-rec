"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertDateToStringArray = convertDateToStringArray;
exports.convertStringArrayToDate = convertStringArrayToDate;
exports.defaultRenderLabel = defaultRenderLabel;
exports.generateDatePickerColumns = generateDatePickerColumns;

var _dayjs = _interopRequireDefault(require("dayjs"));

var _isoWeek = _interopRequireDefault(require("dayjs/plugin/isoWeek"));

var _isoWeeksInYear = _interopRequireDefault(require("dayjs/plugin/isoWeeksInYear"));

var _isLeapYear = _interopRequireDefault(require("dayjs/plugin/isLeapYear"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dayjs.default.extend(_isoWeek.default);

_dayjs.default.extend(_isoWeeksInYear.default);

_dayjs.default.extend(_isLeapYear.default);

const precisionRankRecord = {
  year: 0,
  week: 1,
  'week-day': 2
};

function defaultRenderLabel(type, data) {
  return data.toString();
}

function generateDatePickerColumns(selected, min, max, precision, renderLabel, filter) {
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
  const minDay = (0, _dayjs.default)(min);
  const maxDay = (0, _dayjs.default)(max);
  const minWeek = minDay.isoWeek();
  const maxWeek = maxDay.isoWeek();
  const minWeekday = minDay.isoWeekday();
  const maxWeekday = maxDay.isoWeekday();
  const selectedWeek = parseInt(selected[1]);
  const isInMinWeek = isInMinYear && selectedWeek === minWeek;
  const isInMaxWeek = isInMaxYear && selectedWeek === maxWeek;
  const selectedYearWeeks = (0, _dayjs.default)(`${selectedYear}-01-01`).isoWeeksInYear();

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

function convertDateToStringArray(date) {
  if (!date) return [];
  const day = (0, _dayjs.default)(date);
  return [day.isoWeekYear().toString(), day.isoWeek().toString(), day.isoWeekday().toString()];
}

function convertStringArrayToDate(value) {
  var _a, _b, _c;

  const yearString = (_a = value[0]) !== null && _a !== void 0 ? _a : '1900';
  const weekString = (_b = value[1]) !== null && _b !== void 0 ? _b : '1';
  const weekdayString = (_c = value[2]) !== null && _c !== void 0 ? _c : '1';
  const day = (0, _dayjs.default)().year(parseInt(yearString)).isoWeek(parseInt(weekString)).isoWeekday(parseInt(weekdayString)).hour(0).minute(0).second(0);
  return day.toDate();
}