# Used to send HTTP requests and retrieve data from the web
from urllib.request import urlopen, Request

# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

# Used to interact with the web page
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

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
    for i in range(5):
        # Scroll down to the bottom of the page
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait for 2 seconds for the page to load
        time.sleep(2)    

# Loop through each stock ticker
for ticker in tickers:
    # Scroll down the page to render more news
    scrollDown(ticker)

    # URL for the stock ticker
    url = yahoo_finance_url.format(ticker)

    # Send a request to the URL
    req = Request(url=url, headers={'user-agent': 'Mozilla/5.0'})

    # Get the response from the URL
    response = urlopen(req)

    # Parse the HTML content of the web page
    html = BeautifulSoup(response, features='html.parser')

    # Get item which holds all the news
    newsItem = html.find_all('li', class_='stream-item')

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
        if titleTag and timeTag:
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