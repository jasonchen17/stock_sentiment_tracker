import React, { useState, useEffect} from 'react';
import axios from 'axios';

function Home() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/sentiments');
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
    <div>
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