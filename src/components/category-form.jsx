import React, { useState, useEffect } from "react";

var IpAddress = "192.168.0.174";

export default function CategoryForm(props) {
  const [categories, setCategories] = useState([]);

  function fetchCategories() {
    return fetch("http://192.168.0.174:3006/categories/").then((response) => {
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
    fetch("http://192.168.0.174:3006/categories/", {
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

  function handleChange(event) {
    setCategories(event.target.value);
  }

  return (
    <div>
      {categories.map((category, index) => {
        return (
          <div key={index}>
            <h5>{category.name}</h5>
          </div>
        );
      })}

      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Category</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              name="categories"
              value={categories}
              onChange={(event) => handleChange(event)}
            />
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