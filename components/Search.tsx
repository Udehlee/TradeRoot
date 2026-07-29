// import React from "react";
// import { IoSearchOutline } from "react-icons/io5";

// const Search = () => {
//     return (
//         <div className="search bg-[#E6E6E6] w-[400px] h-[40px] rounded-l px-4 relative">Search
//         <input type="text" className="w-full h-full outline-none border-0 placeholder=search"/>
//         <button className="w-10 h-10 rounded-full bg-gray-200 absolute top-[5x] right-2 z-50 flex items-center
//         justify-center cursor-pointer hover:bg-gray-300">
//             <IoSearchOutline size={30} />
//             </button>
//         </div>
    
//     )
// }

// export default Search
"use client";
import { useState } from "react";
 import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center w-[500px] h-[40px] bg-[#E6E6E6] rounded-full pl-4">

  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search"
    className="flex-1 h-full bg-transparent outline-none text-sm text-gray-700"
  />

  <button
    className="w-10 h-10 rounded-full bg-primary hover:bg-gray-700 flex items-center justify-center"
    aria-label="Search"
  >
    <IoSearchOutline className="text-white text-xl" />
  </button>

</div>
  );
};

export default Search;
