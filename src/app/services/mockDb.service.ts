import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  delay,
  empty,
  first,
  forkJoin,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  reduce,
  switchMap,
  takeLast,
  tap,
} from 'rxjs';
import {
  getRandomEmployeeId,
  getRandomNumberInRange,
  getShiftTotalTimeByShift,
  hoursFromDown,
  hoursUntilMidnight,
  onlyUniqueDates,
  randomDate,
  sortByMonthAndDate,
} from 'src/common/utils';
import { Employee } from '../model/Employee.model';
import { Shift } from '../model/Shift.model';
import {
  EmployeeNames,
  EMPLOYEE_NUMBER,
  MAX_API_DELAY,
  MIN_API_DELAY,
  SHIFT_NUMBER,
} from './constants';

@Injectable()
export class MockDbService {
  generatedEmployees: Employee[] = [];
  generatedShifts: Shift[] = [];

  refreshGeneralInfoObs: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.generateDB();
  }

  generateDB() {
    EmployeeNames.slice(0, EMPLOYEE_NUMBER).forEach(
      (emp: string, index: number) => {
        let _hourlyRate = getRandomNumberInRange(5, 40);
        this.generatedEmployees.push(
          new Employee(
            index,
            emp,
            emp.trim().replace(/ /g, '').toLowerCase() + '@gmail',
            _hourlyRate,
            Math.round(_hourlyRate * 1.2)
          )
        );
      }
    );

    let _index = 0;
    while (_index < SHIFT_NUMBER) {
      let _randDate: Date = randomDate(new Date(2022, 11, 1), new Date());
      let _shiftDuration: number = getRandomNumberInRange(5, 11);
      let _randEndDate: Date = new Date(_randDate);
      _randDate.setHours(_randDate.getHours() - _shiftDuration);

      this.generatedShifts.push(
        new Shift(getRandomEmployeeId(), _randDate, _randEndDate)
      );

      this.generatedShifts = this.generatedShifts
        .filter(onlyUniqueDates)
        .sort(sortByMonthAndDate);
      _index++;
    }
  }

  getAll(): Observable<Employee[]> {
    return of(this.generatedEmployees).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY * 3, MAX_API_DELAY * 3))
    );
  }

  findById(id: number): Observable<Employee | undefined> {
    return of(this.generatedEmployees.find((x) => x.id === id)).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }

  getAllShifts(): Observable<Shift[]> {
    return of(this.generatedShifts).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }

  getShiftsForId(id: number): Observable<Shift[]> {
    return of(this.generatedShifts.filter((x) => x.employeeId === id)).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }

  getTotalNumberOfEmployees(): Observable<number> {
    return of(this.generatedEmployees.length).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }
  getTotalNumberOfShifts(): Observable<number> {
    return of(this.generatedShifts.length).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }

  getTotalClockedInTime(): Observable<number> {
    return of(
      this.generatedShifts.reduce(
        (sum, current) => sum + getShiftTotalTimeByShift(current),
        0
      )
    ).pipe(delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY)));
  }

  bulkSaveEmployees(emps: Employee[]): Observable<boolean> {
    emps.forEach((_emp: Employee) => {
      this.updateEmp(_emp);
    });
    emps.forEach((_emp: Employee) => {
      this.updateEmpShifts(_emp.id, _emp.shifts);
    });
    return of(true).pipe(
      delay(getRandomNumberInRange(MIN_API_DELAY, MAX_API_DELAY))
    );
  }

  updateEmp(emp: Employee) {
    let _emp = this.generatedEmployees.find((x) => x.id == emp.id);
    if (_emp) {
      _emp.name = emp.name;
      _emp.hourlyRate = emp.hourlyRate;
      _emp.overtimeHourlyRate = emp.overtimeHourlyRate;
    }
  }

  updateEmpShifts(empId: number, shifts: Shift[]) {
    let indexForErase = [];
    for (var i = 0; i < this.generatedShifts.length; i++) {
      if (this.generatedShifts[i].employeeId == empId) {
        indexForErase.push(i);
      }
    }
    indexForErase = indexForErase.sort((a, b) => b - a);
    indexForErase.forEach((x) => {
      this.generatedShifts.splice(x, 1);
    });
    shifts.forEach((_sh) => {
      this.generatedShifts.push(
        new Shift(_sh.employeeId, _sh.clockIn, _sh.clockOut)
      );
    });
  }

  getTotalRegularAmount(): any {
    let totalRegularAmount = 0;

    let _emps = [...this.generatedEmployees];
    _emps.forEach((emp) => {
      emp.shifts = this.generatedShifts.filter((x) => x.employeeId === emp.id);

      let _transformedValues = this.transformHoursByDate(emp);
      let _amounts = this.getAmounts(_transformedValues, emp);
      totalRegularAmount += _amounts[0];
    });

    return of(totalRegularAmount);
  }

  getTotalOvertimeAmount() {
    let totalOvertimeAmount = 0;

    let _emps = [...this.generatedEmployees];
    _emps.forEach((emp) => {
      emp.shifts = this.generatedShifts.filter((x) => x.employeeId === emp.id);

      let _transformedValues = this.transformHoursByDate(emp);
      let _amounts = this.getAmounts(_transformedValues, emp);
      totalOvertimeAmount += _amounts[1];
    });

    return of(totalOvertimeAmount);
  }

  transformHoursByDate(emp: Employee) {
    let result: any = {};
    if (emp.shifts) {
      emp.shifts.forEach((_sh) => {
        if (_sh.isInSameDay()) {
          result[_sh.clockIn.toDateString()] = getShiftTotalTimeByShift(_sh);
        } else {
          if (result.hasOwnProperty(_sh.clockIn.toDateString())) {
            result[_sh.clockIn.toDateString()] =
              result[_sh.clockIn.toDateString()] +
              hoursUntilMidnight(_sh.clockIn);
          } else {
            if (result.hasOwnProperty(_sh.clockOut.toDateString())) {
              result[_sh.clockOut.toDateString()] =
                result[_sh.clockOut.toDateString()] +
                hoursFromDown(_sh.clockOut);
            } else {
              result[_sh.clockOut.toDateString()] = hoursFromDown(_sh.clockOut);
            }
          }
        }
      });
    }
    return result;
  }

  getAmounts(_transformedValues: any, emp: Employee) {
    let _totalRegular = 0;
    let _totalOvertime = 0;
    var keys = Object.keys(_transformedValues);
    keys.forEach(function (key) {
      var value = _transformedValues[key];
      if (value <= 8) {
        _totalRegular = _totalRegular + value;
      }
      if (value > 8) {
        _totalRegular = _totalRegular + 8;
        _totalOvertime = _totalOvertime + (value - 8);
      }
    });

    return [
      _totalRegular * emp.hourlyRate,
      _totalOvertime * emp.overtimeHourlyRate,
    ];
  }
}
