import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('posts employee details without an ID to the backend endpoint', () => {
    const employee = {
      name: 'Jordan Lee',
      department: 'Engineering',
      age: 30,
      salary: 75000,
    };

    service.addEmployee(employee).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(employee);
    expect(request.request.body.id).toBeUndefined();
    request.flush({ ...employee, id: 12 });
  });

  it('gets all employees from the backend endpoint', () => {
    service.getAllEmployees().subscribe((employees) => {
      expect(employees).toEqual([
        {
          id: 12,
          name: 'Jordan Lee',
          department: 'Engineering',
          age: 30,
          salary: 75000,
        },
      ]);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 12,
        name: 'Jordan Lee',
        department: 'Engineering',
        age: 30,
        salary: 75000,
      },
    ]);
  });

  it('replaces an employee with PUT', () => {
    const employee = {
      name: 'Jordan Lee',
      department: 'Design',
      age: 31,
      salary: 78000,
    };

    service.updateEmployee(12, employee).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees/12');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(employee);
    request.flush({ ...employee, id: 12 });
  });

  it('patches only the provided employee fields', () => {
    const changes = { department: 'Design' };

    service.patchEmployee(12, changes).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees/12');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(changes);
    request.flush({
      id: 12,
      name: 'Jordan Lee',
      department: 'Design',
      age: 30,
      salary: 75000,
    });
  });

  it('deletes an employee', () => {
    service.deleteEmployee(12).subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/employees/12');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
