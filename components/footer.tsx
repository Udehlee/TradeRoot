import Link from "next/link";
import { IoChatboxOutline } from "react-icons/io5";
import React from "react";

const Footer = () => {
    return(
        <footer className="bg-[#FAFAFA]">
            <div className="container">

                <div className="flex justify-between py-4">

                    <div className="col1 flex flex-col gap-4">
                        <h3 className="text-[20px] font-[600] text-gray-700">Contact Us</h3>
                        <p className="text-[16px] font-[400] pb-4 font-normal">
                            Brodazer - Mega Super Sport
                            <br />
                            507 Union Trade Center France
                        </p>

                        <Link  href={"mailto:unclelee@gmail.com"} className="text-gray-700 font-{600}
                        text-[15px] hover:text-primary">Unclelee@mail.com</Link>

                        <span className="text-[20px] font-bold text-primary">(+23484787494)</span>

                        <div className="flex items-center gap-3">
                               <div className="col1 w-[20px] flex-col gap-4 border-r[1px] border-(rgba(0,0,0,0.2)">
                            <IoChatboxOutline className="text-[40px] text-primary" />
                            <span className="text-[16px] font-[600]">
                                Online Chat
                                <br />
                                Get Help
                            </span>
                            </div>
                        </div>
                    </div>

                    <div className="col2 w-[40%] flex justify-between gap-5">
                        <div className="box">
                            {/* repeat for the rest */}
                        <h3 className="text-[200px] font-[600] text-gray-600">Products</h3>
                        <ul className="list mt-5">
                            <li className="list-none text-[14px] w-full mb-2">
                             <Link href="/" className="link text-[15px] font-[600] text-gray-600 hover:text-primary">
                               Prices drop
                             </Link>
                            </li>

                            <li className="list-none text-[14px] w-full mb-2">
                             <Link href="/" className="link text-[15px] font-[600] text-gray-600 hover:text-primary">
                               New Products
                             </Link>
                            </li>

                            <li className="list-none text-[14px] w-full mb-2">
                             <Link href="/" className="link text-[15px] font-[600] text-gray-600 hover:text-primary">
                               best sales
                             </Link>
                            </li>

                            <li className="list-none text-[14px] w-full mb-2">
                             <Link href="/" className="link text-[15px] font-[600] text-gray-600 hover:text-primary">
                               contact us
                             </Link>
                            </li>
                        </ul>
                    </div>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer;