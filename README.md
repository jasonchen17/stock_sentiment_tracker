# Stock Sentiment Tracker

## Description
This project is a stock sentiment analysis dashboard built with React that visualizes sentiment scores for the top five stocks over the past seven days. It fetches data from a backend API and displays the information using a bar chart and a table. The dashboard provides a clear and interactive way to monitor stock sentiment trends.

![home](https://github.com/jasonchen17/stock_sentiment_tracker/assets/123552646/c5ec11e4-1bac-45a8-b76b-bbd482a3b2cc)

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
