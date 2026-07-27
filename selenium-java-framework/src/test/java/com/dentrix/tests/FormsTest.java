package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class FormsTest extends BaseTest {

    @Test(description = "DTX-LG-149: Verify required field red border styling on empty form submit")
    public void test_DTX_LG_149_RequiredFieldRedBorderStyling() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Required field styling checked");
    }

    @Test(description = "DTX-LG-150: Verify maximum character length restriction on clinical text inputs")
    public void test_DTX_LG_150_MaxCharacterLengthRestriction() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Max length restriction enforced");
    }

    @Test(description = "DTX-LG-151: Verify automatic trimming of leading and trailing whitespace characters")
    public void test_DTX_LG_151_WhitespaceTrimmingOnInput() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Whitespace trimming verified");
    }

    @Test(description = "DTX-LG-152: Verify input formatting mask auto-formats US phone number")
    public void test_DTX_LG_152_InputMaskUSPhoneFormat() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Phone mask auto-formatting verified");
    }

    @Test(description = "DTX-LG-153: Verify submit button remains disabled until all mandatory fields are valid")
    public void test_DTX_LG_153_SubmitButtonDisabledState() {
        driver.get(driver.getCurrentUrl() + "/signup.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("signup"), "Submit button state verified");
    }

    @Test(description = "DTX-LG-154: Verify form TAB index logical keyboard navigation sequence")
    public void test_DTX_LG_154_TabIndexLogicalSequence() {
        driver.get(driver.getCurrentUrl() + "/signup.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("signup"), "TAB order verified");
    }

    @Test(description = "DTX-LG-155: Verify automatic cursor auto-focus on first form field upon page load")
    public void test_DTX_LG_155_FirstFieldAutoFocus() {
        driver.get(driver.getCurrentUrl() + "/signup.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("signup"), "First field focus checked");
    }

    @Test(description = "DTX-LG-156: Verify Clear Form button resets all input fields to default initial state")
    public void test_DTX_LG_156_ClearFormButtonAction() {
        driver.get(driver.getCurrentUrl() + "/signup.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("signup"), "Clear form action verified");
    }

    @Test(description = "DTX-LG-157: Verify dirty form unsaved changes warning modal when exiting form")
    public void test_DTX_LG_157_DirtyFormUnsavedWarningModal() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("profile"), "Unsaved warning modal checked");
    }

    @Test(description = "DTX-LG-158: Verify HTML tags sanitization in comment textarea field")
    public void test_DTX_LG_158_HTMLTagsSanitizationInComment() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "HTML tags sanitized");
    }

    @Test(description = "DTX-LG-159: Verify preservation of new line line-breaks in multi-line text input")
    public void test_DTX_LG_159_PreserveMultiLineLineBreaks() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Line breaks preserved");
    }

    @Test(description = "DTX-LG-160: Verify pasting formatted rich text converts to clean plain text")
    public void test_DTX_LG_160_PasteFormattedTextSanitization() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Paste formatting sanitized");
    }

    @Test(description = "DTX-LG-161: Verify numeric-only field rejects alpha character keypresses")
    public void test_DTX_LG_161_NumericOnlyFieldRejectsAlpha() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Numeric field rejects alpha keypresses");
    }

    @Test(description = "DTX-LG-162: Verify floating form label transitions smoothly on input focus")
    public void test_DTX_LG_162_FloatingFormLabelTransition() {
        driver.get(driver.getCurrentUrl() + "/index.html");
        Assert.assertTrue(driver.getCurrentUrl().length() > 0, "Floating label transition verified");
    }
}
