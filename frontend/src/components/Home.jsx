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
import { Layout } from '../styles/Layout';
import TickerSearch from './TickerSearch';

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
    const colors = ['Red', 'Blue', 'DarkOrchid', 'Orange', 'SpringGreen'];

    // Create array of past 7 dates
    const currentDate = new Date();
    const pastSevenDates = eachDayOfInterval({ start: subDays(currentDate, 7), end: subDays(currentDate, 1) })
        .map(date => format(date, 'yyyy-MM-dd'));

    const chartData = pastSevenDates.map((date) => {
        const dateData = { date };

        topFiveStocks[0].forEach((stock) => {
            let stockData = null;

            data.forEach(item => {
                if (item.ticker === stock && item.date === date) {
                    stockData = item;
                }
            });
            dateData[stock] = stockData ? stockData.sentiment_score : 0;
        });
        return dateData;
    });

    // Set range of y-axis for readability
    const sentimentScores = data.map(item => item.sentiment_score);
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
                <div className="main-container">
                    <div className="chart-container">
                        <h1>Past 7 Sentiment Scores for Top 5 Stocks</h1>
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
                            <div key={index} className="table-row">
                                <div className="rank-cell" style={{color: colors[index]}}>{index + 1}</div>
            <div className="ticker-cell" style={{color: colors[index]}}>{stock}</div>
            <div className="name-cell" style={{color: colors[index]}}>{topFiveStocks[1][index]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <TickerSearch />
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
        margin-bottom: 30px;

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
                border-bottom: 2px solid;
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
                text-align: center;
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
`;

export default Home;