package com.bms.springbootdemo2.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bms.springbootdemo2.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
}
