import React, { useState, useEffect } from "react";
import { API_ITEMS_URL, API_CATEGORIES_URL } from "./config";


function CategorySelect(props) {
  const [categories, setCategories] = useState([]);

  function fetchCategories() {
    return fetch(API_CATEGORIES_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unexpected Server response");
        }
        return response.json();
      })
      .then((data) => setCategories(data));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <select
      type="text"
      className="form-select"
      placeholder="select category"
      name="category"
      value={props.category}
      onChange={props.onChange}
    >
      {categories.map((category, index) => {
        return (
          <option key={index} value={category}>
            {category}
          </option>
        );
      })}
    </select>
  );
}

export default CategorySelect;