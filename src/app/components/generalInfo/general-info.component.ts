import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MockDbService } from 'src/app/services/mockDb.service';

@Component({
  selector: 'general-info',
  templateUrl: 'general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  constructor(
    private employeeService: MockDbService,
    private cdr: ChangeDetectorRef
  ) {}

  generalSection: { name: string; obs: Observable<number>; suffix?: string }[];
  ngOnInit(): void {
    this.generalSection = this.getGeneralSection();

    this.employeeService.refreshGeneralInfoObs.subscribe((x) => {
      this.cdr.markForCheck();
      this.generalSection = this.getGeneralSection();
    });
  }

  getGeneralSection() {
    return [
      {
        name: 'Total number of employees:',
        obs: this.employeeService.getTotalNumberOfEmployees(),
      },
      {
        name: 'Total number of shifts:',
        obs: this.employeeService.getTotalNumberOfShifts(),
      },
      {
        name: 'Total clocked in time:',
        obs: this.employeeService.getTotalClockedInTime(),
      },
      {
        name: 'Total amount paid for regular hours:',
        obs: this.employeeService.getTotalRegularAmount(),
        suffix: 'eur',
      },
      {
        name: 'Total overtime amount paid for overtime hours:',
        obs: this.employeeService.getTotalOvertimeAmount(),
        suffix: 'eur',
      },
    ];
  }
}
