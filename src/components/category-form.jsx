import React, { useState, useEffect } from "react";
const fs = require('fs');


export default function CategoryForm(props){

    
    function fetchItems() {
        return fetch("http://192.168.0.174:3004/items/").then((response) => {
            if (!response.ok) {
                throw new Error("Unexpected Server response");
            }
            return response.json();
        });
    }
    const [item, setItem] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetchItems().then((data) => setItem(data));
      }, []);
    

    // function getListOfCategories(items){
    //     var categories = [];
    //     for(const item of items){
    //       if(!categories.includes(item.category)){
    //         categories.push(item.category);
    //       } 
    //     }
    //     console.log(categories);
    //     //send categories to server
    //     fetch('http://localhost:3000/categories', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(categories)
    //       })
    //       .then(response => {
    //         if(!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         console.log('Categories sent to server');
    //       })
    //       .catch(error => {
    //         console.error('Error sending categories to server:', error);
    //       });
    //   }


    // function displayCategories() {
    //     fetchItems()
    //       .then((items) => {
    //         getListOfCategories(items); })
    //       .catch((error) => console.log("Error: ", error));
    //   }

    

    return(
        <div>
          <form type="submit">
            <table>
                <thead> 
                  <td>name</td>
                </thead>
                <tbody>
                  <td></td>
                </tbody>
            </table>

          </form>


        <button className="btn btn-primary" onClick={displayCategories}> get list</button>
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