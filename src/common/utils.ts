import { Employee } from 'src/app/model/Employee.model';
import { Shift } from 'src/app/model/Shift.model';
import { ShiftWithTime } from 'src/app/model/ShiftWithTime.model';
import { EMPLOYEE_NUMBER } from 'src/app/services/constants';

export function getRandomNumberInRange(min: number, max: number) {
  let _delay = Math.random() * (max - min) + min;
  return Math.round(_delay);
}

export function getRandomEmployeeId() {
  let _delay = Math.random() * (EMPLOYEE_NUMBER - 1) + 0;
  return Math.round(_delay);
}

export function randomDate(start: Date, end: Date) {
  let _date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  _date.setMinutes(0);
  _date.setSeconds(0);
  _date.setMilliseconds(0);
  return _date;
}

export function getShiftTotalTimeByShift(shift: Shift): number {
  let result: number =
    (shift.clockOut.getTime() - shift.clockIn.getTime()) / 36e5;
  return result;
}

export function onlyUniqueDates(value: Shift, index: number, self: Shift[]) {
  return (
    self.findIndex(
      (d) =>
        d.clockIn.getDate() === value.clockIn.getDate() &&
        d.clockIn.getMonth() === value.clockIn.getMonth()
    ) === index
  );
}

export function sortByMonthAndDate(a: any, b: any) {
  if (a.clockIn.getMonth() < b.clockIn.getMonth()) return -1;
  if (a.clockIn.getMonth() > b.clockIn.getMonth()) return 1;
  if (a.clockIn.getDate() < b.clockIn.getDate()) return -1;
  if (a.clockIn.getDate() > b.clockIn.getDate()) return 1;
  return 0;
}

export function hoursUntilMidnight(date: Date): number {
  var midnight = new Date(date.getTime());
  midnight.setHours(24);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  return Math.round((midnight.getTime() - date.getTime()) / 1000 / 60 / 60);
}

export function hoursFromDown(date: Date): number {
  var midnight = new Date(date.getTime());
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);
  return Math.abs(
    Math.round((date.getTime() - midnight.getTime()) / 1000 / 60 / 60)
  );
}

export function addZero(i: any) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function addTimeInfo(_ds: Employee[]) {
  _ds.forEach((_emp) => {
    _emp.shifts.forEach((_shift: ShiftWithTime) => {
      _shift.clockInTime =
        addZero(_shift.clockIn.getHours()) +
        ':' +
        addZero(_shift.clockIn.getMinutes());
      _shift.clockOutTime =
        addZero(_shift.clockOut.getHours()) +
        ':' +
        addZero(_shift.clockOut.getMinutes());
    });
  });
}