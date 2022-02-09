import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateQuiz from "./pages/CreateQuiz";
import HomePage from "./pages/HomePage";
import JoinQuiz from "./pages/JoinQuiz";

function App() {
   return (
      <BrowserRouter>
         <div className="main__container rounded-sm bg-white">
            <Navbar />
            <div className="p-8">
               <Routes>
                  <Route exact path="/" element={<HomePage />} />
                  <Route path="/join" element={<JoinQuiz />} />
                  <Route path="/create" element={<CreateQuiz />} />
               </Routes>
            </div>
         </div>
      </BrowserRouter>
   );
}

export default App;
