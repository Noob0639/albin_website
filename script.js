const myBody = document.querySelector("body");
const myButton = document.querySelector("#toggleMode")

myBody.style.backgroundColor = "white";
myBody.style.color = "black";

function darkMode() {
    if (myBody.style.backgroundColor === "white") {
        myBody.style.backgroundColor = "black";
        myBody.style.color = "white";
        myButton.textContent = "☀️";
    } else {
        myBody.style.backgroundColor = "white";
        myBody.style.color = "black";
        myButton.textContent = "🌙";
    }
}

myButton.addEventListener("click", darkMode);