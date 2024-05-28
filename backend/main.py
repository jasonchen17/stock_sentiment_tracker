from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()