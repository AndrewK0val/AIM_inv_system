import React, { useState, useEffect } from "react";
import CategorySelect from "./categorySelect";
const fs = require('fs');




export default function ItemForm(props){
    const [errorMessage, setErrorMessage] = useState("")

    const [showItemsInPack, setShowItemsInPack] = useState(props.item.price_type === 'pack');

    function handlePriceTypeChange(event) {
    const value = event.target.value;
    setShowItemsInPack(value === 'pack');
    }

    const [category, setCategory] = useState([]);



    function fetchCategories() {
        return fetch("http://192.168.0.174:3006/categories/").then((response) => {
          if (!response.ok) {
            throw new Error("Unexpected Server response");
          }
          return response.json();
        });
      }

      useEffect(() => {
        // loadItemsData()
        fetchCategories().then((data) => setCategory(data));
      }, []);

    function handleSubmit(event){
        event.preventDefault();

        //read form data
        const formData = new FormData(event.target);

        //convert form data to json object
        const item = Object.fromEntries(formData.entries());

                
        // function saveGroupedItemsToFile(filename) {
        //     // Read the JSON data from the file
        //     fetch(filename)
        //       .then(response => response.json())
        //       .then(data => {
        //         // Parse the JSON data into an array of items
        //         const items = data;
          
        //         // Group the items by category
        //         const groupedItems = groupItemsByCategory(items);
          
        //         // Save the grouped items to a new file
        //         const outputFilename = 'groupedItems.json';
        //         const outputData = JSON.stringify(groupedItems, null, 2);
        //         fs.writeFile(outputFilename, outputData, (err) => {
        //           if (err) {
        //             console.error(err);
        //             return;
        //           }
        //           console.log(`Grouped items saved to ${outputFilename}`);
        //         });
        //       })
        //       .catch(error => {
        //         console.error(`Error loading items from ${filename}: ${error}`);
        //       });
        //   }
          
        //   saveGroupedItemsToFile('../db-backup.json');

        //form validation
        if(!item.name || !item.barcode || !item.quantity || !item.category || !item.price_type || !item.price){

            console.log("please fill out all fields")
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please fill out all fields.
                </div>);
            return;
        }

        if(!item.image){
            item.image = "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg"
        }

        if(isNaN(item.quantity)){
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please enter a number .
                </div>);
            return;           
        }

        // js syntax is so confusing,I hate how its just props.item.id and nothing after it in the if statement - I know it means if the item id == true 
        // but it drives me mad that the statement will stop working if you do: if(props.item.id == true) which would make so much more sense
        if(props.item.id){
            //update the item
            fetch("http://192.168.0.174:3004/items/" + props.item.id, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            })
            .then((response) => {
                if(!response.ok){
                    throw new Error("Unexpected Server Response");
                } return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.log("Error: ", error);
            })

        }
        else{
        //create new item
            fetch("http://192.168.0.174:3004/items", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            })
            .then((response) => {
                if(!response.ok){
                    throw new Error("Unexpected Server Response");
                } return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.log("Error: ", error);
            })
    }
}

    return(
        <div className="container my-5">
            <h2 className="text-center mb-3"> {props.item.id ? "Edit Item" : "Create New Item"}</h2>

            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {errorMessage}
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Name *</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="name" defaultValue={props.item.name} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Barcode *</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" name="barcode" defaultValue={props.item.barcode} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Quantity *</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" name="quantity" defaultValue={props.item.quantity} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Brand (optional)</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="brand" defaultValue={props.item.brand} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Price</label>
                            <div className="col-sm-8">
                                <div className="priceOptions">
                                    €
                                    <input type="number" className="col-sm-4" name="price" defaultValue={props.item.price} />
                                    <p>per</p>
                                    <select className="col" name="price_type" id="" defaultValue={props.item.price_type} onChange={handlePriceTypeChange}>
                                    <option value="single item">Single Item</option>
                                    <option value="pack">Pack</option>
                                    </select>
                                    {showItemsInPack && <p>of</p>}

                                    {showItemsInPack &&  <input type="number" className="col-sm-4" name="items_in_pack" defaultValue={props.item.items_in_pack} />}
                                </div>
                            </div>


                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Category</label>
                            <div className="col-sm-8">
                                <select type="text"
                                    className="form-select"
                                    name="category"
                                    value={props.item.category}>
                                    {
                                        category.map((category, index) => {
                                            return(
                                                <option key={index} value={category}>{category}</option>
                                            )
                                        })
                                    }
                                    {/* <option value="Bolts"> Bolts</option>
                                    <option value="Nuts"> Nuts</option>
                                    <option value="Sheet-Metal"> Sheet Metal</option>
                                    <option value="Screws"> Screws</option>
                                    <option value="Misc"> Misc</option>
                                    <option value="Fittings"> Fittings</option>
                                    <option value="Welding-Equiptment"> Welding Equiptment</option> */}


                                </select>
                            </div>
                        </div>
                            
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Image Url</label>
                            <div className="col-sm-8">
                                <input type="url" className="form-control" name="image" defaultValue={props.item.image} />
                            </div>
                        </div>
                        {/* {props.item.id && <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">ID</label>
                            <div className="col-sm-8">
                                <input readOnly className="form-control-plaintext" name="id" defaultValue={props.item.id} />
                            </div>
                        </div>} */}

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
            </div>
        </div>
    )


}