import React, { useState, useEffect} from 'react';
import axios from 'axios';

function Home() {
    const [data, setData] = useState([]);
    const [topFiveStocks, setTopFiveStocks] = useState([]);

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
    return (
    <div>
        <ul>
            {topFiveStocks.map((stock, index) => (
                <li key={index}>
                    {stock}
                </li>
            ))}
        </ul>
        <ul>
        {data.map((item, index) => (
            <li key={index}>
            {item.ticker}, {item.date}, {item.sentiment_score}
            </li>
        ))}
        </ul>
    </div>
    );
}

export default Home;