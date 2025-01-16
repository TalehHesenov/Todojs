const todoName = document.querySelector("#todoName");
const addBtn = document.querySelector("#todoAddButton");
const todoSearch = document.querySelector("#todoSearch");
const ul = document.querySelector(".list-group");
const clearBtn = document.querySelector("#clearButton");
const sortSelect = document.querySelector("#sortSelect");
const alertForm = document.querySelector("#todoAddForm");




let todos = JSON.parse(sessionStorage.getItem("todos"));

if(todos == null){
    todos = []
     
 }
 renderTodos();

function addTodo(){

   if(todoName.value.trim() !== ""){
    const todo = {
        id: Date.now().toString(),
        text: todoName.value.trim(),
        date: new Date(),
        read:true,

    }

    todos.push(todo);
    todoName.value = "";
    sessionStorage.setItem("todos",JSON.stringify(todos));
    renderTodos();
    
    alertFun("Todo Elave Olundu","success");
    
   }else{

    alertFun("Alan Bos Buraxmayin(Todo Elave Olunmadi)","danger");
   }
}
function renderTodoItem(item) {
    
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.id = item.id;

    li.innerHTML = `<h4>${item.text}</h4> <p>${new Date(item.date).toLocaleString('az-AZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    }).replace(',', '')}</p> <div>
                      <a href="#" class="check-item me-2 text-decoration-none">
                        <i class="fa fa-check-circle"></i>
                      </a>
                      <a href="#" class="edit-item me-2 text-decoration-none">
                        <i class="fa fa-pencil-alt"></i>
                      </a>
                      <a href="#" class="delete-item text-decoration-none">
                        <i class="fa fa-times"></i>
                      </a>
                    </div>`;

    if (item.read === false) {
        li.classList.add("active");
    }

    ul.appendChild(li);
}

function renderTodos(){

    ul.innerHTML = "";

    todos.forEach(item =>{
        renderTodoItem(item);

    })
    

    
}

function deleteTodo(id){

    todos = todos.filter(item => item.id !== id);
    renderTodos();
    alertFun("Delete Todo","danger");

}

function getId(e){
    e.preventDefault();

    const todoId = e.target.closest("li").id;

    if (e.target && e.target.closest('.delete-item')) {
        
        deleteTodo(todoId);
     }
     if (e.target && e.target.closest('.check-item')) {
       
        checkTodo(todoId);
        renderTodos();
     }
     if (e.target && e.target.closest('.delete-item')) {
       
        updateTodo(todoId);
     }

     if (e.target && e.target.closest('.edit-item')) {
        updateTodo(todoId); 
    }


}

function allDeleteTodos(){

    ul.innerHTML = "";
    todos = [];
    alertFun("All ToDo Delete","info");
}

function checkTodo(id){
    todos.forEach(item =>{
        if(item.id === id){
            if(item.read == false){
                item.read = true;
            }else{
                item.read = false;
            }
            
        }
    })

}

function updateTodo(id) {

    const todoToEdit = todos.find(item => item.id === id);
    if (!todoToEdit) return;

    const li = document.getElementById(id);
    const todoText = li.querySelector("h4"); 
    const editDiv = li.querySelector("div"); 


    const input = document.createElement("input");
    input.type = "text";
    input.value = todoText.textContent; 
    input.className = "form-control"; 
    input.style.width = "80%";
    todoText.replaceWith(input); 

   
    const saveBtn = document.createElement("a");
    saveBtn.href = "#";
    saveBtn.className = "save-item text-decoration-none ms-2";
    saveBtn.innerHTML = `<i class="fa fa-check-circle"></i>`;

    editDiv.appendChild(saveBtn); 

   
    const checkBtn = li.querySelector(".check-item");
    const editBtn = li.querySelector(".edit-item");
    const deleteBtn = li.querySelector(".delete-item");

    checkBtn.style.display = "none";
    editBtn.style.display = "none";
    deleteBtn.style.display = "none";

   
    saveBtn.addEventListener("click", function () {
        const newText = input.value.trim();
        if (newText) {
            todoToEdit.text = newText; 
            todoToEdit.date = new Date(); 
            renderTodos(); 
            alertFun("Todo Update","info");
        }
    });

}

function sortTodos(){

    const sortValue = sortSelect.value;

    if (sortValue == "nameSort") {

        sortName();
        
    }
    else if(sortValue == "timeSort"){
        timeName();
    }
}

function sortName (){
    ul.innerHTML = "";
    todos.sort((a, b) => {
        return a.text.localeCompare(b.text);  
    })
    .forEach(item => {
        renderTodoItem(item);
    });


}

function timeName(){
    ul.innerHTML = "";
    todos.sort((a, b) => {
        return new Date(a.date) - new Date(b.date); 
    }).forEach(item => {
        renderTodoItem(item);
    });
}

function searchTodo(){


    ul.innerHTML = "";

    todos.forEach(item => {
        
        if (item.text.toLowerCase().includes(todoSearch.value.toLowerCase())) {
            renderTodoItem(item);
        }
    });
}

function alertFun(text,color){

        const div = document.createElement("div");
        div.style.marginTop = "20px";
div.className =`alert alert-${color}`;
div.role = "alert";
div.innerHTML = text;

alertForm.appendChild(div);

setTimeout(() => {
    div.remove(); 
}, 1000)
   

}

function enterKey(event){

        if (event.key === "Enter") {
            addTodo();
        }
    
}

todoSearch.addEventListener("input",searchTodo);
ul.addEventListener("click",getId);
addBtn.addEventListener("click",addTodo);
clearBtn.addEventListener("click",allDeleteTodos);
sortSelect.addEventListener("change",sortTodos);
document.addEventListener("keydown", enterKey);




