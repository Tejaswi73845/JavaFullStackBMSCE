import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: false,
  styleUrl: './add-employee.component.css',
  templateUrl: './add-employee.component.html',
})
export class AddEmployeeComponent {
  newEmployee = {
    name: '',
    department: '',
    age: null as number | null,
    salary: null as number | null,
  };

  message = '';
  errorMessage = '';
  isSaving = false;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  addEmployee(): void {
    this.message = '';
    this.errorMessage = '';

    const { name, department, age, salary } = this.newEmployee;
    if (!name.trim() || !department.trim() || age === null || salary === null) {
      this.errorMessage = 'Complete all fields before submitting.';
      return;
    }

    if (age < 22 || age > 60) {
      this.errorMessage = 'Age must be between 22 and 60.';
      return;
    }

    if (salary < 0) {
      this.errorMessage = 'Salary cannot be negative.';
      return;
    }

    this.isSaving = true;
    this.employeeService
      .addEmployee({ name: name.trim(), department: department.trim(), age, salary })
      .subscribe({
        next: (savedEmployee) => {
          this.message = `Employee added. Generated ID: ${savedEmployee.id}`;
          this.newEmployee = {
            name: '',
            department: '',
            age: null,
            salary: null,
          };
          this.isSaving = false;
          this.changeDetector.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          const responseMessage = error.error;
          this.errorMessage =
            typeof responseMessage === 'string'
              ? responseMessage
              : responseMessage?.message || 'Unable to add employee.';
          this.isSaving = false;
          this.changeDetector.markForCheck();
        },
      });
  }
}
