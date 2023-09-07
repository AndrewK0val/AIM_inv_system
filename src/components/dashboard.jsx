import React, { useState, useEffect } from "react";
import axios from "axios";
import exportFromJSON from 'export-from-json'
import { event } from "jquery";
import { Items } from "./items";
import { useSearch } from '../SearchContext'


export default function Dashboard(props){
  const { searchQuery, handleSearch } = useSearch();
  const [item, setItem] = useState([]);
  const [stats, setStats] = useState(null);

  

    function fetchItems() {
        return fetch("http://192.168.0.174:3004/items/").then((response) => {
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
          return count.toLocaleString("en-US").replace(/\B(?=(\d{3})+(?!\d))/g, "'");
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
        fetchItems().then((data) => setItem(data));
          console.log("searchQuery in Dashboard:", props.searchQuery);

        displayStats();
      }, [props.searchQuery]);

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


    return(
      <div id="buttonContainer">
        <h2>Inventory</h2>
        <div className="divBar"></div>
            <h4 className="text-center mb-3" id="stats-1">
                {stats ? `${stats.itemsInStock} Item Types ` : "Loading..."}{" "}
            </h4>
            <h5 className="text-center mb-3" id="stats-1">
                {stats ? `${stats.totalItems} Total Items in Stock` : "Loading..."}{" "}
            </h5>

            <h4 id="stats-1">Total Stock Value: €{valueItem(item)}</h4>
            <div className="divBar-thin"></div>

        <div className="rowOfOptions">
            <button
                onClick={() => props.showForm({})}
                type="button"
                className="btn btn-primary me-2"
            >
                {" "}
                Add Items
            </button>
            <button
                onClick={() => fetchItems().then((data) => setItem(data))}
                type="button"
                className="btn btn-primary me-2"
            >
                {" "}
                Refresh
            </button>
            <button
                type="button"
                onClick={() => {
                exportFromJSON({
                    data: item,
                    fileName: "download",
                    exportType: exportFromJSON.types.csv,
                });
                }}
                className="btn btn-primary me-2"
            >
                {" "}
                Export CSV{" "}
            </button>
            <button type="button" className="btn btn-primary me-2">
                {" "}
                Import CSV{" "}
            </button>

            <button type="button" className="btn btn-primary me-2" onClick={() => props.showCategoryForm({})}>Add category</button>

            <form>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search Stock"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </form>

            {/* <div className="sortByMenu">
                Sort by:
                <select type="button" name="sort by:"  id="sortSelector">
                    <option value="category">category</option>
                    <option value="brand">brand</option>
                    <option value="price-hl">price (highest to lowest)</option>
                    <option value="price-lh">price (lowest to highest)</option>
                </select>
                </div> */}
        </div>
        
             {/* <div className="dashboardButtonRow2">
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search Stock"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>  */}

    </div>
    )    
}