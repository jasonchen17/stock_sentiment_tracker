import requests

# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

# Used to interact with the web page
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Sentiment analyzer
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from helpers import get_top_5_stocks_by_marketcap, format_time

def get_sentiment_data():
    # List of stock tickers
    tickers = get_top_5_stocks_by_marketcap()[0]
    
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
    sentiment_data = {ticker: {} for ticker in tickers}
    vader = SentimentIntensityAnalyzer()

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
            
            # Format the date
            date = date.strftime('%Y-%m-%d')

            # Calculate the sentiment score for the title
            sentiment_score = vader.polarity_scores(title)['compound']

            # Store in sentiment_data
            if date not in sentiment_data[ticker]:
                sentiment_data[ticker][date] = []
            sentiment_data[ticker][date].append(sentiment_score)

    # Calculate mean sentiment score for each date
    for ticker in sentiment_data:
        for date in sentiment_data[ticker]:
            scores = sentiment_data[ticker][date]
            mean_score = sum(scores) / len(scores)
            sentiment_data[ticker][date] = mean_score

            # Send the data to the API
            data = {
                'ticker': ticker,
                'date': date,
                'sentiment_score': mean_score
            }
            response = requests.post('http://localhost:5000/sentiments', json=data)
            print("Status code:", response.status_code)

if __name__ == '__main__':
    get_sentiment_data()