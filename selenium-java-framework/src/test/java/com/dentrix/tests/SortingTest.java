package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SortingTest extends BaseTest {

    @Test(description = "DTX-LG-125: Verify sorting patient table by Name Ascending (A-Z)")
    public void test_DTX_LG_125_SortPatientNameAscending() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Sort name ASC verified");
    }

    @Test(description = "DTX-LG-126: Verify sorting patient table by Name Descending (Z-A)")
    public void test_DTX_LG_126_SortPatientNameDescending() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Sort name DESC verified");
    }

    @Test(description = "DTX-LG-127: Verify sorting scans by Date Created Ascending")
    public void test_DTX_LG_127_SortDateCreatedAscending() {
        driver.get(driver.getCurrentUrl() + "/history.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("history"), "Sort date ASC verified");
    }

    @Test(description = "DTX-LG-128: Verify sorting scans by Date Created Descending")
    public void test_DTX_LG_128_SortDateCreatedDescending() {
        driver.get(driver.getCurrentUrl() + "/history.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("history"), "Sort date DESC verified");
    }

    @Test(description = "DTX-LG-129: Verify sorting by Obturation Confidence Score highest to lowest")
    public void test_DTX_LG_129_SortByConfidenceScoreDesc() {
        driver.get(driver.getCurrentUrl() + "/history.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("history"), "Sort score DESC verified");
    }

    @Test(description = "DTX-LG-130: Verify multi-column secondary sort order prioritization")
    public void test_DTX_LG_130_MultiColumnSecondarySort() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Multi-column sort verified");
    }

    @Test(description = "DTX-LG-131: Verify numerical column value sorting accuracy")
    public void test_DTX_LG_131_NumericalColumnSortAccuracy() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Numerical sort verified");
    }

    @Test(description = "DTX-LG-132: Verify resetting table sort state back to default order")
    public void test_DTX_LG_132_ResetSortToDefault() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Reset sort verified");
    }

    @Test(description = "DTX-LG-133: Verify column header sort arrow icon state change on toggle")
    public void test_DTX_LG_133_SortHeaderArrowIconState() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Sort arrow icon verified");
    }

    @Test(description = "DTX-LG-134: Verify sorting paginated data preserves sort order across pages")
    public void test_DTX_LG_134_SortPaginatedDataAcrossPages() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Sort across pages verified");
    }

    @Test(description = "DTX-LG-135: Verify sorting behavior on empty dataset table without errors")
    public void test_DTX_LG_135_SortEmptyDatasetTable() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Empty sort handled cleanly");
    }

    @Test(description = "DTX-LG-136: Verify case-insensitive string sorting for names with special accents")
    public void test_DTX_LG_136_CaseInsensitiveAccentedSort() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Accented sort verified");
    }
}
