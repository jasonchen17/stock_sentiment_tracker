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

    return (
        <Layout>
            <NavBar>
                <h1>Stock Sentiment Analysis</h1>
            </NavBar>
            <StyledContainer>
                <div className="chart-container">
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid />
                            <XAxis dataKey="date" />
                            <YAxis domain={[-roundedMaxSentiment, roundedMaxSentiment]} />
                            <Tooltip />
                            <Legend />
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
                            <div className="name-cell">{topFiveStocks[1][index]}</div>
                            <div className="ticker-cell">{stock}</div>
                        </div>
                    ))}
                </div>
            </StyledContainer>
        </Layout>
    );
}

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    font-family: Geneva, Verdana, sans-serif;
`;

const NavBar = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100px;
    align-items: center;
    border-bottom: 2px solid;
`;

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    height: 500px;

    .chart-container {
        flex: 1;
    }

    .table-container {
        flex: 1;
        
        .table-header,
        .table-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        }

        .rank-header,
        .name-header,
        .ticker-header,
        .rank-cell,
        .name-cell,
        .ticker-cell {
        flex: 1;
        padding: 8px;
        }
    }
`;

export default Home;