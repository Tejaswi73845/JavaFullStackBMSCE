import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';
import { ViewEmployeesComponent } from './view-employees.component';

describe('ViewEmployeesComponent', () => {
  const employee: Employee = {
    id: 12,
    name: 'Jordan Lee',
    department: 'Engineering',
    age: 30,
    salary: 75000,
  };
  let employeeService: {
    getAllEmployees: ReturnType<typeof vi.fn>;
    updateEmployee: ReturnType<typeof vi.fn>;
    patchEmployee: ReturnType<typeof vi.fn>;
    deleteEmployee: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    employeeService = {
      getAllEmployees: vi.fn(() => of([employee])),
      updateEmployee: vi.fn(() => of(employee)),
      patchEmployee: vi.fn(() => of(employee)),
      deleteEmployee: vi.fn(() => of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ViewEmployeesComponent],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    }).compileComponents();
  });

  it('sends only changed fields with PATCH by default', () => {
    const fixture = TestBed.createComponent(ViewEmployeesComponent);
    const component = fixture.componentInstance;
    component.startEditing(employee);
    component.editForm.department = 'Design';

    component.saveChanges();

    expect(employeeService.patchEmployee).toHaveBeenCalledWith(12, {
      department: 'Design',
    });
    expect(employeeService.updateEmployee).not.toHaveBeenCalled();
  });

  it('sends all fields with PUT when replacement mode is selected', () => {
    const fixture = TestBed.createComponent(ViewEmployeesComponent);
    const component = fixture.componentInstance;
    component.startEditing(employee);
    component.updateMode = 'put';
    component.editForm.department = 'Design';

    component.saveChanges();

    expect(employeeService.updateEmployee).toHaveBeenCalledWith(12, {
      name: 'Jordan Lee',
      department: 'Design',
      age: 30,
      salary: 75000,
    });
    expect(employeeService.patchEmployee).not.toHaveBeenCalled();
  });

  it('filters employees by a case-insensitive name or department search', () => {
    const fixture = TestBed.createComponent(ViewEmployeesComponent);
    const component = fixture.componentInstance;
    component.employees = [
      employee,
      { ...employee, id: 13, name: 'Alex Kim', department: 'Design' },
    ];

    component.searchTerm = 'design';
    expect(component.filteredEmployees.map((item) => item.name)).toEqual(['Alex Kim']);

    component.searchTerm = 'jordan';
    expect(component.filteredEmployees.map((item) => item.name)).toEqual(['Jordan Lee']);
  });

  it('filters by department and sorts without changing the source order', () => {
    const fixture = TestBed.createComponent(ViewEmployeesComponent);
    const component = fixture.componentInstance;
    component.employees = [
      employee,
      { ...employee, id: 13, name: 'Alex Kim', department: 'Design', salary: 90000 },
    ];
    component.selectedDepartment = 'Engineering';
    component.sortKey = 'salary';
    component.sortDirection = 'desc';

    expect(component.filteredEmployees.map((item) => item.id)).toEqual([12]);
    component.selectedDepartment = '';
    expect(component.filteredEmployees.map((item) => item.id)).toEqual([13, 12]);
    expect(component.employees.map((item) => item.id)).toEqual([12, 13]);
  });
});
