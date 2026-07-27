package com.dentrix.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class AnalyzePage extends BasePage {

    private final By fileUploadInput = By.id("xray-file-input");
    private final By dropZone = By.id("upload-dropzone");
    private final By analyzeBtn = By.id("run-analysis-btn");
    private final By progressIndicator = By.id("analysis-progress");
    private final By resultScoreBadge = By.id("obturation-score-badge");
    private final By clinicalNotesTextarea = By.id("clinical-notes");
    private final By saveNotesBtn = By.id("save-notes-btn");
    private final By exportPdfBtn = By.id("export-pdf-report");

    public AnalyzePage(WebDriver driver) {
        super(driver);
    }

    public void uploadXrayImage(String absoluteFilePath) {
        sendKeys(fileUploadInput, absoluteFilePath);
    }

    public void clickRunAnalysis() {
        click(analyzeBtn);
    }

    public String getAnalysisScore() {
        return getText(resultScoreBadge);
    }

    public void addClinicalNote(String notes) {
        sendKeys(clinicalNotesTextarea, notes);
        click(saveNotesBtn);
    }

    public void downloadPdfReport() {
        click(exportPdfBtn);
    }

    public boolean isAnalysisProgressVisible() {
        return isDisplayed(progressIndicator);
    }
}
