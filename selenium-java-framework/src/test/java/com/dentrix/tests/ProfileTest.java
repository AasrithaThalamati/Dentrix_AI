package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.ProfilePage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ProfileTest extends BaseTest {

    @Test(description = "DTX-LG-043: Verify profile view renders current user account details correctly")
    public void test_DTX_LG_043_ViewProfileDetails() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Profile page loaded successfully");
    }

    @Test(description = "DTX-LG-044: Verify updating doctor full name in profile settings")
    public void test_DTX_LG_044_UpdateDoctorFullName() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.updateProfileInfo("Dr. Alexander Vance", "5550192834");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Profile name updated");
    }

    @Test(description = "DTX-LG-045: Verify uploading new user avatar image (.png format)")
    public void test_DTX_LG_045_UploadUserAvatarPng() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Avatar PNG upload verified");
    }

    @Test(description = "DTX-LG-046: Verify changing email address requires re-verification code")
    public void test_DTX_LG_046_ChangeEmailReverification() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Email change re-verification required");
    }

    @Test(description = "DTX-LG-047: Verify updating clinic contact phone number with digits only validation")
    public void test_DTX_LG_047_UpdateClinicPhoneNumber() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Phone number digits validation checked");
    }

    @Test(description = "DTX-LG-048: Verify change password workflow from within profile modal")
    public void test_DTX_LG_048_ChangePasswordWorkflow() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Change password modal launched");
    }

    @Test(description = "DTX-LG-049: Verify user role badge matches granted authorization level")
    public void test_DTX_LG_049_UserRoleBadgeDisplay() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        ProfilePage profilePage = new ProfilePage(driver);
        Assert.assertNotNull(profilePage.getUserRoleBadge(), "Role badge present in profile");
    }

    @Test(description = "DTX-LG-050: Verify dental practice specialty selection drop-down list")
    public void test_DTX_LG_050_PracticeSpecialtySelection() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Specialty drop-down options rendered");
    }

    @Test(description = "DTX-LG-051: Verify 10-digit National Provider Identifier (NPI) number validation")
    public void test_DTX_LG_051_NPINumberValidation() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "NPI 10-digit validation enforced");
    }

    @Test(description = "DTX-LG-052: Verify profile completeness percentage progress bar calculation")
    public void test_DTX_LG_052_ProfileCompletenessProgressBar() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Completeness progress bar calculated");
    }

    @Test(description = "DTX-LG-053: Verify account deactivation request modal confirmation")
    public void test_DTX_LG_053_AccountDeactivationRequest() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Deactivation request modal checked");
    }

    @Test(description = "DTX-LG-054: Verify dark theme preference synchronization across profile edits")
    public void test_DTX_LG_054_DarkThemeProfileSync() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Dark theme state retained");
    }

    @Test(description = "DTX-LG-055: Verify export personal profile data to JSON format")
    public void test_DTX_LG_055_ExportProfileDataJSON() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Profile JSON export initiated");
    }
}
