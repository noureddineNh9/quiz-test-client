import React, { useEffect, useState } from "react";
import { socket } from "../service/socket";

const InitialState = {
   quizOver: false,
   quizStart: false,
   candidatesData: [],
   roomCreated: false,
};

function CreateQuiz() {
   const [roomInputValue, setRoomInputValue] = useState("");
   const [QuizInfos, setQuizInfos] = useState(InitialState);

   useEffect(() => {
      socket.on("connect", () => console.log(socket.id));

      socket.on("room-status", (data) => {
         if (data.roomIsCreated) {
            setQuizInfos((prevState) => {
               return {
                  ...prevState,
                  roomCreated: true,
               };
            });
         }
      });

      socket.on("candidate-joind", (data) => {
         setQuizInfos((prevState) => {
            return {
               ...prevState,
               candidatesData: data.candidatesData,
               roomCreated: true,
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

   const createRoom = () => {
      console.log(roomInputValue);
      socket.emit("create-room", {
         roomName: roomInputValue,
      });
   };

   const startQuiz = () => {
      socket.emit("start-quiz", {
         roomName: roomInputValue,
      });
   };

   const onRoomInputChange = (e) => {
      setRoomInputValue(e.target.value);
   };

   return (
      <div className="create__quiz__part ">
         {!QuizInfos.roomCreated ? (
            <div className="max-w-xl mx-auto">
               <input
                  className="form-control w-full h-12 py-4 mb-8"
                  onChange={onRoomInputChange}
                  type="text"
                  name="room"
                  placeholder="Room Name"
               />
               <div className="flex justify-center my-12">
                  <button className="button__1" onClick={createRoom}>
                     create
                  </button>
               </div>
            </div>
         ) : !QuizInfos.quizStart && !QuizInfos.quizOver ? (
            <div className="md:grid md:grid-cols-3 mx-auto border">
               <div className="p-8 border-r border-gray-100 col-span-2">
                  <div className="flex justify-center">
                     <button className="button__1" onClick={startQuiz}>
                        Start Quiz
                     </button>
                  </div>
               </div>
               <div className="p-8 col-span-1">
                  <div>
                     <h3 className="text-center mb-8">Candidates</h3>
                     <ul className="candidates__list border max-w-3xl mx-auto">
                        {QuizInfos.candidatesData
                           .sort((a, b) => b.score - a.score)
                           .map((con, index) => (
                              <li
                                 key={index}
                                 className="candidates__item flex justify-between  w-full"
                              >
                                 <div className="flex ">
                                    <img src="/assets/icons/candidate.svg" />
                                    <h5 className="">{con.candidateName}</h5>
                                 </div>
                                 <span className="score ">{con.score}</span>
                              </li>
                           ))}
                     </ul>
                  </div>
               </div>
            </div>
         ) : QuizInfos.quizStart && !QuizInfos.quizOver ? (
            <div className="md:grid md:grid-cols-3 mx-auto border">
               <div className="p-8 border-r border-gray-100 col-span-2">
                  <h2 className="question text-center mb-8">
                     {QuizInfos.question}
                  </h2>
                  <ul className="choice__list max-w-5xl mx-auto ">
                     {QuizInfos.choices.map((obj, index) => (
                        <li
                           key={index}
                           className={`choice__item choice__${obj.color} `}
                           style={{ animationDelay: `${index * 0.3}s` }}
                        >
                           {obj.choice}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="p-8 col-span-1">
                  <div>
                     <h3 className="text-center mb-8">Candidates</h3>
                     <ul className="candidates__list border max-w-3xl mx-auto">
                        {QuizInfos.candidatesData
                           .sort((a, b) => b.score - a.score)
                           .map((con, index) => (
                              <li
                                 key={index}
                                 className="candidates__item flex justify-between  w-full"
                              >
                                 <div className="flex ">
                                    <img src="/assets/icons/candidate.svg" />
                                    <h5 className="">{con.candidateName}</h5>
                                 </div>
                                 <span className="score ">{con.score}</span>
                              </li>
                           ))}
                     </ul>
                  </div>
               </div>
            </div>
         ) : QuizInfos.quizStart && QuizInfos.quizOver ? (
            <div className="text-center">
               <h2 className="text-7xl">Quiz Over</h2>
            </div>
         ) : (
            <div>
               <h2>somthing wrong</h2>
            </div>
         )}
      </div>
   );

   if (!QuizInfos.roomCreated) {
      return (
         <div>
            <div className="max-w-xl mx-auto">
               <input
                  className="form-control w-full h-12 py-4 mb-8"
                  onChange={onRoomInputChange}
                  type="text"
                  name="room"
                  placeholder="Room Name"
               />
               <div className="flex justify-center my-12">
                  <button className="create__button" onClick={createRoom}>
                     create
                  </button>
               </div>
            </div>
         </div>
      );
   } else if (!QuizInfos.quizStart && !QuizInfos.quizOver) {
      return (
         <div>
            <button onClick={startQuiz}>Start Quiz</button>
         </div>
      );
   } else if (QuizInfos.quizStart && !QuizInfos.quizOver) {
      return (
         <div className="create__quiz__part md:grid md:grid-cols-3 mx-auto border">
            <div className="p-8 border-r border-gray-100 col-span-2">
               <h2 className="question text-center mb-8">
                  {QuizInfos.question}
               </h2>
               <ul className="choice__list max-w-5xl mx-auto ">
                  {QuizInfos.choices.map((obj, index) => (
                     <li
                        key={index}
                        className={`choice__item choice__${obj.color} `}
                        style={{ animationDelay: `${index * 0.3}s` }}
                     >
                        {obj.choice}
                     </li>
                  ))}
               </ul>
            </div>
            <div className="p-8 col-span-1">
               <div>
                  <h3 className="text-center mb-8">Candidates</h3>
                  <ul className="candidates__list border max-w-3xl mx-auto">
                     {QuizInfos.candidatesData.map((con, index) => (
                        <li
                           key={index}
                           className="candidates__item flex justify-between  w-full"
                        >
                           <div className="flex ">
                              <img src="/assets/icons/candidate.svg" />
                              <h5 className="">{con.candidateName}</h5>
                           </div>
                           <span className="score ">{con.score}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      );
   } else if (QuizInfos.quizStart && QuizInfos.quizOver) {
      return (
         <div className="text-center">
            <h2 className="text-7xl">Quiz Over</h2>
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

export default CreateQuiz;
