package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class SettingsPage extends BasePage {

    private final By themeToggleBtn = By.id("theme-toggle-btn");
    private final By languageSelect = By.id("language-select");
    private final By generateApiKeyBtn = By.id("generate-api-key-btn");
    private final By apiKeyDisplay = By.id("api-key-display");
    private final By sessionTimeoutInput = By.id("session-timeout-min");
    private final By saveSettingsBtn = By.id("save-settings-btn");
    private final By resetDefaultsBtn = By.id("reset-settings-btn");

    public SettingsPage(WebDriver driver) {
        super(driver);
    }

    public void toggleTheme() {
        click(themeToggleBtn);
    }

    public void selectLanguage(String lang) {
        selectByValue(languageSelect, lang);
    }

    public String generateApiKey() {
        click(generateApiKeyBtn);
        return getText(apiKeyDisplay);
    }

    public void setSessionTimeout(String minutes) {
        sendKeys(sessionTimeoutInput, minutes);
        click(saveSettingsBtn);
    }

    public void resetSettings() {
        click(resetDefaultsBtn);
    }
}
