import React, { useEffect, useState } from "react";
import "./style.scss";
import Modal from "../Modal-1";
import $ from "jquery";

const InitialState = {
   questions: [
      {
         question: "question number 0 ... ?",
         choices: [
            {
               choice: "choice 1",
               color: "red",
            },
            {
               choice: "choice 2",
               color: "green",
            },
            {
               choice: "choice 3",
               color: "blue",
            },
            {
               choice: "choice 4",
               color: "yellow",
            },
         ],
         answer: 1,
      },
      {
         question: "question number 1 ... ?",
         choices: [
            {
               choice: "choice 1",
               color: "red",
            },
            {
               choice: "choice 2",
               color: "green",
            },
            {
               choice: "choice 3",
               color: "blue",
            },
            {
               choice: "choice 4",
               color: "yellow",
            },
         ],
         answer: 1,
      },
   ],
   room: "",
};

function CreateQuizForm(props) {
   const [FormValue, setFormValue] = useState(InitialState);
   const [FormErrors, setFormErrors] = useState("");
   const [QuestionFormError, setQuestionFormError] = useState("");
   const [NbChoices, setNbChoices] = useState(2);

   useEffect(() => {
      resetQuestionForm();
   }, []);

   useEffect(() => {
      console.log(FormValue);
   }, [FormValue]);

   const resetQuestionForm = () => {
      setQuestionFormError("");
      $("#question").val("");
      setNbChoices(2);

      $("#choices-list").empty();
      $("#choices-list").append(`                  
         <div class="flex items-center">
            <input
               class="form-control w-full h-12 py-4 mb-8"
               type="text"
               name="choice"
               placeholder="choice"
            />
            <input
               class="ml-6"
               type="radio"
               name="answer"
               value="0"
            />
         </div>
         <div class="flex items-center">
            <input
               class="form-control w-full h-12 py-4 mb-8"
               type="text"
               name="choice"
               placeholder="choice"
            />
            <input
               class="ml-6"
               type="radio"
               name="answer"
               value="1"
            />
         </div>`);
   };

   const onRoomInputChange = (e) => {
      setFormValue({
         ...FormValue,
         room: e.target.value,
      });
   };

   const toggleModal = () => {
      document.getElementById("modal").classList.toggle("disableModal");
      resetQuestionForm();
   };

   const decreaseChoicesNumber = () => {
      if ($("#choices-list").children().length > 2) {
         $("#choices-list").children().last().remove();
         setNbChoices(NbChoices - 1);
      }
   };

   const increaseChoicesNumber = () => {
      if ($("#choices-list").children().length < 6) {
         setNbChoices(NbChoices + 1);

         $("#choices-list").append(`                  
            <div class="flex items-center">
            <input
               class="form-control w-full h-12 py-4 mb-8"
               type="text"
               name="choice"
               placeholder="choice"
            />
            <input
               class="ml-6"
               type="radio"
               name="answer"
               value="${NbChoices}"
            />
         </div>`);
      }
   };

   const addQestion = () => {
      const QuestionObject = {
         question: "",
         choices: [],
         answer: "",
      };

      // get the form values
      QuestionObject.question = $("#question").val();
      $("#choices-list input[type=text]").each(function (index) {
         var input = $(this);
         console.log(input.val());
         QuestionObject.choices.push({
            choice: input.val(),
         });
      });
      QuestionObject.answer = $(
         "#choices-list input[name=answer]:checked"
      ).val();

      // check if the question form is valide
      if (questionFormIsValide(QuestionObject)) {
         setFormValue({
            ...FormValue,
            questions: [...FormValue.questions, QuestionObject],
         });
         toggleModal();
         resetQuestionForm();
      } else {
         setQuestionFormError("please fill in all required fields !");
      }
   };

   const removeQuestion = (index) => {
      const newQuestions = FormValue.questions.filter((q, i) => i != index);
      setFormValue({
         ...FormValue,
         questions: newQuestions,
      });
      console.log(newQuestions);
   };

   const formIsValide = () => {
      return FormValue.room != "" && FormValue.questions.length > 0;
   };

   const questionFormIsValide = (QuestionObject) => {
      if (QuestionObject.question == "" || QuestionObject.answer === undefined)
         return false;

      for (let obj of QuestionObject.choices) {
         if (obj.choice == "") {
            return false;
         }
      }

      return true;
   };

   const addColorsToChoices = () => {
      const colors = ["blue", "red", "yellow", "green", "purple", "pink"];
      const newQuestions = [];
      for (let i of FormValue.questions) {
         const newChoices = [];
         let index = 0;
         for (let j of i.choices) {
            newChoices.push({
               choice: j.choice,
               color: colors[index++],
            });
         }
         newQuestions.push({
            question: i.question,
            answer: i.answer,
            choices: newChoices,
         });
      }
      return newQuestions;
   };
   async function getAllData() {
      return new Promise((resolve, reject) => {
         const newQuestions = addColorsToChoices();
         setFormValue((prevState) => {
            return {
               ...prevState,
               questions: [],
            };
         });
         //resolve();
      });
   }

   const onSubmit = () => {
      if (formIsValide()) {
         const newQuestions = addColorsToChoices();
         const data = {
            questions: newQuestions,
            room: FormValue.room,
         };
         props.onSubmit(data);
      } else {
         console.log("form not valide");
      }
   };

   return (
      <div className="create__quiz__form border bg-">
         <div className="max-w-5xl mx-auto p-8">
            <input
               className="form-control max-w-sm h-12 py-4 mb-8"
               type="text"
               name="room"
               placeholder="Room Name"
               onChange={onRoomInputChange}
            />
            <button className="button__2 mb-8" onClick={toggleModal}>
               Add question
            </button>
            {FormValue.questions.map((obj, index) => (
               <div className="flex justify-between py-4 border-b">
                  <h3>
                     <strong>{`Q${index + 1} - `}</strong>

                     {obj.question.length > 20
                        ? obj.question.substring(0, 20) + " . . ."
                        : obj.question}
                  </h3>
                  <button
                     onClick={() => removeQuestion(index)}
                     className="remove__question__button"
                  ></button>
               </div>
            ))}
            <div className="flex justify-center my-12">
               <button className="button__1" onClick={onSubmit}>
                  create
               </button>
            </div>
         </div>
         <Modal onClose={toggleModal}>
            <div className="mt-6">
               {QuestionFormError !== "" && (
                  <div className="max-w-lg mx-auto p-2 text-center mb-8 border-b border-red-400">
                     <p className="text-red-400">{QuestionFormError}</p>
                  </div>
               )}

               <input
                  className="form-control w-full h-12 py-4 mb-8"
                  type="text"
                  name="question"
                  placeholder="Question"
                  id="question"
               />
               <div className="mb-4 ml-6">
                  <button
                     onClick={decreaseChoicesNumber}
                     className="px-4 pb-1 text-4xl mx-4 border"
                  >
                     -
                  </button>
                  <span>{NbChoices}</span>
                  <button
                     onClick={increaseChoicesNumber}
                     className="px-4 pb-1 text-4xl mx-4 border"
                  >
                     +
                  </button>
               </div>
               <div id="choices-list" className="ml-12"></div>
               <div className="flex justify-center my-12">
                  <button className="button__1" onClick={addQestion}>
                     Add Question
                  </button>
               </div>
            </div>
         </Modal>
      </div>
   );
}

export default CreateQuizForm;
