import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
    return (
        <div className="search bg-[#E6E6E6] w-[600px] h-[50px] rounded-md px-4 relative">Search
        <input type="text" className="w-full h-full outline-none border-0 placeholder=search"/>
        <button className="w- h-8 rounded-full bg-gray-200 absolute top-[5x] right-2 z-50 flex items-center
        justify-center cursor-pointe hoer:bg">
            <IoSearchOutline size={30} />
            </button>
        </div>
    
    )
}

export default Search

