package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class NavigationBar extends BasePage {

    private final By brandLogo = By.className("brand-name");
    private final By dashboardLink = By.linkText("Dashboard");
    private final By smileDesignLink = By.linkText("Smile Design");
    private final By researchLink = By.linkText("Research");
    private final By analyzeLink = By.linkText("Analyze X-Ray");
    private final By settingsLink = By.linkText("Settings");
    private final By profileLink = By.id("nav-user-name");
    private final By logoutBtn = By.className("nav-logout-btn");
    private final By hamburgerBtn = By.id("hamburger");

    public NavigationBar(WebDriver driver) {
        super(driver);
    }

    public void goToDashboard() { click(dashboardLink); }
    public void goToSmileDesign() { click(smileDesignLink); }
    public void goToResearch() { click(researchLink); }
    public void goToAnalyze() { click(analyzeLink); }
    public void goToSettings() { click(settingsLink); }
    public void goToProfile() { click(profileLink); }
    public void logout() { click(logoutBtn); }
    public void toggleMobileMenu() { click(hamburgerBtn); }
}
