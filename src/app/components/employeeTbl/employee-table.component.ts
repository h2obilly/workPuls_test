import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Employee } from 'src/app/model/Employee.model';
import { MockDbService } from 'src/app/services/mockDb.service';
import { BulkEditComponent } from '../bulk-edit/bulk-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';

@Component({
  selector: 'employee-table',
  templateUrl: 'employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTableComponent {
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'email',
    'hourlyRate',
    'overtimeHourlyRate',
  ];
  dataSource: MatTableDataSource<Employee>;
  selection = new SelectionModel<Employee>(true, []);
  loaded: boolean;

  constructor(
    private employeeService: MockDbService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeService
      .getAll()
      .pipe(first())
      .subscribe((x) => {
        this.dataSource = new MatTableDataSource<Employee>(x);
        this.loaded = true;
        this.cdr.detectChanges();
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  bulkEdit() {
    var dialogref = this.dialog.open(BulkEditComponent, {
      width: '800px',
      data: {
        employees: [...this.selection.selected],
      },
    });

    dialogref
      .afterClosed()
      .pipe(first())
      .subscribe((value) => {
        if (value === true) {
          this.cdr.detectChanges();
          this.employeeService.refreshGeneralInfoObs.next(true);
        }
      });
  }
}
