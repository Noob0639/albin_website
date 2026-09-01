 const time = document.querySelector(".time");

function updateClock() {

    const now = new Date();

    const [hour, minutes, seconds] = [
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
    ];
    
    time.textContent = `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

updateClock();

setInterval(updateClock, 1000);
