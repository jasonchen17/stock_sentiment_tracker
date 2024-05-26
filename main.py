# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

# Used to interact with the web page
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd
import matplotlib.pyplot as plt

from helpers import get_top_5_stocks_by_marketcap, format_time

# List of stock tickers
tickers = get_top_5_stocks_by_marketcap()

# Dictionary to store the news tables
# key: stock ticker, value: news table
news = {}

# Open the browser in headless mode
chrome_options = Options()
chrome_options.add_argument('--headless')
browser = webdriver.Chrome(options=chrome_options)

# Loop through each stock ticker
for ticker in tickers:
    # URL to get the news
    url = f'https://finance.yahoo.com/quote/{ticker}/news'

    # Open the URL in browser
    browser.get(url)

    # Wait for 10 seconds for the page to load
    browser.implicitly_wait(10)

    for i in range(5):
        # Scroll down to the bottom of the page
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # Get the page source after scrolling
    html = browser.page_source

    # Parse the HTML content of the web page
    soup = BeautifulSoup(html, features='html.parser')

    # Get item which holds all the news
    news_items = soup.find_all('li', class_='stream-item')

    # Store item in dictionary
    news[ticker] = news_items

# Quit the browser
browser.quit()

# Store (ticker, title, date) in a list
data = []

# Iterate through the news items
for ticker, news_items in news.items():
    # Iterate through each news item
    for item in news_items:
        # Get the title and time of the news
        title_tag = item.find('h3')
        time_tag = item.find('div', class_='publishing')
    
        if not title_tag or not time_tag:
            continue

        # Get title and time
        title = title_tag.text
        date = format_time(time_tag.text)

        if not date:
            continue

        data.append((ticker, date, title))

# Create a DataFrame from the data
# df = pd.DataFrame(data, columns=['ticker', 'date', 'title'])
# vader = SentimentIntensityAnalyzer()
# f = lambda title: vader.polarity_scores(title)['compound']
# df['compound'] = df['title'].apply(f)
# df['date'] = pd.to_datetime(df['date']).dt.date  # Convert 'date' to date only

# plt.figure(figsize=(10,8))
# mean_df = df.groupby(['date', 'ticker'])['compound'].mean().unstack()

# # Group by date and calculate the mean sentiment score for each ticker
# mean_df = mean_df.groupby(mean_df.index).mean()

# # Plot the bar chart
# ax = mean_df.plot(kind='bar', rot=45)
# ax.set_xlabel('Date')
# ax.set_ylabel('Sentiment Score')
# ax.legend(title='Ticker', bbox_to_anchor=(1.05, 1), loc='upper left')

# plt.tight_layout()
# plt.show()