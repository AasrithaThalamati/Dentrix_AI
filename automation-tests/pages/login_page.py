from selenium.webdriver.common.by import By
from pages.signup_page import SignupPage
import config
import time

class LoginPage(SignupPage):
    def __init__(self, driver):
        super().__init__(driver)

    def load(self):
        self.navigate_to(f"{config.BASE_URL}/signup.html")
        self.switch_to_login()

    def perform_login(self, email, password):
        self.type(self.LOGIN_EMAIL, email)
        self.type(self.LOGIN_PASSWORD, password)
        self.click(self.SIGN_IN_BTN)
        time.sleep(1)
        
    def get_alert_message(self):
        # Captures standard window alerts or toast message if any
        try:
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
            return alert_text
        except Exception:
            return None
