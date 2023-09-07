import React, { useState, useEffect } from "react";
import Card from "./card";

export default function SearchResults(props) {
  const [item, setItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
      const [category, setCategory] = useState([]);




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

  useEffect(() => {
    fetchItems().then((data) => setItem(data));
    fetchCategories().then((data) => setCategory(data));

  }, []);

  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

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

  const filteredItems = item.filter((item) => {
    const brand = item.brand ? item.brand : "";
    const itemName = item.name.toLowerCase();
    const category = item.category ? item.category.toLowerCase() : "";
    const search = searchQuery.toLowerCase();
    return itemName.includes(search) || category.includes(search) || brand.includes(search);
  });

  return (
    <div>
        <h1>Search Results</h1>
        <button onClick={() => props.showList()}>Back to list</button>

      <form>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search items"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </form>
      <ul>
        {filteredItems.map((item) => (
        //   <li key={item.id}>{item.name}</li>
        <Card item={item} key={item.id} deleteItem={deleteItem} editCSV={handleClick} />
        ))}
      </ul>



    </div>
  );
}