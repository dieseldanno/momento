let display = document.querySelector(".numberDisplay");
let longBtn = document.querySelector("#longBreak");
let shortBtn = document.querySelector("#shortBreak");
let setTimeBtn = document.querySelector("#setTimeBtn");
let closeSetModal = document.getElementsByClassName('closeSetModal');
let setModal = document.getElementById("set-modal");
let timeInput = document.querySelector("#timeInput");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

let preSetTime = {
    "Long": 15 * 60 * 1000, // Lång paus
    "Short": 5 * 60 * 1000, // Kort paus
};

longBtn.addEventListener("click", () => {
    setDisplayTime(preSetTime["Long"]); // Sätt lång paustid
});

shortBtn.addEventListener("click", () => {
    setDisplayTime(preSetTime["Short"]); // Sätt kort paustid
});

setBtn.addEventListener("click", () => {
    // Sätt tid
});

function start() {
    if (!isRunning) {
        // Hämta den förinställda tiden från display, konvertera till int.
        let displayedTime = display.textContent.split(":");
        let minutes = parseInt(displayedTime[0], 10);
        let seconds = parseInt(displayedTime[1], 10);

        // Konvertera minuter och sekunder till millisekunder.
        let totalTime = minutes * 60 * 1000 + seconds * 1000;

        // Starta nedräkning
        startTime = Date.now();
        isRunning = true;

        timer = setInterval(() => {
            let currentTime = Date.now();
            elapsedTime = currentTime - startTime;

            let remainingTime = Math.max(0, totalTime - elapsedTime); // Säkerställ att värdet är icke-negativt
            let remainingMinutes = Math.floor((remainingTime / 1000) / 60);
            let remainingSeconds = Math.floor((remainingTime / 1000) % 60);

            // Uppdatera displayen med återstående tid
            display.textContent = `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

            if (remainingTime <= 0) {
                clearInterval(timer);
                isRunning = false;
            }
        }, 1000); // Uppdatera varje sekund.
    }
}

function stop() {
    console.log("click");
      clearInterval(timer); // Rensa intervallet för att stoppa uppdateringar
      isRunning = false;   // Sätt flaggan för körande till falsk
      timer = null;        // Återställ timer 
      display.textContent = "00:00"; // Uppdatera displayen till noll
}

function pause(){
    if(isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

function setDisplayTime(timeInMilliseconds) {
    // Konvertera millisekunder till timmar och minuter
    let presetMinutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    let presetSeconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
  
    // Uppdatera displayen med den förinställda tiden.
    display.textContent = `${presetMinutes.toString().padStart(2, '0')}:${presetSeconds.toString().padStart(2, '0')}`;
}

function setPresetTime(timeInMilliseconds) {
    if (isRunning) {
      stop(); // Stoppa timern innan en ny förinställning sätts
    }
    elapsedTime = 0; // Återställ den förflutna tiden för den nya förinställningen
    startTime = Date.now() + timeInMilliseconds; // Sätt starttiden till aktuell tid + förinställd tid
  
    // Konvertera millisekunder till timmar och minuter
    const presetHours = Math.floor(timeInMilliseconds / (1000 * 60 * 60));
    const presetMinutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
    // Uppdatera displayen med den förinställda tiden
    display.textContent = `${presetHours.toString().padStart(2, '0')}:${presetMinutes.toString().padStart(2, '0')}`;
  
    timer = setInterval(update, 10); // Starta timern med den nya förinställningen
    isRunning = true;
}

function showModal() {
    document.getElementById("set-modal").style.display = "block"; // Visa modalen
}
  
function hideModal() {
    document.getElementById("set-modal").style.display = "none"; // Göm modalen
}
document.querySelector("#setTimeBtn").addEventListener("click", () => {
    showModal();
})
document.getElementById("setBtn").addEventListener("click", () => {
    const timeInMinutes = parseInt(document.getElementById("timeInput").value);
  
      // Uppdatera displayen med formaterad tid
      display.textContent = `${timeInMinutes.toString().padStart(2, '0')}:00`;
      timeInput.value = "";
  
      // Göm modalen
      hideModal();
});

document.getElementById("cancelBtn").addEventListener("click", hideModal, timeInput.value = "");

closeSetModal.onclick = function () {
    timeInput.value = "";
    setModal.style.display = 'none'; // Göm modalen
};
  
window.onclick = function (event) {
    if (event.target == setModal) {
        timeInput.value = "";
      setModal.style.display = 'none'; // Göm modalen om klick utanför modalen
    }
}; 

let pomodoroBtn = document.querySelector(".pomodoro-desktop");
console.log(pomodoroBtn);
let pomodoroModal = document.querySelector(".outerModal");
pomodoroBtn.addEventListener("click", () => {
    pomodoroModal.classList.add("open");
    console.log("hej")
});

window.addEventListener("click", (event) => {
    if(event.target == pomodoroModal) {
        pomodoroModal.classList.remove("open");
    }
});