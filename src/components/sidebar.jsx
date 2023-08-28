import React, { useRef } from 'react';

function Sidebar({ categories }) {
  const sidebarRef = useRef(null);

  function handleClick(category) {
    // Find the corresponding section of the page using the category name
    const section = document.querySelector(`#${category}`);

    // Scroll to the section using the scrollIntoView() method
    section.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="sidebar" ref={sidebarRef}>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category} onClick={() => handleClick(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;