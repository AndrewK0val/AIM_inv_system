import React from 'react';
import ReactDOM from 'react-dom/client';
import {Navbar, Footer} from './components/layout.jsx';
import {Home} from './components/home.jsx';
import {Items} from './components/items.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import { SearchProvider } from './SearchContext'; // Import your context



function App(){
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <SearchProvider>
    <App />
  </SearchProvider>
  </React.StrictMode>

);

