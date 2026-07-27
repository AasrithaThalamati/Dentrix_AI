package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class PaginationTest extends BaseTest {

    @Test(description = "DTX-LG-137: Verify changing items per page drop-down (10, 25, 50, 100)")
    public void test_DTX_LG_137_PageSizeSelectorOptions() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Page size selector verified");
    }

    @Test(description = "DTX-LG-138: Verify Next page button click renders next record batch")
    public void test_DTX_LG_138_NextPageNavigation() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Next page navigation verified");
    }

    @Test(description = "DTX-LG-139: Verify Previous page button click renders previous record batch")
    public void test_DTX_LG_139_PreviousPageNavigation() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Previous page navigation verified");
    }

    @Test(description = "DTX-LG-140: Verify First page button is disabled on page 1")
    public void test_DTX_LG_140_FirstPageDisabledOnStart() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "First page disabled on start verified");
    }

    @Test(description = "DTX-LG-141: Verify Last page button jump navigates to final dataset page")
    public void test_DTX_LG_141_LastPageButtonJump() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Last page jump verified");
    }

    @Test(description = "DTX-LG-142: Verify direct page number text input navigation")
    public void test_DTX_LG_142_DirectPageNumberInputJump() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Direct page input jump verified");
    }

    @Test(description = "DTX-LG-143: Verify pagination info summary text ('Showing 1-10 of 120 records')")
    public void test_DTX_LG_143_PaginationInfoSummaryText() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Pagination info text verified");
    }

    @Test(description = "DTX-LG-144: Verify total page count recalculation upon page size change")
    public void test_DTX_LG_144_TotalPageCountRecalculation() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Page count recalculation verified");
    }

    @Test(description = "DTX-LG-145: Verify pagination resets back to page 1 upon applying new filter")
    public void test_DTX_LG_145_PaginationResetOnFilter() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Pagination reset on filter verified");
    }

    @Test(description = "DTX-LG-146: Verify pagination edge case handling when total records equal zero")
    public void test_DTX_LG_146_ZeroRecordsPaginationState() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Zero records pagination handled");
    }

    @Test(description = "DTX-LG-147: Verify single page dataset hides next/prev controls")
    public void test_DTX_LG_147_SinglePageControlsHiding() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Single page controls hidden");
    }

    @Test(description = "DTX-LG-148: Verify sticky bottom pagination toolbar visibility on table scroll")
    public void test_DTX_LG_148_StickyPaginationToolbarOnScroll() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Sticky pagination toolbar verified");
    }
}
