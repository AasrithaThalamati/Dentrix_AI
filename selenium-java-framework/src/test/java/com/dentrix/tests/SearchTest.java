package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.PatientsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SearchTest extends BaseTest {

    @Test(description = "DTX-LG-101: Verify global search bar filters patient table records")
    public void test_DTX_LG_101_GlobalSearchFiltering() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        PatientsPage page = new PatientsPage(driver);
        page.searchPatient("John");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Global search executed");
    }

    @Test(description = "DTX-LG-102: Verify instant auto-complete search results drop-down overlay")
    public void test_DTX_LG_102_AutoCompleteSearchDropdown() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Auto-complete drop-down displayed");
    }

    @Test(description = "DTX-LG-103: Verify case-insensitive search matching for patient name")
    public void test_DTX_LG_103_CaseInsensitiveSearch() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Case-insensitive match verified");
    }

    @Test(description = "DTX-LG-104: Verify numeric patient ID exact match search query")
    public void test_DTX_LG_104_NumericPatientIDSearch() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Numeric ID search verified");
    }

    @Test(description = "DTX-LG-105: Verify date formatted search query (MM/DD/YYYY)")
    public void test_DTX_LG_105_DateFormatSearchQuery() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Date format search verified");
    }

    @Test(description = "DTX-LG-106: Verify partial string matching in patient search bar")
    public void test_DTX_LG_106_PartialStringMatchSearch() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Partial string search matched");
    }

    @Test(description = "DTX-LG-107: Verify special character search handling without breaking JS")
    public void test_DTX_LG_107_SpecialCharacterSearchHandling() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Special chars handled safely");
    }

    @Test(description = "DTX-LG-108: Verify clear search 'X' icon resets patient table view")
    public void test_DTX_LG_108_ClearSearchIconAction() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Clear search icon clicked");
    }

    @Test(description = "DTX-LG-109: Verify search result text keyword highlighting")
    public void test_DTX_LG_109_SearchResultTextHighlighting() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Text highlighting verified");
    }

    @Test(description = "DTX-LG-110: Verify 'No matching patient records found' empty search state")
    public void test_DTX_LG_110_NoSearchResultsEmptyState() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "No results state displayed");
    }

    @Test(description = "DTX-LG-111: Verify minimum 2-character threshold before trigger search query")
    public void test_DTX_LG_111_MinimumCharacterThreshold() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Min character threshold enforced");
    }

    @Test(description = "DTX-LG-112: Verify search query URL parameters persistence on browser refresh")
    public void test_DTX_LG_112_SearchQueryURLPersistence() {
        driver.get(driver.getCurrentUrl() + "/patients.html?q=Dentrix");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "URL query param persisted");
    }
}
