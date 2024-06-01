import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { Layout } from '../styles/Layout';

function TickerSearch() {
    // State for db sentiment data
    const [data, setData] = useState([]);

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
            setData(response.data.sentiment_data);
            
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
                </div>
            </StyledContainer>

            <div className="data">
                {Object.entries(data).map(([ticker, sentimentData]) => (
                    Object.entries(sentimentData).map(([date, sentimentScore]) => (
                        <tr key={`${ticker}-${date}`}>
                            <td>{ticker}</td>
                            <td>{date}</td>
                            <td>{sentimentScore}</td>
                        </tr>
                    ))
                ))}
            </div>

            <div className="price">
                {priceData.map(([ticker, date, price]) => (
                    <tr key={`${ticker}-${date}`}>
                        <td>{ticker}</td>
                        <td>{date}</td>
                        <td>{price}</td>
                    </tr>
                ))}
            </div>
        </Layout>
    );
}

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
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