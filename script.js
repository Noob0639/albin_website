const myBody = document.querySelector("body");
const myButton = document.querySelector("#toggleMode")

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    myBody.style.backgroundColor = "gray";
    myBody.style.color = "white";
    myButton.textContent = "☀️";
} else {
    myBody.style.backgroundColor = "white";
    myBody.style.color = "black";
    myButton.textContent = "🌙";
}



function darkMode() {
    if (myBody.style.backgroundColor === "white") {
        myBody.style.backgroundColor = "gray";
        myBody.style.color = "white";
        myButton.textContent = "☀️";

        localStorage.setItem("theme", "dark");
    } else {
        myBody.style.backgroundColor = "white";
        myBody.style.color = "black";
        myButton.textContent = "🌙";

        localStorage.setItem("theme", "light")
    }
}

myButton.addEventListener("click", darkMode);