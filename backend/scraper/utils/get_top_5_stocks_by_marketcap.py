# Used to send HTTP requests and retrieve data from the web
from urllib.request import urlopen, Request

# Used to parse the HTML content of the web page
from bs4 import BeautifulSoup

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