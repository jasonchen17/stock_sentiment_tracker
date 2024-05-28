import subprocess
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from scraper.helpers import get_top_5_stocks_by_marketcap

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password123@localhost/stock_sentiment_db'

db = SQLAlchemy(app)

class Sentiment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(10), nullable=False)
    date = db.Column(db.Date, nullable=False)
    sentiment_score = db.Column(db.Float, nullable=False)

    def __init__(self, ticker, date, sentiment_score):
        self.ticker = ticker
        self.date = date
        self.sentiment_score = sentiment_score

@app.route('/start-scraper', methods=['POST'])
def start_scraper():
    command = 'python scraper/main.py'
    subprocess.Popen(command, shell=True)

    return jsonify({'message': 'Scraper started successfully'}), 200

@app.route('/sentiments', methods=['POST'])
def submit_sentiment():
    data = request.json

    sentiment = Sentiment(
        ticker = data.get('ticker'),
        date = datetime.strptime(data.get('date'), '%Y-%m-%d'),
        sentiment_score = data.get('sentiment_score')
    )

    db.session.add(sentiment)
    db.session.commit()

    return jsonify({'message': 'Sentiment data added successfully'}), 200

@app.route('/sentiments', methods=['GET'])
def get_sentiments():
    sentiments = Sentiment.query.all()

    result = []
    for sentiment in sentiments:
        result.append({
            'ticker': sentiment.ticker,
            'date': sentiment.date.strftime('%Y-%m-%d'),
            'sentiment_score': sentiment.sentiment_score
        })

    return jsonify(result), 200

@app.route('/top-5-stocks', methods=['GET'])
def top_5_stocks():
    tickers = get_top_5_stocks_by_marketcap()
    return jsonify({'top_5_stocks': tickers}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)