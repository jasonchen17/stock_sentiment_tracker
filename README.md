# Stock Sentiment Tracker

## Description
A stock sentiment analysis tracker based on news scraped from Yahoo Finance and Google News. Easily view weekly sentiment scores for top stocks and look up stock sentiments for individual tickers.

![home](https://github.com/jasonchen17/stock_sentiment_tracker/blob/main/screenshots/home.png?raw=true)

## Built With
- **Frontend**: React, Vite, Styled Components
- **Backend**: Flask, BeautifulSoup, Selenium, NLTK
- **Database**: MySQL

## Prerequisites
- Node
- npm
- Python
- MySQL

## Installation
1. **Clone the repository**
    ```bash
    git clone https://github.com/jasonchen17/stock_sentiment_tracker.git
    
    cd stock_sentiment_tracker
    ```

2. **Create a `.env` file in the `backend` directory**
- Make sure MySQL is running and add your connection URI
&nbsp;

    ```text
    SQLALCHEMY_DATABASE_URI=mysql://<username>:<password>@<hostname>:<port>/<database_name>
    ```

3. **Install backend dependencies**
    ```bash
    cd backend

  	# Setup virtual environment
  	python -m venv venv
  	venv\Scripts\activate

  	# Make sure you're using the Python interpreter from the virtual environment
    # Install necessary packages
  	pip install -r requirements.txt
  
  	# Install NLTK Vader
  	python
  	>>> import nltk
  	>>> nltk.download('vader_lexicon')
    >>> exit()
    ```

4. **Install frontend dependencies**
    ```bash
    cd frontend
    
    npm install
    ```

## Usage
1. **Start the backend server**
    ```bash
    cd backend
    
    python app.py
    ```

2. **Start the frontend application**
    ```bash
    cd frontend
    
    npm run dev
    ```

3. **Run the scraper for the top 5 stocks**
   ```bash
    cd backend
    
    python scraper/top_5_scraper.py
    ```

4. **Open your browser and go to [http://localhost:5173](http://localhost:5173) to view the application**
