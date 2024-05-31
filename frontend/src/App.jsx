import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';
import Home from './components/Home';
import TickerSearch from './components/TickerSearch';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/testing" element={<TickerSearch />} />  
            </Routes>
        </BrowserRouter>
    )
}

export default App;
