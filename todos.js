
// Variabler för Add Todo-modal
let addBtn = document.getElementById('addBtn');
let modal = document.getElementById('myModal');
let addNewTodoBtn = document.getElementById('addNewTodo');
let saveBtn = document.getElementById('saveTodo');
let close = document.getElementsByClassName('close')[0];

// Formulär för att lägga till todo
let todoForm = document.getElementById('todoForm');

// Container för alla todos i DOM
let todosContainer = document.getElementById('todosContainer');

// Array för att lagra alla todos
let todoStorage = [];

init();

// Lägg till lyssnare för att visa modalen när knappen klickas
addBtn.addEventListener('click', () => {
  todoForm.reset();
  modal.style.display = 'block';
  modalh2.innerText = 'New todo';
  saveBtn.style.display = "none";
  addNewTodoBtn.style.display = 'block';
});

// Funktion för att stänga modalen
close.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Funktion för att lägga till todo när formuläret skickas
addNewTodoBtn.addEventListener('click', () => {
  let userId = JSON.parse(localStorage.getItem("userOnline")).userId;

  //Skapa todo-objekt 
    let todo = {
        userId,
        title: '',
        description: '',
        category: '',
        estTime: '',
        estTimeIndex: '',
        deadline: '',
        isDoneCheckbox: null,
        isChecked: false,
      };
  // Uppdatera todo-objektet baserat på användarens inmatning
  
  todo.title = todoForm.title.value;
  todo.description = todoForm.description.value;
  todo.category = todoForm.modalCategory.value;
  todo.estTime = todoForm.modalEstTime.value;
  todo.estTimeIndex = todoForm.modalEstTime.selectedIndex;
  todo.deadline = todoForm.modalDeadline.value;
  todo.isDoneCheckbox = document.createElement('input');
  todo.isDoneCheckbox.type = 'checkbox';

  // Skapa todo-elementet och lägg till det i DOM:en
  let todoItem = createTodoElement(todo);
  appendTodoElement(todoItem);

  // Lägg till det nya todo-objektet i todoStorage och uppdatera localStorage
  todoStorage.push(todo);
  localStorage.setItem('todos', JSON.stringify(todoStorage));
  console.log(todoStorage);

  // Återställ formuläret och stäng modalen
  todoForm.reset();
});
console.log(todoStorage);

// Funktion för att skapa DOM-element för en todo
function createTodoElement(todo) {
  let todoItem = document.createElement('div');
  todoItem.classList.add('todo-item');
  todoItem.todo = todo;
  todoItem.classList.add(`category-${todo.category.toLowerCase().replace("&", "and").replace(/\s+/g, "-")}`);
  todoItem.innerHTML = `
        <h3>${todo.title}</h3>
        <p class="description">${todo.description}</p>
        <p class="category">Category: ${todo.category}</p>
        <p class="estTime">Time: ${todo.estTime}</p>
        <p class="deadline">Deadline: ${todo.deadline}</p>
    `;

  // Knappar, checkbox och label
  let editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="far fa-pen-to-square"></i>';
  editBtn.addEventListener('click', (event) => {
    modal.style.display = 'block';
    saveBtn.style.display = 'block';
    addNewTodoBtn.style.display = 'none';
    let modalh2 = document.querySelector('#modalh2');
    modalh2.innerText = 'Edit Todo';
    let todoItem = event.currentTarget.parentElement;
    currentEditedTodoItem = todoItem;
    let todoToEdit = todoItem.todo;

    let todoTitle = todoItem.querySelector('h3').innerText;
    let todoDescription = todoItem.querySelector('p').innerText;
    let todoCategory = todo.category;
    let todoEstTime = todo.estTime;
    let todoDeadline = todo.deadline;

    todoForm.title.value = todoTitle;
    todoForm.description.value = todoDescription;
    todoForm.modalCategory.value = todoCategory;
    todoForm.modalEstTime.value = todoEstTime;
    todoForm.modalDeadline.value = todoDeadline;
  });

  let deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  deleteBtn.addEventListener('click', () => {
    let indexToRemove = todoStorage.findIndex((item) => item === todo);
    // Ta bort todo från todoStorage-listan
    todoStorage.splice(indexToRemove, 1);
    todoItem.remove();
    updateLocalStorage();
    console.log(todoStorage);
  });

  // Skapa element för att ändra status av todo
  let isDoneCheckbox = document.createElement('input');
  isDoneCheckbox.type = 'checkbox';
  isDoneCheckbox.id = 'isDoneCheckbox';
  isDoneCheckbox.checked = todo.isChecked;
  if (todo.isChecked) {
    todoItem.classList.add('isDone');
  } else {
    todoItem.classList.remove('isDone');
  }

  let isDoneLabel = document.createElement('label');
    isDoneLabel.htmlFor = "isDoneCheckbox";
    isDoneLabel.innerText = "Completed";

  // Lyssnare för checkbox, toggla status
  isDoneCheckbox.addEventListener('change', () => {
    todo.isChecked = isDoneCheckbox.checked;
    todoItem.classList.toggle('isDone', isDoneCheckbox.checked);
    updateLocalStorage();
  });

  // Lägg till knappar, checkbox och label till todo-elementet
  todoItem.append(editBtn, deleteBtn, isDoneCheckbox, isDoneLabel);

  return todoItem;
}

// Funktion för att lägga till todo-element i DOM
function appendTodoElement(todoItem) {
  todosContainer.append(todoItem);
}

// Funktion för att uppdatera localStorage
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todoStorage));
}

// Funktion för att initiera programmet
function init() {
  loggedInUserId = JSON.parse(localStorage.getItem("userOnline")).userId;

  // Ladda todos från localStorage och rendera dem
  if (localStorage.getItem('todos')) {
    todoStorage = JSON.parse(localStorage.getItem('todos'));
     // 3. Filter todos based on loggedInUserId
    userTodos = todoStorage.filter((todo) => todo.userId === loggedInUserId);

    userTodos.forEach((todo) => {
      let todoItem = createTodoElement(todo);
      appendTodoElement(todoItem);
    });
  }
}

// Initiera programmet
// init();

// Eventlyssnare for saveBtn
saveBtn.addEventListener('click', () => {
  console.log('currentEditedTodoItem:', currentEditedTodoItem);
  console.log("körs");
  if (currentEditedTodoItem) {
    //hämta todo-objektet kopplat till den aktuella todon
    let todoToEdit = currentEditedTodoItem.todo;
    console.log('todoToEdit:', todoToEdit);

    //upppdatera egenskaperna för todo-objektet baserat på användarens inmatning i modalformuläret
    todoToEdit.title = todoForm.title.value;
    todoToEdit.description = todoForm.description.value;
    todoToEdit.category = todoForm.modalCategory.value;
    todoToEdit.estTime = todoForm.modalEstTime.value;
    todoToEdit.deadline = todoForm.modalDeadline.value;

    //uppdatera den motsvarande todo-posten i gränssnittet för att återspegla de gjorda ändringarna
    currentEditedTodoItem.querySelector('h3').innerText = todoToEdit.title;
    currentEditedTodoItem.querySelector('.description').innerText = todoToEdit.description;
    currentEditedTodoItem.querySelector('.category').innerText = `Category: ${todoToEdit.category}`;
    currentEditedTodoItem.querySelector('.estTime').innerText = `Time: ${todoToEdit.estTime}`;
    currentEditedTodoItem.querySelector('.deadline').innerText = `Deadline: ${todoToEdit.deadline}`;
    currentEditedTodoItem.classList.add(`category-${todoToEdit.category.toLowerCase().replace("&", "and").replace(/\s+/g, "-")}`);

    //uppdatera localStorage för att spara ändringarna
    updateLocalStorage();
    //stäng modalen och återställ formuläret
    saveBtn.style.display = 'none';
    modal.style.display = 'none';
    todoForm.reset();
  }
});

function sortTime() {

    let timeSelect = document.getElementById('sortTime');
    timeSelect.addEventListener('change', (event) => {
        let selectedOption = event.target.value;
        todosContainer.innerHTML = "";
        console.log(todoStorage);


        userTodos.sort(function(a, b){
            let deadlineA = new Date(a.deadline);
            let deadlineB = new Date(b.deadline);
            if (selectedOption === 'timeAscending')
                return a.estTimeIndex - b.estTimeIndex;
            else if (selectedOption === 'timeDescending') 
                return b.estTimeIndex - a.estTimeIndex;
              else  if (selectedOption === 'deadlineAscending')
                    return deadlineA - deadlineB;
                else if (selectedOption === 'deadlineDescending') 
                    return deadlineB - deadlineA;
        });

        userTodos.forEach(todoItem => {
            let todoElement = createTodoElement(todoItem);
            appendTodoElement(todoElement);
            
        });
    });
}




// Funktion för att filtrera todos baserat på status
function filterStatus() {
    let statusFilter = document.querySelector('#statusFilter'); 

    statusFilter.addEventListener("change", () => {
        let selectedStatusValue = statusFilter.value;

        todoItems = document.querySelectorAll(".todo-item");

        todoItems.forEach(todoItem => {
            let isDoneCheckbox = todoItem.querySelector('input[type="checkbox"]').checked

            if (selectedStatusValue === "all") {
                todoItem.style.display = "block"; 
            } else if (selectedStatusValue === "completed" && !isDoneCheckbox){
                todoItem.style.display = "none"; 
            } else if (selectedStatusValue === "pending" && isDoneCheckbox) {
                todoItem.style.display = "none"; 
            } else {
                todoItem.style.display = "block";
            }
        });
    });
}

// Funktion för att filtrera todos baserat på kategori
function filterByCategory() {
    let selectedCategories = Array.from(document.querySelectorAll('.categoryFilter input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    if (selectedCategories.length === 0) {
        document.querySelectorAll('.todo-item').forEach(todoItem => {
            todoItem.style.display = 'block';
        });
        return;
    }

    document.querySelectorAll('.todo-item').forEach(todoItem => {
        let category = todoItem.querySelector('.category').textContent.split(': ')[1];
        if (selectedCategories.includes(category)) {
            todoItem.style.display = 'block';
        } else {
            todoItem.style.display = 'none';
        }
    });
}

// Lyssnare för ändringar i kategorifilter
document.querySelectorAll('.categoryFilter input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterByCategory);
});


filterStatus();
sortTime();
function updateLocalStorage () {
    localStorage.setItem("todos", JSON.stringify(todoStorage));
};
