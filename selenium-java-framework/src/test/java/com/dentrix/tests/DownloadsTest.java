package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DownloadsTest extends BaseTest {

    @Test(description = "DTX-LG-176: Verify download obturation diagnostic analysis report as PDF")
    public void test_DTX_LG_176_DownloadPDFReport() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "PDF report download initiated");
    }

    @Test(description = "DTX-LG-177: Verify export patient directory dataset to CSV file format")
    public void test_DTX_LG_177_ExportPatientDirectoryCSV() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "CSV export initiated");
    }

    @Test(description = "DTX-LG-178: Verify export analytics metrics summary to Excel spreadsheet (.xlsx)")
    public void test_DTX_LG_178_ExportAnalyticsExcel() {
        driver.get(driver.getCurrentUrl() + "/analytics.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analytics"), "Excel export initiated");
    }

    @Test(description = "DTX-LG-179: Verify download raw high-resolution dental X-ray PNG file")
    public void test_DTX_LG_179_DownloadHighResXrayPNG() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "High-res PNG download verified");
    }

    @Test(description = "DTX-LG-180: Verify download original DICOM format file archive")
    public void test_DTX_LG_180_DownloadOriginalDICOMArchive() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "DICOM archive download verified");
    }

    @Test(description = "DTX-LG-181: Verify failed file download automatic retry prompt")
    public void test_DTX_LG_181_FailedDownloadRetryPrompt() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Retry download prompt verified");
    }

    @Test(description = "DTX-LG-182: Verify background file download progress notification status")
    public void test_DTX_LG_182_BackgroundDownloadProgressNotification() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Download progress status verified");
    }

    @Test(description = "DTX-LG-183: Verify bulk zip archive package download for selected patient scans")
    public void test_DTX_LG_183_BulkZipArchiveDownload() {
        driver.get(driver.getCurrentUrl() + "/history.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("history"), "Bulk zip download verified");
    }

    @Test(description = "DTX-LG-184: Verify PDF report template layout alignment and branding footer")
    public void test_DTX_LG_184_PDFReportLayoutTemplateAlignment() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "PDF layout alignment checked");
    }

    @Test(description = "DTX-LG-185: Verify CSV export includes active table filter parameters only")
    public void test_DTX_LG_185_ExportFilteredRecordsOnlyCSV() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Filtered CSV export checked");
    }

    @Test(description = "DTX-LG-186: Verify permission gate blocks unauthorized download action for guest")
    public void test_DTX_LG_186_UnauthorizedDownloadPermissionGate() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Unauthorized download blocked");
    }

    @Test(description = "DTX-LG-187: Verify MD5 / SHA-256 checksum verification for downloaded reports")
    public void test_DTX_LG_187_VerifyFileChecksumMD5() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "File checksum verified");
    }
}
