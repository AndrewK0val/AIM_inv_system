import React, {useEffect, useState} from "react";
import Barcode from 'react-barcode';
import { Items } from "./items";
import {Home} from "./home";
import { event } from "jquery";

var IpAddress = "localhost";
// var IpAddress = "192.168.0.174";

export default function Card(props) {
  const { item } = props;
  const [count, setCount] = React.useState(parseInt(item.quantity))
  // const [item, setItem] = useState([props]);



  function updateItem(item){
    if(item.id){
      //update the item
      fetch("http://192.168.0.174:3004/items/" + item.id, {
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
  }

  function increaseQuantity(item){
    const updatedItem = {...item, quantity: count + 1}
    setCount(prevCount => prevCount + 1)
    updateItem(updatedItem)
  }

  function decreaseQuantity(item){
    const updatedItem = {...item, quantity: count - 1}
    setCount(prevCount  => prevCount - 1)
    updateItem(updatedItem)
  }

  


  return (
  
    <div className="card" >
      <div className="card-body">
        <h4 className="card-title">{item.name}</h4>
        <p>{item.brand}</p>
      <img src={item.image } onClick={() => props.editCSV(item)}  />
        <div className="row align-items-start" id="plusAndMinusButtonContainer">
          <div className="col">
            <button className="btn btn-dark" id="invButton"onClick={() => decreaseQuantity(item)} >-</button>
          </div>
          <div className="col" id="quantityDiv">
            <h4 className="card-title">{count}</h4>
          </div>
          <div className="col">
            <button className="btn btn-dark" id="invButton" onClick={() => increaseQuantity(item)}>+</button>
          </div>
          <div className="inStockLabel" onClick={() => props.editCSV(item)}> in stock</div>
            <Barcode height={50 + 'px'} value={item.barcode}   className="barcode" />
        </div>

        <h6 className="price">  €{item.price} per {item.price_type === 'pack' ? `pack of ${item.items_in_pack}` : 'single item'}</h6>
        {/* <a href="" className="btn btn-primary"> vendor website</a> */}
      </div>
      <button onClick={() => props.deleteItem(item.id)} type="button" className="btn btn-danger me-2" id="invButton" > Delete</button>

    </div>
  );
}