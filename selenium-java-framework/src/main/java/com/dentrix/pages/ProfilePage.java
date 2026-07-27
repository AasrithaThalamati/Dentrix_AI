package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProfilePage extends BasePage {

    private final By profileNameInput = By.id("profile-name");
    private final By profileEmailInput = By.id("profile-email");
    private final By profilePhoneInput = By.id("profile-phone");
    private final By roleBadge = By.id("user-role-badge");
    private final By avatarUploadInput = By.id("avatar-upload");
    private final By updateProfileBtn = By.id("update-profile-btn");
    private final By changePasswordBtn = By.id("change-password-modal-btn");

    public ProfilePage(WebDriver driver) {
        super(driver);
    }

    public void updateProfileInfo(String name, String phone) {
        sendKeys(profileNameInput, name);
        sendKeys(profilePhoneInput, phone);
        click(updateProfileBtn);
    }

    public String getUserRoleBadge() {
        return getText(roleBadge);
    }

    public void uploadAvatar(String imagePath) {
        sendKeys(avatarUploadInput, imagePath);
    }
}
