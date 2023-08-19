import React, {useEffect, useState} from "react";
import Barcode from 'react-barcode';
import Dashboard from "./dashboard";


export function Items(){
    const [content, setContent] = useState(<ItemList showForm={showForm} />);

    function showList(){
        setContent(<ItemList showForm={showForm}/>);
    }
    
    function showForm(item){
        setContent(<ItemForm item={item} showList={showList} />);
    }
    
    return(
        <div className="container my-5">
          {content}
        </div>
    )
}
    



function ItemList(props){
    const [item, setItem] = useState([]);

    function fetchItems(){
        fetch ('http://192.168.0.174:3004/items')
        .then(response => {
            if(!response.ok)
                throw new Error("Unexpected Server response")
            return response.json();
        })
        .then((data) => {
            // console.log(data)
            setItem(data);
        })
        .catch(error => console.log("Error: ",error));
    }
    useEffect(() => fetchItems(), []);
    function deleteItem(id){
        fetch("http://192.168.0.174:3004/items/" + id, {method: "DELETE"})
        .then((response) => response.json())
        .then((data) => fetchItems())
    }

    return(
        <div className="container my-5">

                {/* <Dashboard/> */}

            <h2 className="text-center mb-3"> List of Items</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2" > Create</button>
            <button onClick={() => fetchItems()} type="button" className="btn btn-primary me-2" > Refresh</button>
            <table className="table">
                <thead>

                    <tr>
                        <th>Item Name</th>
                        <th>Barcode</th>
                        <th>Item Quantity</th>
                        <th>Item Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        item.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td id="barcodeTd"><Barcode value={item.barcode} className="barcode" /></td>
                                    <td>{item.quantity}</td>
                                    <td>€{item.price}</td>
                                    <td >
                                        <button onClick={() => props.showForm(item)} type="button" className="btn btn-primary me-2" > Edit</button>
                                        <button onClick={() => deleteItem(item.id)} type="button" className="btn btn-danger me-2" > Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }               
                </tbody>
            </table>
        </div>
    )
}

function ItemForm(props){
    const [errorMessage, setErrorMessage] = useState("")

    function handleSubmit(event){
        event.preventDefault();

        //read form data
        const formData = new FormData(event.target);

        //convert form data to json object
        const item = Object.fromEntries(formData.entries());

        //form validation
        if(!item.name || !item.barcode || !item.quantity || !item.category || !item.image){

            console.log("please fill out all fields")
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please fill out all fields.
                </div>);
            return;
        }


        if(props.item.id){
            //update
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
                            <label className="col-sm-4 col-form-label">Name</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="name" defaultValue={props.item.name} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Barcode</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="barcode" defaultValue={props.item.barcode} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Quantity</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="quantity" defaultValue={props.item.quantity} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Category</label>
                            <div className="col-sm-8">
                                <select type="text"
                                    className="form-select"
                                    name="category"
                                    defaultValue={props.item.category}>
                                    <option value="Bolts"> Bolts</option>
                                    <option value="Nuts"> Nuts</option>
                                    <option value="Sheets"> Sheets</option>
                                    <option value="Screws"> Screws</option>
                                    <option value="Misc"> Misc</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Image Url</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="image" defaultValue={props.item.image} />
                            </div>
                        </div>
                        {props.item.id && <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">ID</label>
                            <div className="col-sm-8">
                                <input readOnly className="form-control-plaintext" name="id" defaultValue={props.item.id} />
                            </div>
                        </div>}

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