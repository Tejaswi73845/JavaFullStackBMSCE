package com.bms.springbootdemo2.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class IdNotFountException extends RuntimeException {
    public IdNotFountException(String message) {
        super(message);
    }
    
}
