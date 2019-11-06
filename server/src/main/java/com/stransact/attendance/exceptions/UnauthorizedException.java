package com.stransact.attendance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * The type Resource not found exception.
 *
 * @author Dagogo Hart Moore
 */
@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends Exception {

    /**
     * Instantiates a new Resource not found exception.
     *
     * @param message the message
     */
    public UnauthorizedException(String message) {
        super(message);
    }
}