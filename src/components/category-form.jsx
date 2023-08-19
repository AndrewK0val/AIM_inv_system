import React, { useState, useEffect } from "react";

export default function CategoryForm(props){


    return(
        <div>
            <form action="">
                
            <div className="row">
                    <div className="col-sm-4 d-grid">
                        <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2" > Cancel</button>
                        </div>
                        <div className="col-sm-4 d-grid">
                     <button type="submit" className="btn btn-primary me-2"> Save</button>
                    </div>  
                </div>
            </form>
        </div>

        
    )
}