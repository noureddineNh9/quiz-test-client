import React, { useEffect, useState } from "react";
import $ from "jquery";

import { API_BASE_URL } from "configs/AppConfig";

function Emoji() {
   const [currentEmoji, setCurrentEmoji] = useState(2);
   const [StarNumber, setStarNumber] = useState(0);

   useEffect(() => {
      bubbles();
      fetch(`${API_BASE_URL}/stars`).then((res) => {
         res.json().then((data) => {
            setStarNumber(data.stars);
         });
      });
   }, []);

   function increaseStars() {
      fetch(`${API_BASE_URL}/increaseStars`).then((res) => {
         setStarNumber(StarNumber + 1);
         fetch("http://localhost:5000/stars").then((res) => {
            res.json().then((data) => {
               setStarNumber(data.stars);
            });
         });
      });
   }

   function hearts() {
      $.each($(".emoji"), function () {
         var heartcount = ($(this).width() / 50) * 5;
         for (var i = 0; i <= heartcount; i++) {
            var size = Math.floor(Math.random() * 6) + 6;
            $(this).append(
               '<span class="particle" style="top:' +
                  (Math.floor(Math.random() * 60) + 20) +
                  "%; left:" +
                  Math.floor(Math.random() * 95) +
                  "%;width:" +
                  size +
                  "px; height:" +
                  size +
                  "px;animation-delay: " +
                  Math.random() +
                  's;"></span>'
            );
         }
      });
   }

   function bubbles() {
      $.each($(".emoji"), function () {
         var bubblecount = ($(this).width() / 50) * 10;
         for (var i = 0; i <= bubblecount; i++) {
            var size = Math.floor(Math.random() * 4) + 6;
            $(this).append(
               '<span class="cercle-particle" style="top:' +
                  (Math.floor(Math.random() * 60) + 20) +
                  "%; left:" +
                  Math.floor(Math.random() * 95) +
                  "%;width:" +
                  size +
                  "px; height:" +
                  size +
                  "px;animation-delay: " +
                  Math.floor(Math.random() * 3) +
                  's;"></span>'
            );
         }
      });
   }

   function removeParticle() {
      var timeout = setTimeout(() => {
         if ($(".particle").length > 0) {
            $(".particle")[0].remove();
            removeParticle();
         } else {
            clearInterval(timeout);
         }
      }, 300);
   }

   function animate() {
      if (currentEmoji <= 10) {
         $(".emoji").animate(
            { borderSpacing: 0.1 },
            {
               start: function () {
                  $(this).css("transform", "scale(1.15)");
               },
               duration: 200,
               easing: "linear",
               done: function () {
                  $(".emoji").css("transform", "scale(1)");
                  $("#emoji-img").attr(
                     "src",
                     "/assets/icons/emoji-" + currentEmoji + ".png"
                  );
                  setCurrentEmoji(currentEmoji + 1);
               },
            }
         );
         hearts();
         setTimeout(() => {
            removeParticle();
         }, 1000);
         //setStarNumber(StarNumber + 1);
         increaseStars();
      }
   }

   return (
      <div onClick={animate} className="emoji">
         <img id="emoji-img" src="/assets/icons/emoji-1.png" alt="" />
         <span className="start__number">{StarNumber}</span>
      </div>
   );
}

export default Emoji;
