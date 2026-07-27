package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class SignupPage extends BasePage {

    private final By fullNameInput = By.id("signup-name");
    private final By emailInput = By.id("signup-email");
    private final By passwordInput = By.id("signup-password");
    private final By confirmPasswordInput = By.id("signup-confirm-password");
    private final By roleDropdown = By.id("signup-role");
    private final By phoneInput = By.id("signup-phone");
    private final By termsCheckbox = By.id("signup-terms");
    private final By submitButton = By.id("signup-submit-btn");
    private final By otpInput = By.id("otp-code");
    private final By verifyOtpBtn = By.id("verify-otp-btn");
    private final By validationMessage = By.className("validation-msg");

    public SignupPage(WebDriver driver) {
        super(driver);
    }

    public void fillRegistrationForm(String name, String email, String pass, String confirmPass, String phone, String role) {
        sendKeys(fullNameInput, name);
        sendKeys(emailInput, email);
        sendKeys(passwordInput, pass);
        sendKeys(confirmPasswordInput, confirmPass);
        sendKeys(phoneInput, phone);
        selectByValue(roleDropdown, role);
    }

    public void acceptTerms() {
        click(termsCheckbox);
    }

    public void clickSubmit() {
        click(submitButton);
    }

    public void enterOtp(String code) {
        sendKeys(otpInput, code);
        click(verifyOtpBtn);
    }

    public String getValidationText() {
        return getText(validationMessage);
    }
}
