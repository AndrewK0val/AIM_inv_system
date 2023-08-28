import React, { useState, useEffect } from "react";
import Card from "./card";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import exportFromJSON from 'export-from-json'
import axios from "axios";

var IpAddress = "localhost";
// var IpAddress = "192.168.0.174";


export default function CardsList(props){
    const [item, setItem] = useState([]);
    const [category, setCategory] = useState([]);
    const [stats, setStats] = useState(null);
    const [data, setData] = useState([])


  
    function fetchItems() {
      return fetch("http://192.168.0.174:3004/items/").then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server response");
        }
        return response.json();
      });
    }

    function fetchCategories() {
      return fetch("http://192.168.0.174:3006/categories/").then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server response");
        }
        return response.json();
      });
    }
  
    function countItems(items) {
      return items.length;
    }
  
    function countItemsInStock(items) {
        var count = 0;
        for(const item of items){
            var quantity = parseInt(item.quantity);
            if(item.quantity > 0){
                count += quantity;
            }
        }
        return count;
    }

  
    function displayStats() {
      fetchItems()
        .then((items) => {
          const itemsInStock = countItems(items);
          const totalItems = countItemsInStock(items);
          setStats({ totalItems, itemsInStock });
        })
        .catch((error) => console.log("Error: ", error));
    }
  
    useEffect(() => {
      // loadItemsData()
      fetchItems().then((data) => setItem(data));
      displayStats();
      fetchCategories().then((data) => setCategory(data));
    }, []);
  
    function deleteItem(id) {
      fetch("http://192.168.0.174:3004/items/" + id, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => fetchItems().then((data) => setItem(data)))
        .catch((error) => console.log("Error: ", error));
    }

    function handleClick(item) {
        console.log("clicked");
        props.showForm(item);
      }

      function valueItem(items){
        var value = 0;
        for(const item of items){
          if(item.price_type === 'pack'){
            value += item.price / item.items_in_pack * item.quantity;
          } else {
            value += item.price * item.quantity;
          }
        }
        return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      }
  
    return (
      <div>

        {/* <Sidebar categories={category} /> */}
        <div className="categoryDiv">
          {category.map((category, id) => {
            // Filter the items that match the current category
            const filteredItems = item.filter((item) => item.category === category);
            const typesOfItems = filteredItems.length;
            const totalValueInCategory = valueItem(filteredItems);
            const numberOfItemsPerCategory = countItemsInStock(filteredItems);
            return (
              <>
                <h1>  {category} - {typesOfItems} {typesOfItems === 1 ? 'Type' : 'Types'}, {numberOfItemsPerCategory} {numberOfItemsPerCategory === 1 ? 'item' : 'items'}</h1>
                <h5>value: € {totalValueInCategory}</h5>
                <div className="divBar-thin"></div>
                {filteredItems.map((item, id) => (

                    <Card item={item} key={id} deleteItem={deleteItem} editCSV={handleClick} />

                ))}
              </>
            );
          })}
        </div>
        {/* <div  id="cardContainer">
                    
          {item.map((item, id) => (
            <Card item={item} key={id} deleteItem={deleteItem} editCSV={handleClick} />
          ))}
        </div> */}
      </div>
    );


}