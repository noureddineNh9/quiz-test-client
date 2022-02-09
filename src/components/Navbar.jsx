import React, { useEffect, useState } from "react";
import $ from "jquery";

function Navbar() {
   const [currentEmoji, setCurrentEmoji] = useState(2);
   const [StarNumber, setStarNumber] = useState(1330);

   useEffect(() => {
      bubbles();
   }, []);

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
                  console.log($(this).css("transform"));
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
         setStarNumber(StarNumber + 1);
      }
   }

   return (
      <div className="flex justify-between bg-white p-8">
         <img src="/assets/logo-1.png" alt="logo" className="h-20 " />
         <div onClick={animate} className="emoji">
            <img id="emoji-img" src="/assets/icons/emoji-1.png" alt="" />
            <span className="start__number">{StarNumber}</span>
         </div>
      </div>
   );
}

export default Navbar;
