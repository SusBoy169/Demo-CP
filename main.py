from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pandas as pd

# Initialize Selenium WebDriver
def initialize_driver():
    driver = webdriver.Chrome()  # Ensure you have the ChromeDriver installed and in PATH
    driver.get('file:///path/to/your/html/file.html')  # Replace with the actual path to your HTML file
    return driver

# Wait for the loading screen to disappear
def wait_for_loading(driver):
    WebDriverWait(driver, 10).until(
        EC.invisibility_of_element((By.ID, "loading-screen"))
    )

# Submit form data
def submit_form(driver, name, student_class, student_id, section, total_food, food_waste):
    driver.find_element(By.ID, "name").send_keys(name)
    driver.find_element(By.ID, "class").send_keys(student_class)
    driver.find_element(By.ID, "id").send_keys(student_id)
    driver.find_element(By.ID, "section").send_keys(section)
    driver.find_element(By.ID, "total-food").send_keys(total_food)
    driver.find_element(By.ID, "food-waste").send_keys(food_waste)

    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)  # Wait for the transition to the dashboard

# Extract leaderboard data
def extract_leaderboard_data(driver):
    data = []
    
    # Left section (less food waste)
    left_cards = driver.find_elements(By.CSS_SELECTOR, "#leaderboard-left-cards .leaderboard-card")
    for card in left_cards:
        data.append(parse_card(card, "Less Food Waste"))

    # Right section (more food waste)
    right_cards = driver.find_elements(By.CSS_SELECTOR, "#leaderboard-right-cards .leaderboard-card")
    for card in right_cards:
        data.append(parse_card(card, "More Food Waste"))

    return data

# Parse a single card
def parse_card(card, category):
    name = card.find_element(By.TAG_NAME, "h3").text
    student_id = card.find_element(By.XPATH, "//p[contains(text(), 'ID:')]").text.split(": ")[1]
    section = card.find_element(By.XPATH, "//p[contains(text(), 'Section:')]").text.split(": ")[1]
    student_class = card.find_element(By.XPATH, "//p[contains(text(), 'Class:')]").text.split(": ")[1]
    waste_percentage = card.find_element(By.XPATH, "//p[contains(text(), 'Waste:')]").text.split(": ")[1]
    
    return {
        "Name": name,
        "ID": student_id,
        "Section": section,
        "Class": student_class,
        "Waste Percentage": waste_percentage,
        "Category": category
    }

# Save data to Excel
def save_to_excel(data, filename="leaderboard_data.xlsx"):
    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f"Data saved to {filename}")

# Main script
def main():
    driver = initialize_driver()
    wait_for_loading(driver)

    # Example form submissions
    submit_form(driver, "Alice", "8", "1001", "A", 500, 50)
    submit_form(driver, "Bob", "8", "1002", "B", 600, 200)
    
    # Extract leaderboard data
    leaderboard_data = extract_leaderboard_data(driver)

    # Save data to Excel
    save_to_excel(leaderboard_data)

    driver.quit()

if __name__ == "__main__":
    main()

