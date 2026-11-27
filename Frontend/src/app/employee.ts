export interface Employee {
  id: number;
  name: string;
  department: string;
  age: number;
  salary: number;
}

export type NewEmployee = Omit<Employee, 'id'>;
