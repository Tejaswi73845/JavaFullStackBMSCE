package com.bms.springbootdemo2.service;

import java.util.List;

import com.bms.springbootdemo2.entity.Employee;
import com.bms.springbootdemo2.dto.EmployeePatchRequest;
import com.bms.springbootdemo2.exception.InvalidAgeException;
import com.bms.springbootdemo2.exception.IdNotFountException;

public interface EmployeeService {

    Employee createEmployee(Employee employee) throws InvalidAgeException;

    List<Employee> getAllEmployees();

    Employee getEmployeeById(int id) throws IdNotFountException;

    Employee updateEmployee(int id, Employee employee) throws IdNotFountException;

    Employee patchEmployee(int id, EmployeePatchRequest changes) throws IdNotFountException;

    void deleteEmployee(int id) throws IdNotFountException;
}
