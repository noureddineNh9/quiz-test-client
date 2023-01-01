import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
   return (
      <div className="flex justify-between bg-white p-8">
         <Link to="/" className="cursor-pointer">
            <img src="/assets/logo-1.png" alt="logo" className="h-20 " />
         </Link>
      </div>
   );
}

export default Navbar;
