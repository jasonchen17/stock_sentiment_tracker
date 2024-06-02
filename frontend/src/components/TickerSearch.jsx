import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { Layout } from '../styles/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TickerSearch() {
    // State for db sentiment data
    const [sentimentData, setSentimentData] = useState([]);

    // State for input ticker
    const [inputTicker, setInputTicker] = useState('');

    // State for price data
    const [priceData, setPriceData] = useState([]);

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get input ticker from state
        const inputTicker = e.target.elements.ticker.value;

        try {
            // Update inputTicker
            setInputTicker(inputTicker);
      
            // Start individual scraper which returns price data
            const response = await axios.post('http://localhost:5000/start-individual-scraper', {
                ticker: inputTicker,
            });

            // Log message from response
            console.log(response.data.message);

            // Update price data state
            setPriceData(response.data.prices);

            // Update data state
            setSentimentData(response.data.sentiment_data);
            
        } catch (error) {
            console.log(error);
        }
    };

    const pastSevenDatesFromPriceData = priceData
        .slice(0, 7)
        .reverse()
        .map((data) => data[1]);

    const filteredSentimentData = pastSevenDatesFromPriceData.map((date) => {
        const sentimentDataForDate = sentimentData[inputTicker]?.[date];
        return {
            ticker: inputTicker,
            date,
            sentimentScore: sentimentDataForDate || '-',
        };
    });
          
    const filteredPriceData = pastSevenDatesFromPriceData.map((date) => {
        const priceDataForDate = priceData.find((data) => data[1] === date);
        return {
            ticker: inputTicker,
            date,
            price: priceDataForDate?.[2] || '-',
        };
    });

    return (
        <Layout>
            <StyledContainer>
                <div className="search-container">
                    <h1>Search for a ticker</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="ticker" 
                            placeholder="Enter ticker" 
                            autoComplete="off"
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>

                <div className="sentiment-chart">
                <ResponsiveContainer>
                    <LineChart data={filteredSentimentData}>
                        <CartesianGrid vertical={false} horizontal={false}/>
                        <XAxis 
                            dataKey="date" 
                            tickLine={false}
                            tickFormatter={(date) => { 
                                { return format(parseISO(date), 'MMM, d'); }
                            }}
                            padding= {{ left: 50, right: 50 }}
                        />
                        <YAxis
                            tickLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => value.toFixed(3)}
                            padding= {{ top: 50, bottom: 50 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sentimentScore" name="Sentiment Score"/>
                    </LineChart>
                </ResponsiveContainer>
                </div>

                <div className="price-chart">
                    <ResponsiveContainer>
                        <LineChart data={filteredPriceData}>
                            <CartesianGrid vertical={false} horizontal={false}/>
                            <XAxis 
                                dataKey="date"
                                tickLine={false}
                                tickFormatter={(date) => { 
                                    { return format(parseISO(date), 'MMM, d'); }
                                }}
                                padding= {{ left: 50, right: 50 }}
                            />
                            <YAxis
                                tickLine={false}
                                domain={['auto', 'auto']}
                                padding= {{ top: 50, bottom: 50 }}
                            />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="price" name="Stock Price"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </StyledContainer>
        </Layout>
    );
}

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    height: 500px;

    @media (max-width: 768px) {
        flex-direction: column;
        height: 100%;
    }

    .search-container {
        flex: .5;
        display: flex;
        justify-content: center;
        margin: 30px;
        flex-direction: column;
        align-items: center;

        h1 {
            font-size: 1rem;
            align-self: flex-start;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 50%;

            input {
                border-radius: 10px;
                height: 40px;
                padding: 10px;
                font-size: 1rem;
            }
            
            button {
                border-radius: 10px;
                font-size: 1rem;
                height: 40px;
                color: grey;
                cursor: pointer;
            }
        }
    }

    .sentiment-chart {
        flex: 1;
        border: 2px solid;
        height: 500px;
        border-radius: 10px;
        padding: 20px;
        margin: 30px;
    }

    .price-chart {
        flex: 1;
        border: 2px solid;
        height: 500px;
        border-radius: 10px;
        padding: 20px;
        margin: 30px;
    }
`;

export default TickerSearch;