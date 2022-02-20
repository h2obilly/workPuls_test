import { Component } from '@angular/core';
import { first } from 'rxjs';
import { MockDbService } from './services/mockDb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private employeeService: MockDbService) {}

  test1() {
    this.employeeService
      .getShiftsForId(0)
      .pipe(first())
      .subscribe(console.table);
  }

  test2() {
    this.employeeService.getAllShifts().pipe(first()).subscribe(console.log);
  }
  test3() {
    console.log(this.employeeService.generatedShifts);
  }
}
