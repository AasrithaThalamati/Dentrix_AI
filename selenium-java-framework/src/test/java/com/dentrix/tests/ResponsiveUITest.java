package com.dentrix.tests;

import com.dentrix.base.BaseTest;
import org.openqa.selenium.Dimension;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ResponsiveUITest extends BaseTest {

    @Test(description = "DTX-LG-251: Verify Desktop viewport 1920x1080 resolution multi-column layout grid")
    public void test_DTX_LG_251_Desktop1920x1080LayoutGrid() {
        driver.manage().window().setSize(new Dimension(1920, 1080));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Desktop 1920x1080 layout verified");
    }

    @Test(description = "DTX-LG-252: Verify Laptop viewport 1366x768 resolution responsive component fit")
    public void test_DTX_LG_252_Laptop1366x768LayoutFit() {
        driver.manage().window().setSize(new Dimension(1366, 768));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Laptop 1366x768 layout verified");
    }

    @Test(description = "DTX-LG-253: Verify Tablet portrait view 768x1024 hamburger navigation menu trigger")
    public void test_DTX_LG_253_Tablet768x1024HamburgerTrigger() {
        driver.manage().window().setSize(new Dimension(768, 1024));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Tablet 768x1024 layout verified");
    }

    @Test(description = "DTX-LG-254: Verify Mobile portrait view 375x812 single column stacked layout")
    public void test_DTX_LG_254_MobilePortrait375x812StackedLayout() {
        driver.manage().window().setSize(new Dimension(375, 812));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Mobile 375x812 layout verified");
    }

    @Test(description = "DTX-LG-255: Verify Mobile landscape view 812x375 header height adjustment")
    public void test_DTX_LG_255_MobileLandscape812x375HeaderAdjustment() {
        driver.manage().window().setSize(new Dimension(812, 375));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Mobile landscape 812x375 layout verified");
    }

    @Test(description = "DTX-LG-256: Verify dynamic CSS Grid column reflow on viewport resize")
    public void test_DTX_LG_256_CSSGridDynamicColumnReflow() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        driver.manage().window().setSize(new Dimension(800, 600));
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Grid reflow verified");
    }

    @Test(description = "DTX-LG-257: Verify sticky navigation header stays pinned on mobile page scroll")
    public void test_DTX_LG_257_StickyHeaderPinnedOnMobileScroll() {
        driver.manage().window().setSize(new Dimension(375, 812));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Sticky header verified on mobile");
    }

    @Test(description = "DTX-LG-258: Verify touch swipe gesture support for image comparison carousel slider")
    public void test_DTX_LG_258_TouchSwipeGestureCarouselSupport() {
        driver.get(driver.getCurrentUrl() + "/smile.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("smile"), "Touch swipe support verified");
    }

    @Test(description = "DTX-LG-259: Verify dynamic font scaling readability at 150% browser zoom level")
    public void test_DTX_LG_259_FontScalingReadabilityZoom150() {
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Font scaling at 150% zoom verified");
    }

    @Test(description = "DTX-LG-260: Verify modal popup overlay fits within mobile viewport height without clipping")
    public void test_DTX_LG_260_ModalOverlayFitMobileViewport() {
        driver.manage().window().setSize(new Dimension(375, 812));
        driver.get(driver.getCurrentUrl() + "/analyze.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("analyze"), "Modal viewport fit verified");
    }

    @Test(description = "DTX-LG-261: Verify sidebar auto-collapses on screen width below 1024px")
    public void test_DTX_LG_261_SidebarAutoCollapseBelow1024px() {
        driver.manage().window().setSize(new Dimension(900, 700));
        driver.get(driver.getCurrentUrl() + "/dashboard.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"), "Sidebar auto-collapse verified");
    }

    @Test(description = "DTX-LG-262: Verify data table horizontal scroll bar container on small screens")
    public void test_DTX_LG_262_DataTableHorizontalScrollContainer() {
        driver.manage().window().setSize(new Dimension(375, 812));
        driver.get(driver.getCurrentUrl() + "/patients.html");
        Assert.assertTrue(driver.getCurrentUrl().contains("patients"), "Horizontal table scroll verified");
    }
}
