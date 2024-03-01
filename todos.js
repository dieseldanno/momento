
// Variabler för Add Todo-modal
let addBtn = document.getElementById("addBtn");
let modal = document.getElementById("myModal");
let close = document.getElementsByClassName("close")[0];

// Formulär för att lägga till todo
let todoForm = document.getElementById('todoForm');

// Container för alla todos
let todosContainer = document.getElementById('todosContainer');

// Array för att lagra alla todos
let todoArray = [];
  

addBtn.addEventListener("click", addTodo);

// Funktion för att lägga till en ny todo
function addTodo() {
    todoForm.reset();
    modal.style.display = "block";
    modalh2.innerText = "New todo";
    saveBtn.innerText = "Add Todo";

}

// Funktion för att stänga modalen
close.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
};

function closeModal (){
    modal.style.display = "none";
}

// Lyssnare för att lägga till todo när formuläret skickas
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let title = todoForm.title.value;
    let description = todoForm.description.value;

    let categoryIndex = todoForm.modalCategory.selectedIndex; 
    let categoryIndexText = todoForm.modalCategory.options[categoryIndex].textContent; 
    let category = categoryIndexText;

    let estTimeIndex = todoForm.modalEstTime.selectedIndex;
    let estTimeIndexText = todoForm.modalEstTime.options[estTimeIndex].textContent;
    let estTime = estTimeIndexText
    let deadline = todoForm.modalDeadline.value;
    // let deadline = new Date(todoForm.modalDeadline.value);

    let isDoneCheckbox = document.createElement("input");
    isDoneCheckbox.type = "checkbox";

    let todo  = {
        title, 
        description,
        categoryIndex,
        category,
        estTimeIndex,
        estTime,
        deadline,
        isDoneCheckbox,
        isChecked:false,
    };

    renderTodos(todo);

    todoForm.reset();

    closeModal();
});

// Funktion för att rendera en todo
function renderTodos(todo) {
    let todoItem = createTodoElement(todo);
    appendTodoElement(todoItem);
    todoArray.push(todo);
    
};

// Funktion för att skapa DOM-element för en todo
function createTodoElement(todo) {
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
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
    editBtn.addEventListener('click', () => {
            modal.style.display = "block";
            let modalh2 = document.querySelector('#modalh2');
            modalh2.innerText = "Edit Todo";
        
            saveBtn = document.querySelector('#addNewTodo');
            saveBtn.innerText = "Save";
        
            // let todoItem = event.currentTarget.parentElement;
            let todoTitle = todoItem.querySelector('h3').innerText;
            let todoDescription = todoItem.querySelector('p').innerText;
            let todoCategory = todo.categoryIndex;
            let todoEstTime = todo.estTimeIndex;
            let todoDeadline = todo.deadline;
            
            console.log(todoCategory, todoEstTime);
            todoForm.title.value = todoTitle;
            todoForm.description.value = todoDescription;
            todoForm.modalCategory.selectedIndex = todoCategory;
            todoForm.modalEstTime.selectedIndex = todoEstTime;
            todoForm.modalDeadline.value = todoDeadline;
        
            saveBtn.addEventListener("click", () => {
                todoItem.remove()
                renderTodos();
                modal.style.display = "none";
                todoForm.reset();
            }
        )});
        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.addEventListener('click', () => {
            todoItem.remove();
        });

    let isDoneCheckbox = document.createElement('input');
    isDoneCheckbox.type = "checkbox";
    isDoneCheckbox.id = "isDoneCheckbox";
    isDoneCheckbox.checked = todo.isChecked;
    if (todo.isChecked) {
        todoItem.classList.add("isDone");
      } else {
        todoItem.classList.remove("isDone");
      };

    let isDoneLabel = document.createElement('label');
    isDoneLabel.htmlFor = "isDoneCheckbox";
    isDoneLabel.innerText = "Done";

    // Lyssnare för checkbox
    isDoneCheckbox.addEventListener("change", () => {
        todo.isChecked = isDoneCheckbox.checked;
        todoItem.classList.toggle("isDone", isDoneCheckbox.checked)
    });

    // Lägg till knappar, checkbox och label till todo-elementet
    todoItem.append(editBtn, deleteBtn, isDoneCheckbox, isDoneLabel);

     return todoItem;
    };

// Funktion för att lägga till todo-element i DOM
function appendTodoElement(todoItem) {
    todosContainer.append(todoItem);
}

// Funktion för att sortera todos efter tid
function sortTime() {
    let timeSelect = document.getElementById('sortTime');
    timeSelect.addEventListener('change', (event) => {
        let selectedOption = event.target.value;
        todosContainer.innerHTML = "";


        todoArray.sort(function(a, b){
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
        todoArray.forEach(todoItem => {
            let todoElement = createTodoElement(todoItem);
            appendTodoElement(todoElement);
            
        });
    });
}

// Funktion för att filtrera todos baserat på status
function
filterStatus() {
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


