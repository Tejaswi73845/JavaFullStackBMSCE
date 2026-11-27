package com.bms.springbootdemo2.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.bms.springbootdemo2.dto.EmployeePatchRequest;
import com.bms.springbootdemo2.entity.Employee;
import com.bms.springbootdemo2.exception.InvalidAgeException;
import com.bms.springbootdemo2.repository.EmployeeRepository;

class EmployeeServiceImplTest {

    @Test
    void createEmployeeRejectsAgeOutsideSupportedRange() {
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        EmployeeService employeeService = new EmployeeServiceImpl(employeeRepository);
        Employee employee = new Employee("Test", "Engineering", 50000, 0);

        assertThrows(InvalidAgeException.class, () -> employeeService.createEmployee(employee));
        verify(employeeRepository, never()).save(employee);
    }

    @Test
    void patchEmployeeChangesOnlyProvidedFields() {
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        EmployeeService employeeService = new EmployeeServiceImpl(employeeRepository);
        Employee existing = new Employee("Taylor", "Engineering", 85000, 32);
        existing.setId(7);
        when(employeeRepository.findById(7)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(existing)).thenReturn(existing);

        EmployeePatchRequest changes = new EmployeePatchRequest();
        changes.setDepartment("Design");

        Employee updated = employeeService.patchEmployee(7, changes);

        assertEquals("Taylor", updated.getName());
        assertEquals("Design", updated.getDepartment());
        assertEquals(32, updated.getAge());
        assertEquals(85000, updated.getSalary());
        verify(employeeRepository).save(existing);
    }

    @Test
    void patchEmployeeRejectsInvalidAgeWithoutSaving() {
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        EmployeeService employeeService = new EmployeeServiceImpl(employeeRepository);
        EmployeePatchRequest changes = new EmployeePatchRequest();
        changes.setAge(61);

        assertThrows(InvalidAgeException.class, () -> employeeService.patchEmployee(7, changes));
        verify(employeeRepository, never()).save(org.mockito.ArgumentMatchers.any(Employee.class));
    }
}
