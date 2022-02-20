import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/model/Employee.model';
import { Shift } from 'src/app/model/Shift.model';
import { ShiftWithTime } from 'src/app/model/ShiftWithTime.model';
import { MockDbService } from 'src/app/services/mockDb.service';
import { addTimeInfo } from 'src/common/utils';

@Component({
  selector: 'bulk-edit',
  templateUrl: 'bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkEditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BulkEditComponent>,
    private employeeService: MockDbService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  loader: boolean;
  displayedColumns: string[] = ['date', 'clockIn', 'clockOut', 'total'];

  forma: FormGroup = this.fb.group({
    employeesFormArray: this.fb.array([]),
  });

  get employeesFormArray(): FormArray {
    return <FormArray>this.forma.get('employeesFormArray');
  }
  formCreated = false;

  dataSource: Employee[];
  ngOnInit(): void {
    this.dataSource = [...this.data.employees];
    this.dataSource.forEach((emp: Employee) => {
      this.employeeService
        .getShiftsForId(emp.id)
        .subscribe((_shifts: Shift[]) => {
          emp.shifts = _shifts;
          addTimeInfo(this.dataSource);
          this.createForm();
          this.cdr.detectChanges();
        });
    });
  }

  createForm() {
    if (this.formCreated) return;
    this.dataSource.forEach((_emp) => {
      let _shArray = this.fb.array([]);
      _emp.shifts.forEach((_sh: ShiftWithTime) => {
        _shArray.push(
          this.fb.group({
            employeeId: _sh.employeeId,
            clockIn: _sh.clockIn,
            clockInTime: _sh.clockInTime,
            clockOut: _sh.clockOut,
            clockOutTime: _sh.clockOutTime,
          })
        );
      });

      this.employeesFormArray.push(
        new FormGroup({
          id: new FormControl(_emp.id),
          name: new FormControl(_emp.name),
          hourlyRate: new FormControl(_emp.hourlyRate),
          overtimeHourlyRate: new FormControl(_emp.overtimeHourlyRate),
          shifts: _shArray,
        })
      );
    });

    this.formCreated = true;
  }

  onSubmit() {
    this.loader = true;
    this.putTimeInfoBackInModel(this.forma.value.employeesFormArray);
    this.employeeService
      .bulkSaveEmployees(this.forma.value.employeesFormArray)
      .subscribe((_resp: Boolean) => {
        if (_resp === true) {
          this.loader = false;
          this.dialogRef.close(true);
        }
      });
  }

  putTimeInfoBackInModel(emps: Employee[]) {
    emps.forEach((emp) => {
      emp.shifts.forEach((_sh: ShiftWithTime) => {
        _sh.clockInTime
          ? _sh.clockIn.setHours(+_sh.clockInTime.slice(0, 2))
          : null;
        _sh.clockOutTime
          ? _sh.clockOut.setHours(+_sh.clockOutTime.slice(0, 2))
          : null;
        delete _sh.clockOutTime;
        delete _sh.clockInTime;
      });
    });
  }

  getTotal(shift: ShiftWithTime): number {
    return Math.abs(shift.clockIn.getTime() - shift.clockOut.getTime()) / 36e5;
  }

  onChange(e: string, val: Date) {
    // val.setHours(+e.slice(0, 2));
  }

  test1() {
    console.log(this.dataSource);
  }
  test2() {
    console.log(this.forma);
  }
  test3() {
    console.log(this.employeeService.generatedShifts);
  }
}
