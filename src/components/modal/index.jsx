import React from "react";
import "./style.scss";

function index(props) {
   return (
      <>
         <div id="modal" className="modal disableModal">
            <div className="modal__wrap">
               <button className="close" onClick={props.onClose}></button>
               <div>{props.children}</div>
            </div>
         </div>
      </>
   );
}

export default index;
