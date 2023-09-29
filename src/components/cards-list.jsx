import React, { useState, useEffect } from "react";
import Card from "./card";
// import Sidebar from "./sidebar";
// import Dashboard from "./dashboard";
import exportFromJSON from 'export-from-json'
// import { useSearch } from '../SearchContext'
import { API_ITEMS_URL, API_CATEGORIES_URL } from "./config";

var dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'))
dataSpyList.forEach(function (dataSpyEl) {
  bootstrap.ScrollSpy.getInstance(dataSpyEl)
    .refresh()
})


export default function CardsList(props){
  // const { searchQuery, handleSearch } = useSearch();
    const [item, setItem] = useState([]);
    const [category, setCategory] = useState([]);
    const [stats, setStats] = useState(null);
    const [data, setData] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTouched, setSearchTouched] = useState(false);

    function fetchItems() {
      return fetch(API_ITEMS_URL).then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server response");
        }
        return response.json();
      });
    }

    function fetchCategories() {
      return fetch(API_CATEGORIES_URL).then((response) => {
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


    function isItemLowStock(item) {
      if(item.price_type == "pack"){
        //get the item quantity and divide by the items in pack
        //if the quantity is 10% or less of the items in pack, return true
      }
    }

    // function fetchCountItemsOutOfStock() {
    //   return fetch("http://localhost:3007/items/out-of-stock-count")
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Unexpected Server response");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => data.count);
    // }

    function importCSV(){
        // open the file explorer, only allow csv files
        // the csv must follow the same format as the export csv except for the id
        // for every line in the new csv file, check if its barcode and title matches an existing item
        // if those conditions are met, update the item with the new quantity
    }



    function displayStats() {
      fetchItems()
        .then((items) => {
          const itemsInStock = countItems(items);
          const totalItems = countItemsInStock(items);
          const itemsOutOfStock = countItemsOutOfStock(items);
          setStats({ totalItems, itemsInStock, itemsOutOfStock });
        })
        .catch((error) => console.log("Error: ", error));
    }

    function countItemsOutOfStock(items) {
      var count = 0;
      for(const item of items){
          // var quantity = parseInt(item.quantity);
          if(item.quantity == 0){
              count += 1;
          }
      }
      return count;
    }
    useEffect(() => {
      fetchItems().then((data) => setItem(data));
      fetchCategories().then((data) => setCategory(data));
      displayStats();

    }, []);

    function deleteItem(id) {
      const confirmed = window.confirm("Are you sure you want to delete this item?");
      if (confirmed) {
        fetch(API_ITEMS_URL + id, { method: "DELETE" })
          .then((response) => response.json())
          .then((data) => fetchItems().then((data) => setItem(data)))
          .catch((error) => console.log("Error: ", error));
      }
    }

    function handleClick(item) {
      console.log("clicked");
      props.showForm(item);
    }

    function handleSearch(event) {
      setSearchTouched(true);
      setSearchQuery(event.target.value);
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

    const filteredItems = Array.isArray(item) ? item.filter((item) => {
      const brand = item.brand ? item.brand.toLowerCase() : "";
      const itemName = item.name.toLowerCase();
      const category = item.category ? item.category.toLowerCase() : "";
      const search = searchQuery.toLowerCase();
      const searchWords = search.split(" ");
      return searchWords.every((word) => {
        return itemName.includes(word) || category.includes(word) || brand.includes(word);
      });
    }) : [];

    return (
      <> 
      <div id="dashboard">
        <div id="titleSection">

          <h2>Inventory</h2>


        </div>
        <div className="divBar"></div>
        <div className="stats">
          <div className="statsLeft">
            <h4 className="text-center mb-3" id="stats-1">
                {stats ? `${stats.itemsInStock} Item Types ` : "Loading..."}{" "}
            </h4>
            <h5 className="text-center mb-3" id="stats-1">
                {stats ? `${stats.totalItems} Total Items in Stock` : "Loading..."}{" "}
            </h5>
            <h4 id="stats-1">Total Stock Value: €{valueItem(item)}</h4>
          </div>
          <div className="statsRight">
            {countItemsOutOfStock(item) !== 0 ? (
                  <h4 className="text-center mb-3" id="stats-1">
                    ❗{stats ? `${stats.itemsOutOfStock} ${stats.itemsOutOfStock === 1 ? 'Type' : 'Types'} of items out of stock❗`  : "Loading..."}{" "}
                  </h4>
                ):(
                  <h4></h4>
                )}
          </div>
        </div>

        <div className="rowOfOptions">
            <button
                onClick={() => props.showForm({})}
                type="button"
                className="btn btn-primary me-2"
            >
                {" "}
               ➕ Add Items
            </button>
            <button
                onClick={() => fetchItems().then((data) => setItem(data))}
                type="button"
                className="btn btn-primary me-2"
            >
                {" "}
                🔄️ Refresh
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
               📜 Export CSV{" "}
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
                onChange={handleSearch}
              />
            </div>
          </form>

          {/* {countItemsOutOfStock(item) !== 0 ? (
              <h4 className="text-center mb-3" id="stats-1">
                 ❗{stats ? `${stats.itemsOutOfStock} ${stats.itemsOutOfStock === 1 ? 'Type' : 'Types'} of items out of stock❗`  : "Loading..."}{" "}
              </h4>
            ):(
              <h4></h4>
            )} */}

        </div>
    </div>
      

      <div className="homeContainer">
        <div className="sidebar">
          <div className="fixed-container">
            {category.map((category, id) => {
              return(
                <div id="list-example" class="list-group">
                  <a class="list-group-item list-group-item-action" href={'#list-item-' + category}>{category}</a>
                </div>)
            })}
          </div>
        </div>

        <div  data-bs-spy="scroll" data-bs-target="#list-example" data-bs-offset="0" tabindex="0" className="categoryDiv">
          {searchTouched && searchQuery !== "" && (
            <>
            <h1 className="accordion-header">Search Results</h1>
            <div className="divBar-thin"></div>

            <div className="searchResults">
              {filteredItems.map((item) => (
                <Card item={item} key={item.id} deleteItem={deleteItem} editCSV={handleClick} />
              ))}
            </div>
            </> 
          )}
          {/* <table className="table table-striped"> */}
                {/* <tbody> */}
                    {category.map((category, id) => {
                      // Filter the items that match the current category
                      const CategorizedItems = Array.isArray(item) ? item.filter((item) => item.category === category) : [];
                      const typesOfItems = countItems(CategorizedItems);
                      const totalValueInCategory = valueItem(CategorizedItems);
                      const itemsOutOfStockInCategory = countItemsOutOfStock(CategorizedItems);
                      const numberOfItemsPerCategory = countItemsInStock(CategorizedItems);
                      return (
                        // <tr key={category}>

                          <div key={category} className="accordion-item">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#panelsStayOpen-collapse" + category} aria-expanded="true" aria-controls={"panelsStayOpen-collapse" + category}>
                            <h1 id={'#list-item-' + category}>  
                                {category} - {typesOfItems} {typesOfItems === 1 ? 'Type' : 'Types'}, {numberOfItemsPerCategory} {numberOfItemsPerCategory === 1 ? 'item' : 'items'}
                            </h1>
                            </button>
                            <h5>value: € {totalValueInCategory}</h5>
                            {itemsOutOfStockInCategory !== 0 ? (
                                <h5>⚠️{itemsOutOfStockInCategory} {itemsOutOfStockInCategory === 1 ? 'type' : 'types'} out of stock⚠️</h5>
                            ):(
                                <div></div>
                            )}
                            <div className="divBar-thin"></div>
                            <div id={"panelsStayOpen-collapse" + category} className="accordion-collapse collapse" aria-labelledby={"panelsStayOpen-heading" + category}>
                              {CategorizedItems.map((item, id) => (
                                <Card item={item} key={id} deleteItem={deleteItem} editCSV={handleClick} />
                              ))}
                            </div>
                          </div>
                        // </tr>
                      );
                    })}
                {/* </tbody> */}
          {/* </table> */}
        </div>
      </div>
      </>
    );
}