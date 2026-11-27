import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, NewEmployee } from '../employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:8080/api/employees';

  constructor(private readonly http: HttpClient) {}

  addEmployee(employee: NewEmployee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  updateEmployee(id: number, employee: NewEmployee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  patchEmployee(id: number, changes: Partial<NewEmployee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, changes);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
