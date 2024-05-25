# Used to send HTTP requests and retrieve data from the web
from urllib.request import urlopen, Request

# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

# Used to interact with the web page
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from datetime import datetime, timedelta
import time

# Base URL to get stock page
yahoo_finance_url = 'https://finance.yahoo.com/quote/{}/news'

# List of stock tickers
tickers = ['AMZN']

# Dictionary to store the news tables
news = {}

# Open the browser in headless mode
chrome_options = Options()
chrome_options.add_argument('--headless')
browser = webdriver.Chrome(options=chrome_options)

# Function to scroll down the page to render more news
def scrollDown(ticker):
    # URL to get the news
    url = f'https://finance.yahoo.com/quote/{ticker}/news'

    # Open the URL in browser
    browser.get(url)

    # Wait for 10 seconds for the page to load
    browser.implicitly_wait(10)

    # Scroll 5 pages of news
    for i in range(30):
        # Scroll down to the bottom of the page
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

# Loop through each stock ticker
for ticker in tickers:
    # Scroll down the page to render more news
    scrollDown(ticker)

    # Get the page source after scrolling
    html = browser.page_source

    # Parse the HTML content of the web page
    soup = BeautifulSoup(html, features='html.parser')

    # Get item which holds all the news
    newsItem = soup.find_all('li', class_='stream-item')

    # Store item in dictionary
    news[ticker] = newsItem

# Iterate through the news items
for ticker, newsItem in news.items():
    # Iterate through each news item
    for item in newsItem:
        # Get the title and time of the news
        titleTag = item.find('h3')
        timeTag = item.find('div', class_='publishing')

        # Check if the title and time exist
        if not titleTag or not timeTag:
            continue
    
        # Get title
        title = titleTag.text

        # Clean the time
        rawTime = timeTag.text.strip()

        # Format has to be '• time'
        if '•' not in rawTime:
            continue
        timeParts= rawTime.split('•')
        if len(timeParts) > 1:
            cleanedTime = timeParts[-1].strip()
        else:
            cleanedTime = rawTime

        # Turn time into a date
        if not cleanedTime:
            continue

        if 'hours' in cleanedTime:
            publishedDate = datetime.now()
        elif 'yesterday' in cleanedTime:
            publishedDate = datetime.now() - timedelta(days=1)
        else:
            days = int(cleanedTime.split(' ')[0])
            publishedDate = datetime.now() - timedelta(days=days)

        # Format the date
        formattedDate = publishedDate.strftime('%m/%d/%Y')

        print([ticker, title, formattedDate], end='\n')

# Quit the browser
browser.quit()