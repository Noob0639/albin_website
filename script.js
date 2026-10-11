const myBody = document.querySelector("body");
const myButton = document.querySelector("#toggleMode")

const savedTheme = localStorage.getItem("theme");

function setTheme(theme) {
    if (theme === "dark") {
        myBody.style.backgroundColor = "#000000";
        myBody.style.color = "#ffffff";
        myButton.textContent = "☀️";
        myBody.classList.add("light-mode");
        myBody.classList.remove("light-mode");
    } else {
        myBody.style.backgroundColor = "#ffffff";
        myBody.style.color = "#000000";
        myButton.textContent = "🌙";
        myBody.classList.remove("light-mode");
        myBody.classList.add("light-mode");
    }
}

// Load saved theme
if (savedTheme === "dark") {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
} else {
    setTheme("light");
    localStorage.setItem("theme", "light");
}

// Toggle function
function toggleMode() {
    const isDark = localStorage.getItem("theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
}

myButton.addEventListener("click", toggleMode);