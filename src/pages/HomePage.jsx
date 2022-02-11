import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
   return (
      <div className="homepage">
         <h2 className="text-center">Welcome to Quiz Test</h2>
         <ul>
            <Link to="/join">Join Quiz</Link>

            <Link to="/Create" style={{ animationDelay: ".3s" }}>
               Create Quiz
            </Link>
         </ul>
      </div>
   );
}

export default HomePage;
