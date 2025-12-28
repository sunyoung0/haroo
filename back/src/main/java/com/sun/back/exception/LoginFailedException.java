package com.sun.back.exception;

public class LoginFailedException extends RuntimeException {
  public LoginFailedException(String message) {
    super(message);
  }
}
