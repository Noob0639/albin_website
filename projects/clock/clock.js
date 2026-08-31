const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

function updateClock() {
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString();
    dateElement.textContent = now.toLocaleDateString();
}

setInterval(updateClock, 1000);
updateClock();

