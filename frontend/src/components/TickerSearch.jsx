import React, { useState } from 'react';
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

function TickerSearch() {
    const [data, setData] = useState([]);
    const [inputTicker, setInputTicker] = useState('');
    const [priceData, setPriceData] = useState([]);

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
                setPriceData(response.data.prices); // Update price data state
                fetchData(inputTicker); // Fetch sentiment data for the specific ticker
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async (ticker) => {
        try {
            const response = await axios.get(`http://localhost:5000/sentiments/${ticker}`);
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <StyledContainer>
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
                
                    {inputTicker !== '' && (
                        <>
                            {priceData.length > 0 && (
                                <div className="price-table">
                                    <h2>Price Data for {inputTicker}</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Close Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {priceData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.date}</td>
                                                    <td>{data.close_price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {data.length > 0 && (
                                <div className="data-table">
                                    <h2>Sentiment Score Chart for {inputTicker}</h2>
                                    <div style={{ height: '400px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data}>
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
                                </div>
                            )}

                            {data.length === 0 && priceData.length === 0 && (
                                <div className="error-message">
                                    <p>No data found for the entered ticker.</p>
                                </div>
                            )}
                        </>
                    )}
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

export default TickerSearch;