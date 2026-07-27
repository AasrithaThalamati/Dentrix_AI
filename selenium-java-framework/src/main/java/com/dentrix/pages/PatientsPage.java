package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PatientsPage extends BasePage {

    private final By addPatientBtn = By.id("add-patient-btn");
    private final By patientNameInput = By.id("patient-name");
    private final By patientAgeInput = By.id("patient-age");
    private final By patientGenderDropdown = By.id("patient-gender");
    private final By patientPhoneInput = By.id("patient-phone");
    private final By savePatientBtn = By.id("save-patient-btn");
    private final By searchInput = By.id("patient-search");
    private final By patientTable = By.id("patients-table");
    private final By patientRow = By.className("patient-row");
    private final By deletePatientBtn = By.className("delete-patient-action");

    public PatientsPage(WebDriver driver) {
        super(driver);
    }

    public void addNewPatient(String name, String age, String gender, String phone) {
        click(addPatientBtn);
        sendKeys(patientNameInput, name);
        sendKeys(patientAgeInput, age);
        selectByValue(patientGenderDropdown, gender);
        sendKeys(patientPhoneInput, phone);
        click(savePatientBtn);
    }

    public void searchPatient(String keyword) {
        sendKeys(searchInput, keyword);
    }

    public boolean isPatientDisplayed(String patientName) {
        return isDisplayed(By.xpath("//td[contains(text(), '" + patientName + "')]"));
    }

    public void deletePatient(String patientName) {
        By rowDeleteBtn = By.xpath("//td[contains(text(), '" + patientName + "')]/following-sibling::td//button[@class='delete-patient-action']");
        click(rowDeleteBtn);
    }
}
