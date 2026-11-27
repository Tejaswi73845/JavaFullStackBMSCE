import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee, NewEmployee } from '../employee';
import { EmployeeService } from '../services/employee.service';

type EmployeeSortKey = 'default' | 'id' | 'name' | 'department' | 'age' | 'salary';

@Component({
  selector: 'app-view-employees',
  standalone: false,
  styleUrl: './view-employees.component.css',
  templateUrl: './view-employees.component.html',
})
export class ViewEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage = '';
  statusMessage = '';
  isLoading = false;
  isSaving = false;
  isDeletingId: number | null = null;
  pendingDeleteId: number | null = null;
  editingEmployee: Employee | null = null;
  updateMode: 'patch' | 'put' = 'patch';
  searchTerm = '';
  selectedDepartment = '';
  sortKey: EmployeeSortKey = 'default';
  sortDirection: 'asc' | 'desc' = 'asc';
  editForm = {
    name: '',
    department: '',
    age: null as number | null,
    salary: null as number | null,
  };

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  get departments(): string[] {
    return [...new Set(this.employees.map((employee) => employee.department))].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );
  }

  get filteredEmployees(): Employee[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    const filtered = this.employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLocaleLowerCase().includes(query) ||
        employee.department.toLocaleLowerCase().includes(query);
      const matchesDepartment =
        !this.selectedDepartment || employee.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });

    const sortKey = this.sortKey;
    if (sortKey === 'default') {
      return filtered;
    }

    return filtered.sort((left, right) => {
      const comparison =
        sortKey === 'name' || sortKey === 'department'
          ? left[sortKey].localeCompare(right[sortKey], undefined, {
              sensitivity: 'base',
            })
          : left[sortKey] - right[sortKey];

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  get hasActiveControls(): boolean {
    return (
      Boolean(this.searchTerm.trim()) ||
      Boolean(this.selectedDepartment) ||
      this.sortKey !== 'default' ||
      this.sortDirection !== 'asc'
    );
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  clearDirectoryControls(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.sortKey = 'default';
    this.sortDirection = 'asc';
  }

  loadEmployees(): void {
    this.errorMessage = '';
    this.statusMessage = '';
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to load employees. Check that the backend is running.',
        );
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  startEditing(employee: Employee): void {
    this.errorMessage = '';
    this.statusMessage = '';
    this.editingEmployee = employee;
    this.updateMode = 'patch';
    this.editForm = {
      name: employee.name,
      department: employee.department,
      age: employee.age,
      salary: employee.salary,
    };
  }

  cancelEditing(): void {
    if (!this.isSaving) {
      this.editingEmployee = null;
      this.errorMessage = '';
    }
  }

  saveChanges(): void {
    const employee = this.editingEmployee;
    const { name, department, age, salary } = this.editForm;

    if (!employee || !name.trim() || !department.trim() || age === null || salary === null) {
      this.errorMessage = 'Complete all fields before saving.';
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

    const changes: Partial<NewEmployee> = {};
    if (name.trim() !== employee.name) {
      changes.name = name.trim();
    }
    if (department.trim() !== employee.department) {
      changes.department = department.trim();
    }
    if (age !== employee.age) {
      changes.age = age;
    }
    if (salary !== employee.salary) {
      changes.salary = salary;
    }

    if (Object.keys(changes).length === 0) {
      this.statusMessage = 'No changes to save.';
      this.editingEmployee = null;
      return;
    }

    const updateRequest =
      this.updateMode === 'put'
        ? this.employeeService.updateEmployee(employee.id, {
            name: name.trim(),
            department: department.trim(),
            age,
            salary,
          })
        : this.employeeService.patchEmployee(employee.id, changes);

    this.isSaving = true;
    this.errorMessage = '';
    updateRequest.subscribe({
      next: (updatedEmployee) => {
        this.employees = this.employees.map((item) =>
          item.id === updatedEmployee.id ? updatedEmployee : item,
        );
        this.editingEmployee = null;
        this.statusMessage = `${updatedEmployee.name} was updated.`;
        this.isSaving = false;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Unable to update employee.');
        this.isSaving = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  requestDelete(employee: Employee): void {
    this.pendingDeleteId = employee.id;
    this.errorMessage = '';
    this.statusMessage = '';
  }

  cancelDelete(): void {
    if (this.isDeletingId === null) {
      this.pendingDeleteId = null;
    }
  }

  deleteEmployee(employee: Employee): void {
    this.isDeletingId = employee.id;
    this.errorMessage = '';
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.employees = this.employees.filter((item) => item.id !== employee.id);
        this.pendingDeleteId = null;
        this.isDeletingId = null;
        this.statusMessage = `${employee.name} was deleted.`;
        this.changeDetector.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Unable to delete employee.');
        this.isDeletingId = null;
        this.changeDetector.markForCheck();
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const responseMessage = error.error;
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage;
    }
    return responseMessage?.message || fallback;
  }
}
