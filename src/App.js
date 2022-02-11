import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateQuizPage from "./pages/CreateQuizPage";
import HomePage from "./pages/HomePage";
import JoinQuizPage from "./pages/JoinQuizPage";

function App() {
   return (
      <BrowserRouter>
         <div className="main__container rounded-sm bg-white">
            <Navbar />
            <div className="p-8">
               <Routes>
                  <Route exact path="/" element={<HomePage />} />
                  <Route path="/join" element={<JoinQuizPage />} />
                  <Route path="/create" element={<CreateQuizPage />} />
               </Routes>
            </div>
         </div>
      </BrowserRouter>
   );
}

export default App;
