package com.bms.springbootdemo2.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bms.springbootdemo2.dto.EmployeePatchRequest;
import com.bms.springbootdemo2.entity.Employee;
import com.bms.springbootdemo2.exception.InvalidAgeException;
import com.bms.springbootdemo2.exception.IdNotFountException;
import com.bms.springbootdemo2.repository.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        validateAge(employee.getAge());
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(int id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IdNotFountException("Employee not found with id: " + id));
    }

    @Override
    public Employee updateEmployee(int id, Employee employee) {
        validateAge(employee.getAge());
        Employee existingEmployee = getEmployeeById(id);
        existingEmployee.setName(employee.getName());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setSalary(employee.getSalary());
        existingEmployee.setAge(employee.getAge());
        return employeeRepository.save(existingEmployee);
    }

    @Override
    public Employee patchEmployee(int id, EmployeePatchRequest changes) {
        if (changes.getAge() != null) {
            validateAge(changes.getAge());
        }

        Employee existingEmployee = getEmployeeById(id);
        if (changes.getName() != null) {
            existingEmployee.setName(changes.getName());
        }
        if (changes.getDepartment() != null) {
            existingEmployee.setDepartment(changes.getDepartment());
        }
        if (changes.getAge() != null) {
            existingEmployee.setAge(changes.getAge());
        }
        if (changes.getSalary() != null) {
            existingEmployee.setSalary(changes.getSalary());
        }
        return employeeRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(int id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    private void validateAge(int age) {
        if (age < 22 || age > 60) {
            throw new InvalidAgeException("Employee age must be between 22 and 60");
        }
    }
}
