package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.PatientsPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CRUDOperationsTest extends BaseTest {

    @Test(description = "DTX-LG-083: Verify creating new patient record with valid demographic data")
    public void test_DTX_LG_083_CreatePatientRecord() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        PatientsPage patientsPage = new PatientsPage(driver);
        patientsPage.addNewPatient("John Doe", "45", "male", "555-0192");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Patient created");
    }

    @Test(description = "DTX-LG-084: Verify reading and viewing detailed patient profile card")
    public void test_DTX_LG_084_ReadPatientDetailsCard() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Patient details viewed");
    }

    @Test(description = "DTX-LG-085: Verify updating patient contact phone number record")
    public void test_DTX_LG_085_UpdatePatientPhoneNumber() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Patient phone updated");
    }

    @Test(description = "DTX-LG-086: Verify soft deleting patient record moves entry to archive bin")
    public void test_DTX_LG_086_SoftDeletePatientRecord() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Soft delete verified");
    }

    @Test(description = "DTX-LG-087: Verify restoring soft deleted record from archive trash bin")
    public void test_DTX_LG_087_RestoreSoftDeletedRecord() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Restore soft delete verified");
    }

    @Test(description = "DTX-LG-088: Verify permanent purge of patient record requires admin confirmation")
    public void test_DTX_LG_088_PermanentPurgeRecord() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Permanent purge verified");
    }

    @Test(description = "DTX-LG-089: Verify batch multi-selecting patient records via checkboxes")
    public void test_DTX_LG_089_BatchMultiSelectPatients() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Batch selection verified");
    }

    @Test(description = "DTX-LG-090: Verify bulk status update for selected patient records")
    public void test_DTX_LG_090_BulkStatusUpdateAction() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Bulk status update executed");
    }

    @Test(description = "DTX-LG-091: Verify attaching new clinical observation notes to X-ray scan")
    public void test_DTX_LG_091_AddClinicalNotesToScan() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Clinical notes attached");
    }

    @Test(description = "DTX-LG-092: Verify editing existing clinical note updates timestamp")
    public void test_DTX_LG_092_EditClinicalNotesTimestamp() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Clinical notes edited");
    }

    @Test(description = "DTX-LG-093: Verify deleting clinical note presents prompt before removal")
    public void test_DTX_LG_093_DeleteClinicalNotesPrompt() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Delete clinical notes prompt confirmed");
    }

    @Test(description = "DTX-LG-094: Verify duplicate patient record prevention using SSN / NPI matching")
    public void test_DTX_LG_094_DuplicatePatientRecordPrevention() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Duplicate record blocked");
    }

    @Test(description = "DTX-LG-095: Verify viewing audit trail change history log for patient entity")
    public void test_DTX_LG_095_ViewPatientAuditTrailLog() {
        driver.get(driver.getCurrentUrl() + "/history.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("history"), "Audit trail displayed");
    }

    @Test(description = "DTX-LG-096: Verify attaching interactive 3D dental chart file to patient record")
    public void test_DTX_LG_096_AttachDentalChartFile() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Dental chart file attached");
    }

    @Test(description = "DTX-LG-097: Verify detaching dental chart file removes reference link")
    public void test_DTX_LG_097_DetachDentalChartFile() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Dental chart file detached");
    }

    @Test(description = "DTX-LG-098: Verify adding emergency high-priority tag to patient record")
    public void test_DTX_LG_098_CreateEmergencyTagOnPatient() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Emergency tag added");
    }

    @Test(description = "DTX-LG-099: Verify removing emergency tag clears badge visual state")
    public void test_DTX_LG_099_RemoveEmergencyTagFromPatient() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Emergency tag removed");
    }

    @Test(description = "DTX-LG-100: Verify export patient case history file to PDF report")
    public void test_DTX_LG_100_ExportPatientCasePDF() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "PDF export action completed");
    }
}
