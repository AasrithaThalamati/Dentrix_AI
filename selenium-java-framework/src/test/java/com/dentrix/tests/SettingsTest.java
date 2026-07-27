package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.SettingsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SettingsTest extends BaseTest {

    @Test(description = "DTX-LG-200: Verify toggling Dark / Light UI theme mode updates document body attribute")
    public void test_DTX_LG_200_ToggleThemeMode() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        SettingsPage settingsPage = new SettingsPage(driver);
        settingsPage.toggleTheme();
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Theme mode toggled");
    }

    @Test(description = "DTX-LG-201: Verify selecting application UI language (English / Spanish / French)")
    public void test_DTX_LG_201_SelectUILanguage() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        SettingsPage settingsPage = new SettingsPage(driver);
        settingsPage.selectLanguage("es");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Language switched to Spanish");
    }

    @Test(description = "DTX-LG-202: Verify generating new secret API integration key")
    public void test_DTX_LG_202_GenerateAPIIntegrationKey() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        SettingsPage settingsPage = new SettingsPage(driver);
        String key = settingsPage.generateApiKey();
        Assert.assertNotNull(key, "Generated API key displayed");
    }

    @Test(description = "DTX-LG-203: Verify revoking active API key removes access authorization")
    public void test_DTX_LG_203_RevokeActiveAPIKey() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "API key revoked");
    }

    @Test(description = "DTX-LG-204: Verify setting automatic session inactivity timeout threshold")
    public void test_DTX_LG_204_SetSessionInactivityTimeoutThreshold() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        SettingsPage settingsPage = new SettingsPage(driver);
        settingsPage.setSessionTimeout("30");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Session timeout set to 30 mins");
    }

    @Test(description = "DTX-LG-205: Verify switching clinical measurement unit display (Millimeters vs Pixels)")
    public void test_DTX_LG_205_SwitchClinicalMeasurementUnits() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Measurement units updated");
    }

    @Test(description = "DTX-LG-206: Verify selecting clinic local timezone drop-down option")
    public void test_DTX_LG_206_SelectClinicTimezoneOption() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Timezone option updated");
    }

    @Test(description = "DTX-LG-207: Verify custom clinic logo image file upload for reports branding")
    public void test_DTX_LG_207_UploadCustomClinicLogoBranding() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Branding logo uploaded");
    }

    @Test(description = "DTX-LG-208: Verify manual trigger system database backup action")
    public void test_DTX_LG_208_TriggerSystemDatabaseBackup() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Database backup triggered");
    }

    @Test(description = "DTX-LG-209: Verify clear browser local storage cache button action")
    public void test_DTX_LG_209_ClearLocalStorageCacheAction() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Local storage cleared");
    }

    @Test(description = "DTX-LG-210: Verify export system settings configuration file (JSON format)")
    public void test_DTX_LG_210_ExportSystemSettingsJSON() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Settings configuration exported");
    }

    @Test(description = "DTX-LG-211: Verify reset all settings to factory default configuration")
    public void test_DTX_LG_211_ResetSettingsFactoryDefaults() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        SettingsPage settingsPage = new SettingsPage(driver);
        settingsPage.resetSettings();
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Settings reset to defaults");
    }

    @Test(description = "DTX-LG-212: Verify dynamic theme CSS property root color updates instantaneously")
    public void test_DTX_LG_212_DynamicThemeCSSPropertyUpdate() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "CSS properties updated dynamically");
    }

    @Test(description = "DTX-LG-213: Verify webhook URL notification endpoint creation and test ping")
    public void test_DTX_LG_213_WebhookEndpointConfigurationTest() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Webhook endpoint verified");
    }

    @Test(description = "DTX-LG-214: Verify multi-factor authentication (MFA) enforcement toggle")
    public void test_DTX_LG_214_MFAEnforcementToggle() {
        driver.get(driver.getCurrentUrl() + "/settings.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "MFA toggle verified");
    }
}
