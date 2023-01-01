import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import AppRoutes from "routes/index";
import Emoji from "components/emoji";

function App() {
   return (
      <BrowserRouter>
         <div className="main__container rounded-sm bg-white">
            <Navbar />
            <div className="p-8">
               <AppRoutes />
            </div>
            <Emoji />
         </div>
      </BrowserRouter>
   );
}

export default App;
