import { Shift } from './Shift.model';
import { ShiftWithTime } from './ShiftWithTime.model';

export class Employee {
  constructor(
    id: number,
    name: string,
    email: string,
    hourlyRate: number,
    overtimeHourlyRate: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.hourlyRate = hourlyRate;
    this.overtimeHourlyRate = overtimeHourlyRate;
  }

  id: number;
  name: string;
  email: string;
  hourlyRate: number;
  overtimeHourlyRate: number;
  shifts: Shift[] | ShiftWithTime[];

}
