import React, { useEffect, useState } from "react";
import { socket } from "service/socket";

const InitialState = {
   quizOver: false,
   quizStart: false,
   candidatesData: [],
   condidateJoind: false,
};

function JoinQuizPage() {
   const [error, setError] = useState("");
   const [nameInputValue, setNameInputValue] = useState("");
   const [roomInputValue, setRoomInputValue] = useState("");
   const [canISendAnswer, setCanISendAnswer] = useState(false);
   const [QuizInfos, setQuizInfos] = useState(InitialState);

   useEffect(() => {
      socket.on("connect", () => console.log(socket.id));

      socket.on("candidate-joind", (data) => {
         if (!data.error) {
            setQuizInfos((prevState) => {
               return {
                  ...prevState,
                  candidatesData: data.candidatesData,
                  condidateJoind: true,
               };
            });
         } else {
            setError(data.error);
         }
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
      socket.emit("joind-room", {
         candidate_name: nameInputValue,
         room_id: roomInputValue,
      });
   };

   const sendAnswer = (answer) => {
      if (canISendAnswer) {
         socket.emit("send-answer", {
            answer,
            room_id: roomInputValue,
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
               {error && (
                  <div className="max-w-lg mx-auto p-2 text-center mb-8 border-b border-red-400">
                     <p className="text-red-400">{error}</p>
                  </div>
               )}
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
}

export default JoinQuizPage;
