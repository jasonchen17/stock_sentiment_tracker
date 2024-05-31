import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    Rectangle,
    ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';
import { format, eachDayOfInterval, subDays } from 'date-fns';

function Home() {
    const [data, setData] = useState([]);
    const [topFiveStocks, setTopFiveStocks] = useState([[], []]);
    const [inputTicker, setInputTicker] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputTicker = e.target.elements.ticker.value;

        try {
            // Update inputTicker
            setInputTicker(inputTicker);
      
            axios.post('http://localhost:5000/start-individual-scraper', {
            ticker: inputTicker,
            })
            .then((response) => {
                console.log(response.data.message);
                fetchData();
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/sentiments');
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchTopFiveStocks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/top-5-stocks');
            setTopFiveStocks(response.data.top_5_stocks);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        fetchTopFiveStocks();
        fetchData();
    }, []);

    // Colors for each of the top 5 stocks
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

    // Create array of past 7 dates and format them
    const currentDate = new Date();
    const pastSevenDates = eachDayOfInterval({ start: subDays(currentDate, 7), end: subDays(currentDate, 1) })
        .map(date => format(date, 'yyyy-MM-dd'));

    // Iterate past 7 dates
    const chartData = pastSevenDates.map((date) => {
        // Create object with date key
        const dateData = { date };

        // Iterate top 5 stocks
        topFiveStocks[0].forEach((stock) => {
            let stockData = null;

            // Find stock data for the current date
            data.forEach(item => {
                // Check if the stock and date match
                if (item.ticker === stock && item.date === date) {
                    stockData = item;
                }
            });
            // Add stock data to date object or 0 if no data found
            dateData[stock] = stockData ? stockData.sentiment_score : 0;
        });
        return dateData;
    });

    // Create array of sentiment scores
    const sentimentScores = data.map(item => item.sentiment_score);

    // Find the absolute maximum sentiment score
    const maxSentiment = Math.max(...sentimentScores.map(Math.abs));

    const roundUp = (value) => {
        const factor = 10 ** Math.floor(Math.log10(value));
        const roundedValue = Math.ceil(value / factor) * factor;
        if (roundedValue * 1.2 <= 1) {
            return roundedValue * 1.2;
        } else {
            return roundedValue;
        }
    };

    const roundedMaxSentiment = roundUp(maxSentiment);

    const inputTickerData = data.filter(item => item.ticker === inputTicker);

    return (
        <Layout>
            <NavBar>
                <h1>Stock Sentiment Analysis</h1>
            </NavBar>
            <StyledContainer>
                <div className="main-container">
                    <div className="chart-container">
                        <h1>Sentiment Score Chart</h1>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid opacity={0.5} vertical={false}/>
                                <XAxis 
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(date) => { 
                                        { return format(date, 'MMM, d'); }
                                    }}
                                />
                                <YAxis 
                                    domain={[-roundedMaxSentiment, roundedMaxSentiment]} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={CustomTooltip} />
                                {topFiveStocks[0].map((stock, index) => (
                                    <Bar key={index} dataKey={stock} fill={colors[index]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="table-container"> 
                        <h1>Top Five Stocks by Market Cap</h1>
                        <div className="table-header">
                            <div className="rank-header">Rank</div>
                            <div className="name-header">Name</div>
                            <div className="ticker-header">Ticker</div>
                        </div>
                        
                        {topFiveStocks[0].map((stock, index) => (
                            <div key={index} className="table-row" color={colors[index]}>
                                <div className="rank-cell">{index + 1}</div>
                                <div className="ticker-cell">{stock}</div>
                                <div className="name-cell">{topFiveStocks[1][index]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="search-container">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="ticker" 
                            placeholder="Enter ticker" 
                            autoComplete="off"
                        />
                        <button type="submit">Submit</button>
                    </form>
                
                    <div className="data-table">
                        {inputTicker !== '' && inputTickerData.length === 0 && (
                            <div className="error-message">
                                <p>No news found or ticker doesn't exist.</p>
                            </div>
                        )}
                        {inputTicker !== '' && inputTickerData.length > 0 && (
                            <>
                                <h2>Sentiment Score Chart for {inputTicker}</h2>
                                <div style={{ height: '400px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={inputTickerData}>
                                            <CartesianGrid opacity={0.5} vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(date) => format(new Date(date), 'MMM, d')}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip content={CustomTooltip} />
                                            <Bar dataKey="sentiment_score" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </StyledContainer>
        </Layout>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (active) {
        return (
            <div className="tooltip">
                <h4>{format(label, "eeee, d MMM, yyyy")}</h4>
                {payload.map((stock, index) => (
                    <p key={index} style={{ color: stock.color }}>
                        {stock.name}: {stock.value}
                    </p>
                ))}
            </div>
        );
    }
}

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const NavBar = styled.div`
    display: flex;
    width: 100%;
    height: 100px;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
`;

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
    }

    .main-container {
        display: flex;
        height: 500px;

        .chart-container {
            display: flex;
            flex-direction: column;
            flex: 1;
            border: 2px solid;
            border-radius: 10px;
            margin: 30px;
            padding: 20px;
            padding-top: 0;
    
            h1 {
                text-align: left;
                padding-bottom: 15px;
            }
        }
    
        .table-container {
            display: flex;
            flex-direction: column;
            flex: 1;
            border: 2px solid;
            border-radius: 10px;
            padding: 20px;
            margin: 30px;
            padding-top: 0;
    
            .table-header,
            .table-row {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid;
            }
    
            .table-header {
                font-weight: bold;
                font-size: 1.2rem;
                
            }
    
            .table-row {
                font-size: 1.1rem;
            }
    
            div {
                flex: 1;
            }
    
            .rank-header,
            .name-header,
            .ticker-header,
            .rank-cell,
            .name-cell,
            .ticker-cell {
                margin: 10px;
            }
        }
    
        .tooltip {
            border-radius: 10px;
            padding: 1rem;
            text-align: left;
            margin: 100px;
            margin-top: 50px;
            h4 {
                margin-bottom: 10px;
                text-align: center;
            }
        }
    }

    .search-container {
        display: flex;
        margin: 30px;
        height: 500px;

        border: 2px solid red;
        border-radius: 10px;

        form {
            flex: .2;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            display: flex;
        }

        .data-table {
            flex: 1;
        }

    }
`;

export default Home;