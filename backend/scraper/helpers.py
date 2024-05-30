# Used to send HTTP requests and retrieve data from the web
from urllib.request import urlopen, Request

# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

from datetime import datetime, timedelta


def get_top_5_stocks_by_marketcap():
    url = 'https://finviz.com/screener.ashx?v=111&o=-marketcap'
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = Request(url, headers=headers)
    response = urlopen(req)
    html = BeautifulSoup(response, features='html.parser')

    rows = html.find_all('tr', {'class': 'styled-row is-hoverable is-bordered is-rounded is-striped has-color-text'})

    stocks = [[] for i in range(2)]
    company_names = set()

    for row in rows:
        if len(stocks[0]) == 5:
            break

        ticker = row.find('a', {'class': 'tab-link'}).text.strip()
        company_name = row.find_all('td')[2].text.strip()

        if company_name in company_names:
            continue

        stocks[0].append(ticker)
        stocks[1].append(company_name)
        company_names.add(company_name)

    return stocks


def format_time(raw_time):
    # Format has to be '• time'
    if '•' not in raw_time:
        return None

    time_parts= raw_time.split('•')

    if len(time_parts) > 1:
        cleaned_time = time_parts[-1].strip()
    else:
        cleaned_time = raw_time

    # Turn time into a date
    if not cleaned_time:
        return None

    if 'hours' in cleaned_time or 'minutes' in cleaned_time:
        published_date = datetime.now()
    elif 'yesterday' in cleaned_time:
        published_date = datetime.now() - timedelta(days=1)
    elif 'days' in cleaned_time:
        days = int(cleaned_time.split(' ')[0])
        published_date = datetime.now() - timedelta(days=days)
    else:
        return None

    return published_date