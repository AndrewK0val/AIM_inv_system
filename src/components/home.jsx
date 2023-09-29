import React, { useState, useEffect } from "react";
import Card from "./card";
import ItemForm from "./item-form";
import CategoryForm from "./category-form";
import CardsList from "./cards-list";
import exportFromJSON from 'export-from-json'
import $, { event } from 'jquery';
import Dashboard from "./dashboard";
import SearchResults from "./search-results";

export function Home(props){
    const [category, setCategory] = useState([]);
    // const [searchQuery, setSearchQuery] = useState("");
    // const [searchTouched, setSearchTouched] = useState(false);

    const [content, setContent] = useState(
    
        <>
        {/* {
                  console.log("searchQuery in Home:", searchQuery)
        }
        {
                  console.log("searchTouched in Home:", searchTouched)
        } */}
{/* <Dashboard
  showForm={showForm}
  showSearchResults={showSearchResults}
  showCategoryForm={showCategoryForm}

/> */}
<CardsList
  showForm={showForm}
  showCategoryForm={showCategoryForm}

/>

        </>
      );
    const [categoryContent, setCategoryContent] = useState()

    function showList(){
        setContent(
          <>
        {/* <Dashboard showForm={showForm} showSearchResults={showSearchResults}  /> */}
        <CardsList showForm={showForm}   showCategoryForm={showCategoryForm}
  />
          </>
        );
      }

      function showSearchResults(){
        setContent(
        <> 
        
        <SearchResults showForm={showForm} showList={showList}/>
        </>
        
        )
      }

      function showForm(item){
        setContent(<ItemForm item={item} showList={showList} />);
      }


      function showCategoryForm(){
        setContent(<CategoryForm showList={showList}/>)
      }
      
      // function handleSearch(event) {
      //   console.log("handleSearch in Dashboard called");

      //   setSearchTouched(true);
      //   setSearchQuery(event.target.value);
      // }
      
    //   function fetchCategories() {
    //     return fetch("http://192.168.0.174:3006/categories/").then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Unexpected Server response");
    //       }
    //       return response.json();
    //     });
    //   }

    // useEffect(() => {fetchCategories().then((data) => setCategory(data));
    // }, []);
    
    return(
      <>
      <div >
          <div className="container my-5">
              {/* <Dashboard showForm={showForm} /> */}
            {content}
          </div>
      </div>
      </>
    )  
}
