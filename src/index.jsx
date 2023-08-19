import React from 'react';
import ReactDOM from 'react-dom/client';
import {Navbar, Footer} from './components/layout.jsx';
import {Home} from './components/home.jsx';
import {Items} from './components/items.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';


function App(){
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

