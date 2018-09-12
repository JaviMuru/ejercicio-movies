const idContent = document.querySelector("article").getAttribute("data-id");

function changeLibrary() {  
  fetch(`/update-library/${idContent}`, { method: "PATCH"})
  .then((result) => {      
      var change = document.getElementById("botonOn");
      if (change.innerHTML == "Add to Library") {
        change.innerHTML = "Quit from Library";
      }else {
        change.innerHTML = "Add to Library";
      }
  })    
  .catch(err => console.log('error',err));
}

function changeFav() {
  fetch(`/update-fav/${idContent}`, {
    method: "PATCH"
  })
    .then(resp => fav.classList.toggle("has-text-danger"))
    .catch(e => console.log("ERROR", e));
}

const fav = document.querySelector(".fav");
fav.addEventListener("click", changeFav);

function filterSelection(c) {
  console.log(c);
  
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all" || c === undefined) {
    c = "";
  }
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    let categories = x[i].getAttribute("data-categories");
    if (categories.includes(c) || c === "") {      
      w3AddClass(x[i], "show");
    }
  }
  var btnContainer = document.getElementById("myBtnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

document.querySelector("#search-form").addEventListener("submit", search);
const inputsRating = document.querySelectorAll("input[name=rating]");
const rate = document.querySelector("article").getAttribute("data-rate");
const inputRate = document.querySelector(`input[value="${rate}"]`);
console.log(rate);
console.log(inputRate);

if (inputRate) {
  inputRate.setAttribute("checked", "checked");
}

function updateRating(e) {
  console.log();
  
  fetch(`/update-rating/${idContent}`, {
    method: "PATCH",
    body: JSON.stringify({
      rating: e.currentTarget.value
    }),
    headers: { "Content-Type": "application/json" }
  }).catch(e => console.log("ERROR", e));
}

inputsRating.forEach(item => item.addEventListener("change", updateRating));

function search(e) {
  e.preventDefault();
  const searchValue = document.querySelector("#search").value;
  fetch(`/filterBy/${searchValue}`)
    .then(resp => resp.json())
    .then(data => switchDataOnScreen(data))
    .catch(err => console.log(err));
}