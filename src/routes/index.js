import CreateQuizPage from "pages/create-quiz";
import HomePage from "pages/home";
import JoinQuizPage from "pages/joid-quiz";
import React from "react";
import { Route, Routes } from "react-router-dom";

function Index() {
   return (
      <Routes>
         <Route exact path="/" element={<HomePage />} />
         <Route path="/join" element={<JoinQuizPage />} />
         <Route path="/create" element={<CreateQuizPage />} />
      </Routes>
   );
}

export default Index;
