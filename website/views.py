from django.shortcuts import render
from .utils.helpers import get_top_5_stocks_by_marketcap
from .utils.main import get_sentiment_data

# Create your views here.
def home(request):
    tickers = get_top_5_stocks_by_marketcap()
    sentiment_data = get_sentiment_data()
    context = {
        'tickers': tickers,
        'sentiment_data': sentiment_data
    }
    return render(request, 'home.html', context)