package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private final By emailInput = By.id("email");
    private final By passwordInput = By.id("password");
    private final By loginButton = By.id("login-btn");
    private final By rememberMeCheckbox = By.id("remember-me");
    private final By forgotPasswordLink = By.linkText("Forgot Password?");
    private final By errorMessage = By.id("auth-error-msg");
    private final By passwordToggleBtn = By.id("toggle-password-visibility");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void enterEmail(String email) {
        sendKeys(emailInput, email);
    }

    public void enterPassword(String password) {
        sendKeys(passwordInput, password);
    }

    public void clickLogin() {
        click(loginButton);
    }

    public void toggleRememberMe() {
        click(rememberMeCheckbox);
    }

    public void clickForgotPassword() {
        click(forgotPasswordLink);
    }

    public void togglePasswordVisibility() {
        click(passwordToggleBtn);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public boolean isErrorMessageDisplayed() {
        return isDisplayed(errorMessage);
    }

    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
    }
}
