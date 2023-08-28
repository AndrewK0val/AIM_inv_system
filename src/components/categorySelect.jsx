import React, { useState, useEffect } from "react";

function CategorySelect(props) {
  const [categories, setCategories] = useState([]);

  function fetchCategories() {
    return fetch("http://192.168.0.174:3006/categories/")
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