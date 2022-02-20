export class Shift {
  constructor(employeeId: number, clockIn: Date, clockOut: Date) {
    this.employeeId = employeeId;
    this.clockIn = clockIn;
    this.clockOut = clockOut;
  }

  employeeId: number;
  clockIn: Date;
  clockOut: Date;

  isInSameDay(): boolean {
    return this.clockIn.getFullYear() === this.clockOut.getFullYear() &&
      this.clockIn.getDate() === this.clockOut.getDate() &&
      this.clockIn.getMonth() === this.clockOut.getMonth()
      ? true
      : false;
  }
}
