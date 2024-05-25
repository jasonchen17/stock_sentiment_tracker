# # Used to send HTTP requests and retrieve data from the web
# from urllib.request import urlopen, Request

# # Used to parse the HTML content of the web page
# from bs4 import BeautifulSoup

# # Used to analyze the sentiment of the news headlines
# from nltk.sentiment.vader import SentimentIntensityAnalyzer

# # Used to store the data in a tabular format
# import pandas as pd

# # Used to plot the data
# import matplotlib.pyplot as plt

# # Scrolldown

# # Base URL to get stock page
# yahoo_finance_url = 'https://finance.yahoo.com/quote/{}/news'

# # List of stock tickers
# tickers = ['AMZN']

# # Dictionary to store the news tables
# news_tables = {}

# # Loop through each stock ticker
# for ticker in tickers:
#     # URL for the stock ticker
#     url = yahoo_finance_url.format(ticker)

#     # Send a request to the URL
#     req = Request(url=url, headers={'user-agent': 'Mozilla/5.0'})

#     # Get the response from the URL
#     response = urlopen(req)

#     # Parse the HTML content of the web page
#     html = BeautifulSoup(response, features='html.parser')

#     # Get news-table which holds all the news
#     news_items = html.find_all('li', class_='stream-item')

#     # Store table in dictionary
#     news_tables[ticker] = news_items

# parsed_data = []

# for ticker, news_items in news_tables.items():
#     for item in news_items[:100]:
#         title_tag = item.find('h3')
#         time_tag = item.find('div', class_='publishing')
#         if title_tag and time_tag:
#             title = title_tag.text
#             raw_time = time_tag.text.strip()
#             parsed_data.append([ticker, title, raw_time])
#             print([ticker, title, raw_time], end='\n')


from selenium import webdriver
import time

# Open the browser
browser = webdriver.Chrome()

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

# Call the function to scroll down the page
scrollDown('AMZN')


# Close the browser


# Base URL to get stock page
# yahoo_finance_url = 'https://finance.yahoo.com/quote/{}/news'

# # List of stock tickers
# tickers = ['AMZN']

# # Dictionary to store the news tables
# news_tables = {}

# Loop through each stock ticker
# for ticker in tickers:
#     # URL for the stock ticker
#     url = yahoo_finance_url.format(ticker)

#     # Send a request to the URL
#     req = Request(url=url, headers={'user-agent': 'Mozilla/5.0'})

#     # Get the response from the URL
#     response = urlopen(req)

#     # Parse the HTML content of the web page
#     html = BeautifulSoup(response, features='html.parser')

#     # Get news-table which holds all the news
#     news_items = html.find_all('li', class_='stream-item')

#     # Store table in dictionary
#     news_tables[ticker] = news_items


# parsed_data = []

# for ticker, news_items in news_tables.items():
#     for item in news_items:  # Adjust the number of items to parse as needed
#         title_tag = item.find('h3')
#         time_tag = item.find('div', class_='C(#959595) Fz(11px) D(ib) Mb(6px)')
#         if title_tag and time_tag:
#             title = title_tag.text
#             raw_time = time_tag.text.strip()
#             parsed_data.append([ticker, title, raw_time])
#             print([ticker, title, raw_time], end='\n')



# df = pd.DataFrame(parsed_data, columns=['ticker', 'date', 'time', 'title'])

# vader = SentimentIntensityAnalyzer()

# f = lambda title: vader.polarity_scores(title)['compound']
# df['compound'] = df['title'].apply(f)
# df['date'] = pd.to_datetime(df.date).dt.date

# plt.figure(figsize=(10,8))
# mean_df = df.groupby(['ticker', 'date']).mean().unstack()
# mean_df = mean_df.xs('compound', axis="columns")
# mean_df.plot(kind='bar')
# plt.show()