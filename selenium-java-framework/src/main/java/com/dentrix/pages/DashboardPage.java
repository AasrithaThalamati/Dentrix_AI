package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {

    private final By totalPatientsCard = By.id("kpi-total-patients");
    private final By totalScansCard = By.id("kpi-total-scans");
    private final By confidenceScoreCard = By.id("kpi-confidence-score");
    private final By recentActivityList = By.className("recent-activity-item");
    private final By quickUploadBtn = By.id("quick-upload-btn");
    private final By systemStatusBanner = By.id("system-status-banner");
    private final By refreshMetricsBtn = By.id("refresh-metrics-btn");
    private final By chartCanvas = By.id("analyticsChart");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public String getTotalPatientsCount() {
        return getText(totalPatientsCard);
    }

    public String getTotalScansCount() {
        return getText(totalScansCard);
    }

    public String getConfidenceScore() {
        return getText(confidenceScoreCard);
    }

    public void clickQuickUpload() {
        click(quickUploadBtn);
    }

    public void refreshMetrics() {
        click(refreshMetricsBtn);
    }

    public boolean isChartDisplayed() {
        return isDisplayed(chartCanvas);
    }

    public boolean isSystemStatusNormal() {
        return isDisplayed(systemStatusBanner);
    }
}
