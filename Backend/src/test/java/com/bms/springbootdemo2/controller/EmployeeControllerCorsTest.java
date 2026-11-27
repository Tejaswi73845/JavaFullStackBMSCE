package com.bms.springbootdemo2.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

class EmployeeControllerCorsTest {

    @Test
    void allowsPatchFromTheFrontendOrigin() {
        CrossOrigin cors = EmployeeController.class.getAnnotation(CrossOrigin.class);

        assertTrue(Arrays.asList(cors.origins()).contains("http://localhost:4200"));
        assertTrue(Arrays.asList(cors.methods()).contains(RequestMethod.PATCH));
    }
}
