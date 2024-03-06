// Retrieve habits from localStorage or initialize empty array
const habits = JSON.parse(localStorage.getItem("habits")) || [];

// Selecting DOM elements
const addHabits = document.querySelector(".add-habit");
const habitsList = document.querySelector(".habits");

listHabits(habits, habitsList);
// Function to add a new habit
function addHabit(e) {
  e.preventDefault(); // Prevent default form submission behavior
  
  // Retrieving input values
  const text = e.target.querySelector("[name=habit]").value;
  const totalCounts = Number(e.target.querySelector("[name=reps]").value);
  const timeframe = e.target.querySelector("[name=timeframe]").value;
  const priority = document.querySelector("[name=priority]").value;

  // Creating a new habit object
  let habit = {
    text,
    reps: 0,
    totalCounts,
    timeframe,
    completed: false,
    priority,
    streak: 0,
  };
  habit.streak = 0; // Initialize streak to 0 for new habits
  habits.push(habit); // Add habit to the array
  listHabits(habits, habitsList); // Update habit list
  localStorage.setItem("habits", JSON.stringify(habits)); // Save habits to localStorage
  e.target.reset(); // Reset the form
}

// Function to display habits
function listHabits(habits = [], habitsList) {
  habitsList.innerHTML = habits.map((habit, i) => {
    // Generate HTML for each habit
    const disabled = habit.streak === 0 ? "disabled" : ""; // Set disabled class if streak is 0
    return `
      <li class="shadow border rounded bg-light mx-auto m-4 p-3">
      <h4>${habit.text}<i class="fa-solid fa-sun"></i>  ${habit.streak}<i class="fa-solid fa-fire"></i>   ${habit.priority}</h4> 
          <span>${habit.reps}/${habit.totalCounts} ${habit.timeframe}</span> 
          <input type="checkbox" data-index="${i}" id="habit${i}" ${habit.completed ? "checked" : ""} />
        <button class="btn btn-light shadow border btn-decrement ${disabled}" data-index="${i}" data-streak="${habit.streak}"><i class="fa-solid fa-minus"></i></button>
        <span>${habit.streak}</span>
        <button class="btn btn-light shadow border btn-increment" data-index="${i}"> <i class="fa-solid fa-plus"></i></button>
        <button class="btn btn-light shadow border btn-reset ${disabled}" data-index="${i}" data-streak="${habit.streak}"><i class="fa-solid fa-rotate-left"></i></button>
        <button class="btn bg-danger shadow border delete" data-index="${i}" id="delete${i}"><i class="fa-solid fa-xmark"></i></button>
      </li>
    `;
  }).join("");
}

// Function to toggle completion status of habit
function toggleCompleted(e) {
  if (!e.target.matches("input")) return;
  
  const el = e.target;
  const index = el.dataset.index;

  // Update reps based on checkbox state
  let delta = el.checked ? 1 : 0;
  habits[index].reps = Math.min(habits[index].reps + delta, habits[index].totalCounts);

  // Update streak and completion state
  if (habits[index].reps === habits[index].totalCounts) {
    habits[index].streak++;
    habits[index].completed = true;
    habits[index].reps = 0; // Reset reps for the next cycle
  } else {
    habits[index].completed = false;
  }

  listHabits(habits, habitsList); // Update the UI
  localStorage.setItem("habits", JSON.stringify(habits)); // Save habits to localStorage
}

// Function to update habit streak
function updateHabitStreak(index, delta) {
  habits[index].streak = Math.max(0, habits[index].streak + delta);
  listHabits(habits, habitsList); // Update the UI
  localStorage.setItem("habits", JSON.stringify(habits)); // Save habits to localStorage
}

// Function to handle streak buttons
function handleStreakButtons(e) {
  if (!e.target.matches(".btn-increment, .btn-decrement, .btn-reset")) return; // Not a streak button, exit
  
  const el = e.target;
  const index = el.dataset.index;
  const streak = habits[index].streak;
  
  if (el.classList.contains("btn-increment")) {
    updateHabitStreak(index, 1); // Increment streak
  } else if (el.classList.contains("btn-decrement")) {
    if (streak > 0) { // Update streak if streak > 0
      updateHabitStreak(index, -1);
    }
  } else if (el.classList.contains("btn-reset")) {
    if (streak > 0) { // Reset streak if streak > 0
      el.classList.remove("disabled"); // Remove disabled class
      habits[index].streak = 0;
      updateHabitStreak(index, 0);
    }
  }
  e.stopPropagation(); // Prevent event bubbling
}

// Event listener for clicks on habitsList
habitsList.addEventListener("click", function (e) {
  // Check for checkbox clicks
  if (e.target.matches("input[type=checkbox]")) {
    toggleCompleted(e);
  }
  
  // Check for delete button clicks and other buttons
  if (e.target.matches(".delete")) {
    deleteHabit(e);
  } else {
    handleStreakButtons(e);
  }
});

// Event listener for form submission
addHabits.addEventListener("submit", function (e) {
  addHabit(e); // Handle adding the habit
});

// Function to delete habit
function deleteHabit(e) {
  if (!e.target.matches("button")) return;
  
  const el = e.target;
  const index = el.dataset.index;
  
  habits.splice(index, 1); // Remove habit from the array
  listHabits(habits, habitsList); // Update habit list
  localStorage.setItem("habits", JSON.stringify(habits)); // Save habits to localStorage
}

function sortHabits() {
    let sortSelect = document.getElementById("sortHabits");
    sortSelect.addEventListener("change", (event) => {
      let selectedOption = event.target.value;
      habits.innerHTML = ""; // Clear existing list items
  
  
      habits.sort(function (a, b) {
        if (selectedOption === "highest-streak") {
          // Sort descending for highest streak
          return b.streak - a.streak; // Reverse order for descending sort
        } else if (selectedOption === "lowest-streak") {
          // Sort ascending for lowest streak
          return a.streak - b.streak; // Keep order for ascending sort
        } else if (selectedOption === "highest-priority") {
          // Sort priority descending (highest priority first)
          return b.priority.localeCompare(a.priority); 
        } else if (selectedOption === "lowest-priority") {
          // Sort priority ascending (lowest priority first)
          return a.priority.localeCompare(b.priority); 
        }
        // Add other sorting options if needed
      });
  
      listHabits(habits, habitsList); // Update the UI with sorted habits
      
    });
  }

  // Update habits list and sort initially
listHabits(habits, habitsList);
sortHabits();