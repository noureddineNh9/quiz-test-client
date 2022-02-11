import React, { useEffect, useState } from "react";
import { socket } from "../service/socket";

const InitialState = {
   quizOver: false,
   quizStart: false,
   candidatesData: [],
   condidateJoind: false,
};

function JoinQuizPage() {
   const [nameInputValue, setNameInputValue] = useState("");
   const [roomInputValue, setRoomInputValue] = useState("");
   const [canISendAnswer, setCanISendAnswer] = useState(false);
   const [QuizInfos, setQuizInfos] = useState(InitialState);

   useEffect(() => {
      socket.on("connect", () => console.log(socket.id));

      socket.on("candidate-joind", (data) => {
         setQuizInfos((prevState) => {
            return {
               ...prevState,
               candidatesData: data.candidatesData,
               condidateJoind: true,
            };
         });
      });

      socket.on("update-question", (data) => {
         setQuizInfos((prevState) => {
            return {
               ...prevState,
               question: data.question,
               choices: data.choices,
               quizStart: true,
            };
         });
         setCanISendAnswer(true);
      });

      socket.on("update-score", (data) => {
         setQuizInfos((prevState) => {
            return {
               ...prevState,
               candidatesData: data.candidatesData,
            };
         });
      });

      socket.on("quiz-over", (data) => {
         setQuizInfos((prevState) => {
            return {
               ...prevState,
               quizOver: true,
            };
         });
      });
   }, []);

   const joindRoom = () => {
      console.log("aze");
      socket.emit("joind-room", {
         candidateName: nameInputValue,
         clientRoom: roomInputValue,
      });
   };

   function candidateExist(candidate) {
      for (let obj of QuizInfos.candidatesData) {
         if (candidate.id === obj.id) {
            return true;
         }
      }
      return false;
   }

   function add() {
      /*
      var r = candidateExist({
         id: "4cfX177-11BGDbVtAAAK",
         candidateName: "neeeeeew",
         score: 10,
         room: "aze",
      });
      if (r) {
         const newCandidates = QuizInfos.candidatesData.map((c) => {
            if (c.id === "4cfX177-11BGDbVtAAAK") c.score++;
            return c;
         });
         setQuizInfos({
            ...QuizInfos,
            candidatesData: newCandidates,
         });
      } else {
         setQuizInfos({
            ...QuizInfos,
            candidatesData: [
               ...QuizInfos.candidatesData,
               {
                  id: "4cfX177-11BGDbVtAAAK",
                  candidateName: "neeeeeew",
                  score: 10,
                  room: "aze",
               },
            ],
         });
      }
      */
   }

   const sendAnswer = (answer) => {
      if (canISendAnswer) {
         console.log("answer : ", answer);
         socket.emit("send-answer", {
            answer,
            room: roomInputValue,
         });

         setCanISendAnswer(false);
      } else {
         console.log("you already send answer for this question ");
      }
   };

   const onRoomInputChange = (e) => {
      setRoomInputValue(e.target.value);
   };
   const onNameInputChange = (e) => {
      setNameInputValue(e.target.value);
   };

   return (
      <div className="join__quiz__part">
         {!QuizInfos.condidateJoind ? (
            <div className="max-w-xl mx-auto">
               <input
                  onChange={onRoomInputChange}
                  placeholder="room"
                  type="text"
                  name="room"
                  className="form-control w-full h-12 py-4 mb-8"
               />
               <input
                  onChange={onNameInputChange}
                  placeholder="Your name"
                  type="text"
                  name="room"
                  className="form-control w-full h-12 py-4 mb-8"
               />
               <div className="flex justify-center my-12">
                  <button className="button__1" onClick={joindRoom}>
                     join
                  </button>
               </div>
            </div>
         ) : !QuizInfos.quizStart && !QuizInfos.quizOver ? (
            <div className="mt-12 text-center">
               <h2>Wait . . .</h2>
               <h3>Quiz will start in any moment</h3>
               <div className="circle"></div>
            </div>
         ) : QuizInfos.quizStart && !QuizInfos.quizOver ? (
            <div className="md:grid md:grid-cols-3 mx-auto border">
               <div className="p-8 col-span-2">
                  <h2 className="question text-center mb-8">
                     {QuizInfos.question}
                  </h2>
                  <ul className="choice__list max-w-2xl mx-auto">
                     {QuizInfos.choices.map((obj, index) => (
                        <li className="choice__item " key={index}>
                           <button
                              className={`choice__item choice__${obj.color}`}
                              disabled={!canISendAnswer}
                              onClick={() => sendAnswer(index)}
                           >
                              {obj.choice}
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="p-8 col-span-1">
                  <h3 className="text-center mb-8">Top Candidates</h3>
                  <ul className="candidates__list border max-w-3xl mx-auto">
                     {QuizInfos.candidatesData
                        .sort((a, b) => b.score - a.score)
                        .map((con, index) => (
                           <li
                              key={index}
                              className="candidates__item flex justify-between  w-full"
                           >
                              <div className="flex ">
                                 <img src="/assets/icons/avatar2.svg" />
                                 <h5 className="">{con.candidateName}</h5>
                              </div>
                              <span className="score ">{con.score}</span>
                           </li>
                        ))
                        .splice(0, 3)}
                     {QuizInfos.candidatesData.length > 3 && (
                        <li className="candidates__item ">
                           <h5 className="text-center">. . .</h5>
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         ) : QuizInfos.quizStart && QuizInfos.quizOver ? (
            <div className="text-center">
               <h2 className="text-7xl mb-8">Quiz Over</h2>
               <ul className="candidates__list  max-w-3xl mx-auto">
                  <h3 className="text-center mb-8">
                     Your Score :
                     {
                        QuizInfos.candidatesData.filter(
                           (c) => c.id == socket.id
                        )[0].score
                     }
                  </h3>
                  {QuizInfos.candidatesData.sort((a, b) => b.score - a.score)[0]
                     .id === socket.id ? (
                     <h2 className="text-center">You Win 🥳</h2>
                  ) : (
                     <h2 className="text-center">You Lose 😞</h2>
                  )}
               </ul>
            </div>
         ) : (
            <div>
               <h2>somthing wrong</h2>
            </div>
         )}
      </div>
   );

   if (!QuizInfos.condidateJoind) {
      return (
         <div className="max-w-xl mx-auto">
            <input
               onChange={onRoomInputChange}
               placeholder="room"
               type="text"
               name="room"
               className="form-control w-full h-12 py-4 mb-8"
            />
            <input
               onChange={onNameInputChange}
               placeholder="Your name"
               type="text"
               name="room"
               className="form-control w-full h-12 py-4 mb-8"
            />
            <div className="flex justify-center my-12">
               <button className="joind__button" onClick={joindRoom}>
                  joind
               </button>
            </div>
         </div>
      );
   } else if (!QuizInfos.quizStart && !QuizInfos.quizOver) {
      return (
         <div className="mt-12 text-center">
            <h2>Wait . . .</h2>
            <h3>Quiz will start in any moment</h3>
         </div>
      );
   } else if (QuizInfos.quizStart && !QuizInfos.quizOver) {
      return (
         <div className="join__quiz__part md:grid md:grid-cols-3 mx-auto border">
            <div className="join__quiz__part  col-span-2 p-8">
               <h2 className="question text-center mb-8">
                  {QuizInfos.question}
               </h2>
               <ul className="choice__list max-w-2xl mx-auto">
                  {QuizInfos.choices.map((obj, index) => (
                     <li className="choice__item " key={index}>
                        <button
                           className={`choice__item choice__${obj.color}`}
                           disabled={!canISendAnswer}
                           onClick={() => sendAnswer(index)}
                        >
                           {obj.choice}
                        </button>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="p-8 col-span-1">
               <h3 className="text-center mb-8">Top Candidates</h3>
               <ul className="candidates__list border max-w-3xl mx-auto">
                  {QuizInfos.candidatesData
                     .sort((a, b) => b.score - a.score)
                     .map((con, index) => (
                        <li
                           key={index}
                           className="candidates__item flex justify-between  w-full"
                        >
                           <div className="flex ">
                              <img src="/assets/icons/avatar2.svg" />
                              <h5 className="">{con.candidateName}</h5>
                           </div>
                           <span className="score ">{con.score}</span>
                        </li>
                     ))
                     .splice(0, 3)}
                  {QuizInfos.candidatesData.length > 3 && (
                     <li className="candidates__item ">
                        <h5 className="text-center">. . .</h5>
                     </li>
                  )}
               </ul>
            </div>
         </div>
      );
   } else if (QuizInfos.quizStart && QuizInfos.quizOver) {
      return (
         <div>
            <h2>Quiz Over</h2>
         </div>
      );
   } else {
      return (
         <div>
            <h2>somthing wrong</h2>
         </div>
      );
   }
}

export default JoinQuizPage;
