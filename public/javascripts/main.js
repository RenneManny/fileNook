let animation  = new rsAnimate();

animation.textAnimate({
    path: document.querySelector(".main-heading"),
    inAni: "fade",
    aniSpeed: 4.9

})

// faq
let questions = document.querySelectorAll(".faq_question");

      questions.forEach((question) => {
        let icon = question.querySelector(".icon-shape");

        question.addEventListener("click", (event) => {
          const active = document.querySelector(".faq_question.active");
          const activeIcon = document.querySelector(".icon-shape.active");

          if (active && active !== question) {
            active.classList.toggle("active");
            activeIcon.classList.toggle("active");
            active.nextElementSibling.style.maxHeight = 0;
          }

          question.classList.toggle("active");
          icon.classList.toggle("active");

          const answer = question.nextElementSibling;

          if (question.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          } else {
            answer.style.maxHeight = 0;
          }
        });
      });
// raman
// function viewPort(className){
//     const rect = className.getBoundingClientRect();
//     return(
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
//         rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
//     )

// }


// document.addEventListener("scroll",()=>{
    
//     if(viewPort(document.querySelector(".flex"))){
//         console.log("hi")
//         document.querySelector(".flex1").classList.add("view")
//     }
// })