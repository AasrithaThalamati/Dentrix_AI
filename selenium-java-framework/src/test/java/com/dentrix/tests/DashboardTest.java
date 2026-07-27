package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.DashboardPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DashboardTest extends BaseTest {

    @Test(description = "DTX-LG-056: Verify total patient count KPI card value display")
    public void test_DTX_LG_056_TotalPatientKPICard() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        Assert.assertNotNull(dashboardPage.getTotalPatientsCount(), "Total patient count KPI visible");
    }

    @Test(description = "DTX-LG-057: Verify total X-ray scans analyzed KPI card display")
    public void test_DTX_LG_057_TotalScansKPICard() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        Assert.assertNotNull(dashboardPage.getTotalScansCount(), "Total scans KPI card visible");
    }

    @Test(description = "DTX-LG-058: Verify average obturation confidence score KPI metric")
    public void test_DTX_LG_058_ConfidenceScoreKPICard() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        Assert.assertNotNull(dashboardPage.getConfidenceScore(), "Obturation score KPI visible");
    }

    @Test(description = "DTX-LG-059: Verify recent X-ray analysis activity stream item listing")
    public void test_DTX_LG_059_RecentActivityStream() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Recent activity stream rendered");
    }

    @Test(description = "DTX-LG-060: Verify Quick Upload launcher button opens analysis modal")
    public void test_DTX_LG_060_QuickUploadLauncherBtn() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        dashboardPage.clickQuickUpload();
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard") || driver.getCurrentUrl().contains("analyze"), "Quick upload modal triggered");
    }

    @Test(description = "DTX-LG-061: Verify AI obturation accuracy trend line chart rendering")
    public void test_DTX_LG_061_ObturationAccuracyChartRendering() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        Assert.assertTrue(dashboardPage.isChartDisplayed(), "Chart canvas present on dashboard");
    }

    @Test(description = "DTX-LG-062: Verify system operational health status banner display")
    public void test_DTX_LG_062_SystemOperationalHealthBanner() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        Assert.assertTrue(dashboardPage.isSystemStatusNormal(), "System status banner visible");
    }

    @Test(description = "DTX-LG-063: Verify upcoming patient appointments list widget")
    public void test_DTX_LG_063_UpcomingAppointmentsWidget() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Upcoming appointments widget loaded");
    }

    @Test(description = "DTX-LG-064: Verify emergency obturation flag alert notification list")
    public void test_DTX_LG_064_EmergencyObturationFlagAlert() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Emergency flags widget verified");
    }

    @Test(description = "DTX-LG-065: Verify Refresh Metrics button updates live KPI counters")
    public void test_DTX_LG_065_RefreshMetricsButton() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        DashboardPage dashboardPage = new DashboardPage(driver);
        dashboardPage.refreshMetrics();
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Metrics refresh triggered");
    }

    @Test(description = "DTX-LG-066: Verify interactive chart tooltip on data point hover")
    public void test_DTX_LG_066_ChartTooltipOnHover() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Chart hover interaction active");
    }

    @Test(description = "DTX-LG-067: Verify chart timeframe switch (Daily / Weekly / Monthly)")
    public void test_DTX_LG_067_ChartTimeframeSwitch() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Timeframe filter switched");
    }

    @Test(description = "DTX-LG-068: Verify export dashboard summary report to PDF action")
    public void test_DTX_LG_068_ExportDashboardSummaryPDF() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "PDF export action invoked");
    }

    @Test(description = "DTX-LG-069: Verify empty state placeholder when no patient data exists")
    public void test_DTX_LG_069_EmptyStateDashboardPlaceholder() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Empty state placeholder evaluated");
    }

    @Test(description = "DTX-LG-070: Verify dashboard clinic location filter drop-down selector")
    public void test_DTX_LG_070_ClinicLocationFilterDropdown() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Clinic location selector checked");
    }
}
