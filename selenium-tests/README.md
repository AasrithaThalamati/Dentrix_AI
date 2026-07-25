# Dentrix AI — E2E Selenium JS Login Tests

This directory contains the automated End-to-End login test suite written in JavaScript for the **Dentrix AI** frontend. It runs a minimum of 300 test scenarios validating validations, viewport scaling, SQL injection resistance, and input boundaries.

---

## 🚀 Key Features

*   **Node.js & Webdriver**: Built on `selenium-webdriver` for Chrome browser E2E flows.
*   **300 Permutations**: Programmatically generates 300 parameterized test cases to test credentials, viewport scaling, SQLi, and field boundaries.
*   **Mock Network Interceptors**: Overrides `window.fetch` inside browser scopes during test execution. This allows all 300 test cases to complete successfully in less than 30 seconds without triggering backend database rate limits.
*   **Custom Reports Compilation**:
    *   📊 **Excel sheet (`reports/Selenium_Website_Tests_300.xlsx`)**: Custom styled workbook using `xlsx-js-style` with a blue header, frozen rows, active autofilters, auto column dimensions, and conditional PASS (green), FAIL (red), and SKIP (yellow) rows.
    *   🌐 **HTML Report (`reports/report.html`)**: Interactive report table with clean margins.
    *   🧪 **JUnit XML (`reports/junit.xml`)**: Pipeline-compatible JUnit XML tags.
    *   📝 **Execution Trace (`reports/execution.log`)**: Log messages detailing current tests execution.

---

## 🛠️ Execution

1.  **Install dependencies**:
    ```bash
    cd selenium-tests
    npm install
    ```
2.  **Run the E2E tests**:
    ```bash
    npm test
    ```
3.  **View Output Reports**: All report artifacts are saved in `selenium-tests/reports/`.
