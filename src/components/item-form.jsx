import React, { useState, useEffect } from "react";
import CategorySelect from "./categorySelect";
import UploadWidget from "./UploadWidget";

export default function ItemForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showItemsInPack, setShowItemsInPack] = useState(
    props.item.price_type === "pack"
  );
  const [category, setCategory] = useState([]);
  const [item, setItem] = useState(props.item);

  // Handle change in price type
  function handlePriceTypeChange(event) {
    const value = event.target.value;
    setShowItemsInPack(value === "pack");
    setItem((prevItem) => ({
      ...prevItem,
      price_type: value,
    }));
  }
  // Fetch categories from server
  function fetchCategories() {
    return fetch("http://192.168.0.174:3006/categories/").then((response) => {
      if (!response.ok) {
        throw new Error("Unexpected Server response");
      }
      return response.json();
    });
  }

  // Load categories on component mount
  useEffect(() => {
    fetchCategories().then((data) => setCategory(data));
  }, []);

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();

    // Form validation
    if (
      !item.name ||
      !item.barcode ||
      !item.quantity ||
      !item.category ||
      !item.price_type ||
      !item.price
    ) {
      console.log("please fill out all fields");
      setErrorMessage(
        <div className="alert alert-warning" role="alert">
          Please fill out all fields.
        </div>
      );
      return;
    }

    if (!item.image) {
      item.image =
        "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
    }

    if (isNaN(item.quantity)) {
      // setErrorMessage(
      //   <div className="alert alert-warning" role="alert">
      //     Please enter a number.
      //   </div>
      item.quantity == 0;
    }

    if (props.item.id) {
      // Update the item
      fetch("http://192.168.0.174:3004/items/" + props.item.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
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
    } else {
      // Create new item
      fetch("http://192.168.0.174:3004/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
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
  }
  // Handle change in input fields
  function handleChange(event) {
    const { name, value } = event.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value < 0 ? 0 : value,
    }));
  }

  // Handle image upload
  function handleImageUpload(url) {
    setItem((prevItem) => ({
      ...prevItem,
      image: url,
    }));
  }

  return (
    <div className="container my-5" id="itemForm">
      <h2 className="text-center mb-3">
        {props.item.id ? "Edit Item ✏️" : "Create New Item 🪄"}
      </h2>
      <div className="divBar-thin"></div>

      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage}
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Name *</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Barcode *</label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  name="barcode"
                  value={item.barcode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Quantity *</label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={item.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Brand (optional)</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={item.brand}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Price</label>
              <div className="col-sm-8">
                <div className="priceOptions">
                  
                  <input
                    type="number"
                    className="col-sm form-control"
                    placeholder="€"
                    name="price"
                    value={item.price}
                    onChange={handleChange}
                  />
                  <p> per </p>
                  <select
                    className="col-sm form-control"
                    name="price_type"
                    id=""
                    defaultValue={item.price_type}
                    onChange={handlePriceTypeChange}
                  >
                    <option value="single item">🪛 Single Item</option>
                    <option value="pack">📦 Pack</option>
                  </select>
                  {showItemsInPack && <p>of</p>}

                  {showItemsInPack && (
                    <input
                      type="number"
                      className="col-sm form-control"
                      name="items_in_pack"
                      value={item.items_in_pack}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <CategorySelect
                  category={item.category}
                  onChange={(event) =>
                    setItem((prevItem) => ({
                      ...prevItem,
                      category: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Image Url</label>
              <div className="col-sm-8">
                <input
                  type="url"
                  className="form-control"
                  name="image"
                  value={item.image}
                  onChange={handleChange}
                />
              </div>
                <UploadWidget onUpload={handleImageUpload} />
            </div>

            <button
              onClick={() => props.showList()}
              type="button"
              className="btn btn-secondary me-2"
            >
              ❌ Cancel
            </button>
            <button type="submit" className="btn btn-primary me-2">
              💾 Save
            </button>
            <div className="row"></div>
          </form>
        </div>
      </div>
    </div>
  );
}