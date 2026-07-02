import Link from "next/link";
import React from "react";
import Search from "./Search";
import Nav from "./Nav";

const Header = () => {
    return(
        <>
        <div className="headerWrapper"> 
        <header  className="py-3 border-b-[1px]">
            <div className="container flex items-center justify-between">
                <div className="logo">
                    <Link href={"/"}>
                    <h2 className="w-[230px] h-[61px] border-[rgba(0,0,0,0.1)]">TradeRoot</h2>
                    </Link>
                </div>

            <Search/>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                    <Link href={"/login"} className="hover-text-primary">Signup</Link>
                    <span className="">|</span>
                    <Link href={"/register"} className="hover-text-secondary">Signin</Link>  
                </div>

                
            </div>
            </div>
        </header>
        <Nav />
        </div>
        </>
    )
}

export default Header;