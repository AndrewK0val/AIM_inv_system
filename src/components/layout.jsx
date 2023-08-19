import React from "react";
import {Link} from 'react-router-dom';

export function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">AIM Engineering</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
  
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/items">Table view</Link>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    )
}



export function Footer(){
    return(
        <footer>
            <div className="container p-3 mt-5 border-top">
                <small className="d-block text-muted text-center">&copy; 2023 - Andrew Koval</small>
            </div>
        </footer>
    )
}