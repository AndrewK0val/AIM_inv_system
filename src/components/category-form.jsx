import React, { useState, useEffect } from "react";
import { API_ITEMS_URL, API_CATEGORIES_URL } from "./config";


var IpAddress = "192.168.0.174";

export default function CategoryForm(props) {
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState([]);
  const [data, setData] = useState([])


  function fetchCategories() {
    return fetch(API_CATEGORIES_URL).then((response) => {
      if (!response.ok) {
        throw new Error("Unexpected Server response");
      }
      return response.json();
    });
  }

  function fetchItems() {
    return fetch(API_ITEMS_URL).then((response) => {
      if (!response.ok) {
        throw new Error("Unexpected Server response");
      }
      return response.json();
    });
  }

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetch(API_CATEGORIES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categories }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server Response");
        }
        return response.json();
      })
      .then((data) => props.showList())
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  function deleteCategoy(category){
    // when a category gets deleted, all items in that category get moved to the "misc" category
    //the misc category cannot be deleted
      const confirmed = window.confirm("Are you sure you want to delete this category?");
      

      // fetchItems()
      // .then((items) => {
      //   regroupItemsToMisc(category, items);
      // })
      // .catch((error) => console.log("Error: ", error));
      if (confirmed) {
        fetch(API_CATEGORIES_URL + category, { method: "DELETE" })
          .then((response) => response.json())
          .then((data) => fetchCategories().then((data) => setCategories(data)))
          .catch((error) => console.log("Error: ", error));
      }

      

  }

  function deleteItem(id) {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      fetch("http://192.168.0.174:3004/items/" + id, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => fetchItems().then((data) => setItem(data)))
        .catch((error) => console.log("Error: ", error));
    }

    
  }

  function regroupItemsToMisc(category, items){
    //loop over every item in db.json and change the category name to "misc" if it matches the category name
      for(const item of items){
        if(item.category == category){
          item.category == "Miscellaneous"
        }
      }
  }

  function renameCategory(category, updatedName){
      //change the name of the category in categories.json, then take that new name and loop over every item
      // in db.json and change the category name to the new name if it matches the old name
      const newCategoryName = updatedName;
      const oldCategoryName = category.name;

      for(const item of items){
        if(item.category === oldCategoryName){
          item.category = newCategoryName;
        }
      }

  }



  function handleChange(event) {
    setCategories(event.target.value);
  }

  return (
    <div>
          <div>
            <table className="table table-striped">
              <thead> 
                <tr>
                  <th>category </th>
                  <th>Actions </th>
                </tr>
              </thead>
              <tbody>
      {categories.map((category, index) => {
          return (

                <tr key={index}>
                  <td>{category}</td>
                  <td >
                    <button onClick={() => props.showForm(item)} type="button" className="btn btn-primary btn-sm" > Edit</button>
                    <button onClick={() => deleteCategoy(category)} type="button" className="btn btn-danger btn-sm" > Delete</button>
                  </td>
                </tr>
              )
            })}
              </tbody>
            </table>
          </div>

      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="row mb-3">
          <div id="inlineOptions">
          <label className="col-sm-4 col-form-label">Add Category</label>
          <input
              type="text"
              className="form-control"
              name="categories"
              // defaultValue={categories}
              onChange={(event) => handleChange(event)}
            />
          <button className="btn btn-primary"> Add</button>
          </div>
          <div className="col-sm-8">
  
          </div>
        </div>
      </form>

      <form action="">
        <div className="row">
          <div className="col-sm-4 d-grid">
            <button
              onClick={() => props.showList()}
              type="button"
              className="btn btn-secondary me-2"
            >
              Cancel
            </button>
          </div>
          <div className="col-sm-4 d-grid">
            <button type="submit" className="btn btn-primary me-2">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}