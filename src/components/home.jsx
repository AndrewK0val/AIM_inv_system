import React, { useState, useEffect } from "react";
import Card from "./card";
import ItemForm from "./item-form";
import CategoryForm from "./category-form";
import CardsList from "./cards-list";
import exportFromJSON from 'export-from-json'
import $ from 'jquery';
import Dashboard from "./dashboard";







// export function Home(){
//     return(
//         <div className="container my-5">
//             <h2 className="text-center mb-3">Home Page</h2>

            
//         </div>
//     )
// }

export function Home(props){
    
    const [content, setContent] = useState(
        <>
          <Dashboard showForm={showForm} showCategoryForm={showCategoryForm}/>
          <CardsList showForm={showForm}/>
        </>
      );
    const [categoryContent, setCategoryContent] = useState()

    

    function showList(){
        setContent(
          <>
            <Dashboard showForm={showForm} showCategoryForm={showCategoryForm}/>
            <CardsList showForm={showForm}/>
          </>
        );
      }

    function showForm(item){
        setContent(<ItemForm item={item} showList={showList} />);
    }

    function showCategoryForm(){
        setContent(<CategoryForm showList={showList}/>)
    }
    
    return(
        <div className="container my-5">
            {/* <Dashboard showForm={showForm} /> */}
          {content}
        </div>
    )  
}




// function CardsList(props) {
//     const [item, setItem] = useState([]);
//     const [stats, setStats] = useState(null);

  
//     function fetchItems() {
//       return fetch("http://192.168.0.174:3004/items/").then((response) => {
//         if (!response.ok) {
//           throw new Error("Unexpected Server response");
//         }
//         return response.json();
//       });
//     }
  
//     function countItems(items) {
//       return items.length;
//     }
  
//     function countItemsInStock(items) {
//         var count = 0;
//         for(const item of items){
//             var quantity = parseInt(item.quantity);
//             if(item.quantity > 0){
//                 count += quantity;
//             }
//         }
//         return count;
//     }
  
//     function displayStats() {
//       fetchItems()
//         .then((items) => {
//           const itemsInStock = countItems(items);
//           const totalItems = countItemsInStock(items);
//           setStats({ totalItems, itemsInStock });
//         })
//         .catch((error) => console.log("Error: ", error));
//     }
  
//     useEffect(() => {
//       fetchItems().then((data) => setItem(data));
//       displayStats();
//     }, []);
  
//     function deleteItem(id) {
//       fetch("http://192.168.0.174:3004/items/" + id, { method: "DELETE" })
//         .then((response) => response.json())
//         .then((data) => fetchItems().then((data) => setItem(data)))
//         .catch((error) => console.log("Error: ", error));
//     }

//     function handleClick(item) {
//         console.log("clicked");
//         props.showForm(item);
//       }






  
//     return (
//       <div>
//         <div id="buttonContainer">

//             <h2>Inventory</h2>
//             <div className="divBar"></div>
//                 <h4 className="text-center mb-3" id="stats-1">
//                     {stats ? `${stats.itemsInStock} types of items ` : "Loading..."}{" "}
//                 </h4>
//                 <h5 className="text-center mb-3" id="stats-1">
//                     {stats ? `${stats.totalItems} total items in stock` : "Loading..."}{" "}
//                 </h5>
//             <div className="rowOfOptions">
//                 <button
//                     onClick={() => props.showForm({})}
//                     type="button"
//                     className="btn btn-primary me-2"
//                 >
//                     {" "}
//                     Add Items
//                 </button>
//                 <button
//                     onClick={() => fetchItems().then((data) => setItem(data))}
//                     type="button"
//                     className="btn btn-primary me-2"
//                 >
//                     {" "}
//                     Refresh
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => {
//                     exportFromJSON({
//                         data: item,
//                         fileName: "download",
//                         exportType: exportFromJSON.types.csv,
//                     });
//                     }}
//                     className="btn btn-primary me-2"
//                 >
//                     {" "}
//                     Export CSV{" "}
//                 </button>
//                 <button type="button" className="btn btn-primary me-2">
//                     {" "}
//                     Import CSV{" "}
//                 </button>

//                 <button type="button" className="btn btn-primary me-2">Add category</button>

//                 <div className="sortByMenu">
//                     <p>Sort by:</p>
//                     <select type="button" name="sort by:"  id="sortSelector">
//                         <option value="category">category</option>
//                         <option value="brand">brand</option>
//                         <option value="price-hl">price (highest to lowest)</option>
//                         <option value="price-lh">price (lowest to highest)</option>
//                     </select>
//                     </div>
//             </div>
//         </div>

//         <div className="container my-3" id="cardContainer">
  
//           {item.map((item, id) => (
//             <Card item={item} key={id} deleteItem={deleteItem} editCSV={handleClick} />
//           ))}
//         </div>
//       </div>
//     );
//   }



