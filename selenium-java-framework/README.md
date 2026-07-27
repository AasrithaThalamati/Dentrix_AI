# Dentrix AI — Selenium 4 & TestNG Automation Framework (300 Unique Tests)

Enterprise-grade Java web automation testing framework built for **Dentrix AI Radiographic Obturation Intelligence**.

## Key Features

- **300 Unique Test Cases**: EXACTLY 300 distinct, non-duplicate test scenarios (`DTX-LG-001` through `DTX-LG-300`).
- **Zero Scenario Duplication**: Complete coverage across 24 application feature modules.
- **Page Object Model (POM)**: Reusable, maintainable page component classes (`LoginPage`, `DashboardPage`, `AnalyzePage`, `PatientsPage`, `SettingsPage`, etc.).
- **Selenium 4 & TestNG**: Modern WebDriver 4 engine with ThreadLocal driver isolation for parallel test support.
- **WebDriverManager**: Automatic browser driver binary management for Chrome, Firefox, Safari, and Edge.
- **Extent Reports 5**: Rich HTML test execution reports with dark theme, category breakdown, and execution logs.
- **Excel Report Generator**: Automated generation of `Dentrix_Test_Execution_Report.xlsx` containing 300 detailed test scenario rows.

---

## Suite Breakdown (300 Test Cases)

| # | Module / Feature Category | Test ID Range | Total Tests |
|---|---------------------------|---------------|-------------|
| 1 | **Authentication** | `DTX-LG-001` to `DTX-LG-015` | 15 |
| 2 | **Registration** | `DTX-LG-016` to `DTX-LG-030` | 15 |
| 3 | **Forgot Password** | `DTX-LG-031` to `DTX-LG-042` | 12 |
| 4 | **Profile Management** | `DTX-LG-043` to `DTX-LG-055` | 13 |
| 5 | **Dashboard** | `DTX-LG-056` to `DTX-LG-070` | 15 |
| 6 | **Navigation** | `DTX-LG-071` to `DTX-LG-082` | 12 |
| 7 | **CRUD Operations** | `DTX-LG-083` to `DTX-LG-100` | 18 |
| 8 | **Search** | `DTX-LG-101` to `DTX-LG-112` | 12 |
| 9 | **Filters** | `DTX-LG-113` to `DTX-LG-124` | 12 |
| 10 | **Sorting** | `DTX-LG-125` to `DTX-LG-136` | 12 |
| 11 | **Pagination** | `DTX-LG-137` to `DTX-LG-148` | 12 |
| 12 | **Forms** | `DTX-LG-149` to `DTX-LG-162` | 14 |
| 13 | **File Upload** | `DTX-LG-163` to `DTX-LG-175` | 13 |
| 14 | **Downloads** | `DTX-LG-176` to `DTX-LG-187` | 12 |
| 15 | **Notifications** | `DTX-LG-188` to `DTX-LG-199` | 12 |
| 16 | **Settings** | `DTX-LG-200` to `DTX-LG-214` | 15 |
| 17 | **Role Based Access** | `DTX-LG-215` to `DTX-LG-226` | 12 |
| 18 | **Permissions** | `DTX-LG-227` to `DTX-LG-238` | 12 |
| 19 | **API Integration** | `DTX-LG-239` to `DTX-LG-250` | 12 |
| 20 | **Responsive UI** | `DTX-LG-251` to `DTX-LG-262` | 12 |
| 21 | **Cross Browser** | `DTX-LG-263` to `DTX-LG-272` | 10 |
| 22 | **Accessibility** | `DTX-LG-273` to `DTX-LG-282` | 10 |
| 23 | **Security** | `DTX-LG-283` to `DTX-LG-292` | 10 |
| 24 | **Performance & E2E** | `DTX-LG-293` to `DTX-LG-300` | 8 |
| | **TOTAL UNIQUE TESTS** | **`DTX-LG-001` to `DTX-LG-300`** | **300** |

---

## Directory Architecture

```
selenium-java-framework/
├── pom.xml
├── testng.xml
├── README.md
├── generate_excel_and_verify.py
├── reports/
│   ├── Dentrix_Test_Execution_Report.xlsx
│   └── ExtentReport.html
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── dentrix/
    │               ├── base/
    │               │   └── BaseTest.java
    │               ├── pages/
    │               │   ├── BasePage.java
    │               │   ├── LoginPage.java
    │               │   ├── SignupPage.java
    │               │   ├── DashboardPage.java
    │               │   ├── AnalyzePage.java
    │               │   ├── PatientsPage.java
    │               │   ├── ProfilePage.java
    │               │   ├── SettingsPage.java
    │               │   └── NavigationBar.java
    │               └── utils/
    │                   ├── DriverManager.java
    │                   ├── ExtentReportManager.java
    │                   ├── TestListener.java
    │                   └── ConfigReader.java
    └── test/
        └── java/
            └── com/
                └── dentrix/
                    └── tests/
                        ├── AuthenticationTest.java
                        ├── RegistrationTest.java
                        ├── ForgotPasswordTest.java
                        ├── ProfileTest.java
                        ├── DashboardTest.java
                        ├── NavigationTest.java
                        ├── CRUDOperationsTest.java
                        ├── SearchTest.java
                        ├── FiltersTest.java
                        ├── SortingTest.java
                        ├── PaginationTest.java
                        ├── FormsTest.java
                        ├── FileUploadTest.java
                        ├── DownloadsTest.java
                        ├── NotificationsTest.java
                        ├── SettingsTest.java
                        ├── RoleBasedAccessTest.java
                        ├── PermissionsTest.java
                        ├── APIIntegrationTest.java
                        ├── ResponsiveUITest.java
                        ├── CrossBrowserTest.java
                        ├── AccessibilityTest.java
                        ├── SecurityTest.java
                        └── PerformanceE2ETest.java
```

---

## How to Execute

### 1. Run Excel Generation & Integrity Check
```bash
python3 generate_excel_and_verify.py
```

### 2. Run TestNG Test Suite via Maven
```bash
mvn clean test
```

---

## Verification Results

- **Total Tests**: `300`
- **Duplicate Scenarios**: `0`
- **Duplicate Test IDs**: `0`
- **Duplicate Selenium Scripts**: `0`
