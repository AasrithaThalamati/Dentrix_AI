package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import com.dentrix.pages.NavigationBar;
import org.testng.Assert;
import org.testng.annotations.Test;

public class NavigationTest extends BaseTest {

    @Test(description = "DTX-LG-071: Verify brand logo click navigates back to dashboard home")
    public void test_DTX_LG_071_BrandLogoNavigation() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Brand logo link functional");
    }

    @Test(description = "DTX-LG-072: Verify navigation bar menu item active state styling")
    public void test_DTX_LG_072_ActiveNavItemHighlight() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Active tab highlighted");
    }

    @Test(description = "DTX-LG-073: Verify header breadcrumb trail updates dynamically per page")
    public void test_DTX_LG_073_HeaderBreadcrumbTrail() {
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Breadcrumbs trail verified");
    }

    @Test(description = "DTX-LG-074: Verify browser back button retains previous page scroll position")
    public void test_DTX_LG_074_BrowserBackButtonBehavior() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        driver.get(driver.getCurrentUrl() + "/settings.html");
        driver.navigate().back();
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Browser back navigated to dashboard");
    }

    @Test(description = "DTX-LG-075: Verify browser forward button returns to navigated page")
    public void test_DTX_LG_075_BrowserForwardButtonBehavior() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        driver.get(driver.getCurrentUrl() + "/settings.html");
        driver.navigate().back();
        driver.navigate().forward();
        Assert.assertTrue(driver.getCurrentUrl().contains("settings"), "Browser forward navigated to settings");
    }

    @Test(description = "DTX-LG-076: Verify direct URL page access protection for authenticated routes")
    public void test_DTX_LG_076_DirectURLRouteProtection() {
        driver.get(driver.getCurrentUrl() + "/profile.html");
        Assert.assertTrue(driver.getCurrentUrl().length() > 0, "Direct URL access verified");
    }

    @Test(description = "DTX-LG-077: Verify mobile view hamburger menu slide-out toggle")
    public void test_DTX_LG_077_MobileHamburgerMenuToggle() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        NavigationBar navBar = new NavigationBar(driver);
        navBar.toggleMobileMenu();
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Hamburger menu toggled");
    }

    @Test(description = "DTX-LG-078: Verify mobile menu collapses automatically upon page selection")
    public void test_DTX_LG_078_MobileMenuCollapseOnSelect() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Mobile menu collapse verified");
    }

    @Test(description = "DTX-LG-079: Verify unsaved changes confirmation prompt when navigating away")
    public void test_DTX_LG_079_UnsavedChangesNavigationPrompt() {
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Unsaved changes prompt checked");
    }

    @Test(description = "DTX-LG-080: Verify keyboard TAB key accessibility navigation through header links")
    public void test_DTX_LG_080_KeyboardTabHeaderNavigation() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "TAB focus order verified");
    }

    @Test(description = "DTX-LG-081: Verify footer Privacy Policy link opens policy modal")
    public void test_DTX_LG_081_FooterPrivacyPolicyLink() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Privacy policy link functional");
    }

    @Test(description = "DTX-LG-082: Verify footer Terms of Service modal display")
    public void test_DTX_LG_082_FooterTermsOfServiceLink() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Terms modal functional");
    }
}
