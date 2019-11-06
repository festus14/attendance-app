package com.stransact.attendance.security;

import com.stransact.attendance.exceptions.ValidationException;

public class ValidationManager {
    public static String isEmail(String email) throws ValidationException {
        String regex = "^[\\w-_.+]*[\\w-_.]@([\\w]+\\.)+[\\w]+[\\w]$";
        if (email.matches(regex)) return email;
        else throw new ValidationException("EMAIL_INVALID");
    }

    public static String isString(String string, String field) throws ValidationException {
        if (string.getClass().equals(String.class)) return string;
        else throw new ValidationException(field.toUpperCase() + "_INVALID");
    }

    public static String isMax(String string, int max, String field) throws ValidationException {
        if (string.length() > max) throw new ValidationException(field.toUpperCase() + "_INVALID");
        else return string;
    }

    public static String isMin(String string, int min, String field) throws ValidationException {
        if (string.length() < min) throw new ValidationException(field.toUpperCase() + "_INVALID");
        else return string;
    }
}
