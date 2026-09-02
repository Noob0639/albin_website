const list = document.querySelector("ol");
const newText = document.querySelector("input");

let itemsArray = JSON.parse(localStorage.getItem("ValueList")) || [];

updateListDOM();

function updateListDOM() {
    list.innerHTML = "";
    
    itemsArray.forEach(item => {
        list.innerHTML += `<li>${item}</li>`;
    });
}

function saveToLocalStorage() {
    localStorage.setItem("ValueList", JSON.stringify(itemsArray));
}

function addListItem() {
    const trimmedValue = newText.value.trim();
    
    if (trimmedValue !== "") {
        itemsArray.push(trimmedValue);
        
        updateListDOM();
        saveToLocalStorage();

        newText.value = "";
    }
}

function delListItem() {
    if (newText.value === "" && itemsArray.length > 0) {
        itemsArray.pop();
        
        updateListDOM();
        saveToLocalStorage();
    }
}

newText.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addListItem();
    }
});

newText.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        delListItem();
    }
});
