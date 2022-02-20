import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockDbService } from './services/mockDb.service';
import { EmployeeTableComponent } from './components/employeeTbl/employee-table.component';
import { GeneralInfoComponent } from './components/generalInfo/general-info.component';
import { BulkEditComponent } from './components/bulk-edit/bulk-edit.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeTableComponent,
    GeneralInfoComponent,
    BulkEditComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaterialTimepickerModule,
  ],
  providers: [MockDbService, BulkEditComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
