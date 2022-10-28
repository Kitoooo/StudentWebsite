//SAMPLE DATA STRUCTURE MAYBE
// var todo-tasks = {
//     "items" : [
//         {
//             task : 'test1',
//             date : ''
//         },
//         {
//             task : 'test2',
//             date : '20-12-2000'
//         }
//     ]
// }
// debugger;

//initialization
//rendering todo list

//creating local storage variable if it doesn't exist
if (localStorage.getItem("todo-tasks") === null) {
  localStorage.setItem("todo-tasks", '{"items":[]}');
}
renderTodoList();

//####################################################################################################################

function searchElement() {
  renderTodoList();
  let searchValue = document.getElementById("search-task").value;
  let searchValueRegexp = new RegExp(searchValue, "gi");
  tbody = document.getElementById("todo-list");
  for (let i = 0; i < tbody.rows.length; i++) {
    let row = tbody.rows[i];
    let cell = row.cells[0];
    if (cell.innerHTML.indexOf(searchValue) > -1) {
      row.style.display = "";
      cell.innerHTML = cell.innerHTML.replace(
        searchValueRegexp,
        `<span class="highlight">${searchValue}</span>`
      );
    } else {
      row.style.display = "none";
    }
  }
}

function addElement() {
  function saveToLocalStorage(inputvalue) {
    let todo_tasks = JSON.parse(localStorage.getItem("todo-tasks"));
    todo_tasks["items"].push(inputvalue);
    localStorage.setItem("todo-tasks", JSON.stringify(todo_tasks));
  }
  function getInputTaskAndDate() {
    function validateTaskAndDate(task, date) {
      task = task.trim();
      if (task.length < 3 || task.length > 255) {
        alert("Wrong task length, must be between 3 and 255.");
      } else if (Date.parse(date) - Date.now() < 0) {
        alert("Wrong date, earliest date needs to be at least tommorow.");
      } else {
        return true;
      }
      return false;
    }

    let task = document.getElementById("adding-task").value;
    let date = document.getElementById("adding-date").value;
    if (validateTaskAndDate(task, date)) {
      let inputValue = {};
      inputValue["task"] = task;
      inputValue["date"] = date;
      return inputValue;
    }
  }

  inputValue = getInputTaskAndDate();
  if (inputValue) {
    saveToLocalStorage(inputValue);
    renderTodoList();
  }
}

function renderTodoList() {
  function deleteItemFromLocalStorage(index) {
    let todo_tasks = JSON.parse(localStorage.getItem("todo-tasks"));
    todo_tasks["items"].splice(index, 1);
    localStorage.setItem("todo-tasks", JSON.stringify(todo_tasks));
    renderTodoList();
  }

  let todo_tasks = JSON.parse(localStorage.getItem("todo-tasks"));
  let tbody = document.getElementById("todo-list"); //??
  // document.createElement("tbody", "todo-list");
  tbody.innerHTML = "";
  todo_tasks["items"].forEach((element, index) => {
    let tr = document.createElement("tr");

    let td_task = document.createElement("td");
    let td_date = document.createElement("td");
    let td_delete_button = document.createElement("td");
    let delete_button = document.createElement("button");

    //apply classes to button
    delete_button.classList.add("btn");
    delete_button.classList.add("btn-danger");

    //add listener to button
    delete_button.addEventListener("click", () => {
      deleteItemFromLocalStorage(index);
    });

    //add editing to task
    td_task.addEventListener("click", () => {
      td_task.contentEditable = true;
      td_task.addEventListener("blur", () => {
        td_task.contentEditable = false;
        todo_tasks["items"][index]["task"] = td_task.innerText;
        localStorage.setItem("todo-tasks", JSON.stringify(todo_tasks));
      });
    });

    //append data to td
    td_task.appendChild(document.createTextNode(element["task"]));
    td_date.appendChild(document.createTextNode(element["date"]));
    delete_button.appendChild(document.createTextNode("Delete"));
    td_delete_button.appendChild(delete_button);

    //append children to tr
    tr.appendChild(td_task);
    tr.appendChild(td_date);
    tr.appendChild(td_delete_button);

    //append tr to tbody
    tbody.appendChild(tr);
  });
}

function clearStorage() {
  localStorage.setItem("todo-tasks", `{"items":[]}`);
}
