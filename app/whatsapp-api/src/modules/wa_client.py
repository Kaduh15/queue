from time import sleep
from urllib.parse import quote
from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import NoSuchElementException


def wait_element_exit(driver, by, element):
    while True:
        try:
            driver.find_element(by, element)
            sleep(1)
        except NoSuchElementException:
            break


def wait_element(driver: Chrome, by, element):
    while True:
        try:
            element_found = driver.find_element(by, element)
            return element_found
        except NoSuchElementException:
            sleep(1)


class WAClient:
    IS_LOGGED = False

    def __init__(self, headless=True):
        self.browser = self.createDriver(headless=headless)
        self.browser.get("https://web.whatsapp.com/")

        self.is_logged()

    def createDriver(self, headless=True):
        chrome_options = ChromeOptions()
        if headless:
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        prefs = {"profile.managed_default_content_settings.images": 2}
        # chrome_options.headless = headless

        chrome_options.add_experimental_option("prefs", prefs)
        myDriver = Chrome(
            service=ChromeService(ChromeDriverManager().install()),
            options=chrome_options,
        )

        return myDriver

    def is_logged(self):
        if self.IS_LOGGED:
            return self.IS_LOGGED

        try:
            item = bool(
                self.browser.execute_script(
                    "return window.localStorage.getItem(arguments[0]);", "last-wid-md"
                )
            )
            self.IS_LOGGED = item
            return self.IS_LOGGED
        except NoSuchElementException:
            return False

    def login(self):
        if self.is_logged():
            return

        qr_code = self.get_qr_code()
        print("QR Code: ", qr_code)
        wait_element_exit(self.browser, By.CLASS_NAME, "_19vUU")

        self.IS_LOGGED = True

    def get_qr_code(self):
        if self.is_logged():
            return None

        self.browser.get("https://web.whatsapp.com/")
        element = wait_element(self.browser, By.CSS_SELECTOR, "._19vUU[data-ref]")
        return element.get_attribute("data-ref")

    def send_message(self, phone, message):
        try:    
            if not self.is_logged():
                return False

            self.browser.get(
                f"https://web.whatsapp.com/send?phone={phone}&text={quote(message)}"
            )
            element = wait_element(self.browser, By.CSS_SELECTOR, "span[data-icon='send']")
            sleep(2)
            element.click()
            return True
        except Exception as e:
            print(e)
            return False
