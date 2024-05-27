from django.shortcuts import render
from ..data_scripts.helpers import get_top_5_stocks_by_marketcap

# Create your views here.
def home(request):
    return render(request, 'home.html', {})