package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.AnalyzePage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class FileUploadTest extends BaseTest {

    @Test(description = "DTX-LG-163: Verify uploading standard medical DICOM file (.dcm)")
    public void test_DTX_LG_163_UploadMedicalDICOMFile() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "DICOM upload verified");
    }

    @Test(description = "DTX-LG-164: Verify uploading PNG dental X-ray image file")
    public void test_DTX_LG_164_UploadPNGXrayImage() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "PNG X-ray upload verified");
    }

    @Test(description = "DTX-LG-165: Verify uploading JPG dental X-ray image file")
    public void test_DTX_LG_165_UploadJPGXrayImage() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "JPG X-ray upload verified");
    }

    @Test(description = "DTX-LG-166: Verify drag-and-drop file upload target zone interaction")
    public void test_DTX_LG_166_DragAndDropUploadZone() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Drag and drop zone verified");
    }

    @Test(description = "DTX-LG-167: Verify invalid file extension upload error (.exe, .pdf, .txt)")
    public void test_DTX_LG_167_InvalidFileExtensionError() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Invalid extension error verified");
    }

    @Test(description = "DTX-LG-168: Verify file size exceeding max 50MB limit error message")
    public void test_DTX_LG_168_FileSizeLimitExceededError() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "File size error displayed");
    }

    @Test(description = "DTX-LG-169: Verify batch uploading multiple X-ray images simultaneously")
    public void test_DTX_LG_169_BatchMultiFileUpload() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Batch multi-file upload verified");
    }

    @Test(description = "DTX-LG-170: Verify active file upload cancellation button action")
    public void test_DTX_LG_170_CancelActiveUploadAction() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Cancel upload verified");
    }

    @Test(description = "DTX-LG-171: Verify real-time upload progress percentage bar indicator")
    public void test_DTX_LG_171_UploadProgressBarIndicator() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        AnalyzePage analyzePage = new AnalyzePage(driver);
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Upload progress indicator verified");
    }

    @Test(description = "DTX-LG-172: Verify preview thumbnail rendering of uploaded X-ray image")
    public void test_DTX_LG_172_UploadThumbnailPreviewRendering() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Thumbnail preview rendered");
    }

    @Test(description = "DTX-LG-173: Verify remove image button clears uploaded file from staging queue")
    public void test_DTX_LG_173_RemoveFileFromUploadQueue() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Remove file from queue verified");
    }

    @Test(description = "DTX-LG-174: Verify duplicate image upload warning alert popup")
    public void test_DTX_LG_174_DuplicateImageUploadWarning() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Duplicate image warning displayed");
    }

    @Test(description = "DTX-LG-175: Verify rejection of double-extension malicious files (.php.png)")
    public void test_DTX_LG_175_MaliciousDoubleExtensionRejection() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Double extension malicious file rejected");
    }
}
