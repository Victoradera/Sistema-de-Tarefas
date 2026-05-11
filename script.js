const taskInput =
  document.getElementById("taskInput");

const addTaskButton =
  document.getElementById("addTaskButton");

const taskList =
  document.getElementById("taskList");

const taskCounter =
  document.getElementById("taskCounter");


let tasks = [];

let currentFilter = "all";


/*
========================
SALVAR NO LOCAL STORAGE
========================
*/

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}


/*
========================
CARREGAR TASKS
========================
*/

function loadTasks() {

  const storedTasks =
    localStorage.getItem("tasks");

  if (storedTasks) {

    tasks =
      JSON.parse(storedTasks);

    renderTasks();
  }

}


/*
========================
ATUALIZAR CONTADOR
========================
*/

function updateCounter() {

  taskCounter.textContent =
    `${tasks.length} tarefas`;

}


/*
========================
RENDERIZAR TASKS
========================
*/

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = [];

  /*
  ========================
  FILTROS
  ========================
  */

  if (currentFilter === "pending") {

    filteredTasks =
      tasks.filter(
        task => !task.completed
      );

  }

  else if (
    currentFilter === "completed"
  ) {

    filteredTasks =
      tasks.filter(
        task => task.completed
      );

  }

  else {

    filteredTasks = tasks;

  }


  /*
  ========================
  MENSAGEM VAZIA
  ========================
  */

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <p class="empty-message">
        Nenhuma tarefa encontrada
      </p>
    `;

    updateCounter();

    return;
  }


  /*
  ========================
  RENDERIZAÇÃO
  ========================
  */

  filteredTasks.forEach((task) => {

    const li =
      document.createElement("li");

    li.classList.add("task-item");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span class="task-text">
        ${task.text}
      </span>

      <div class="task-actions">

        <button class="complete-button">
          ✔
        </button>

        <button class="edit-button">
          Editar
        </button>

        <button class="delete-button">
          X
        </button>

      </div>
    `;


    /*
    ========================
    COMPLETAR
    ========================
    */

    const completeButton =
      li.querySelector(".complete-button");

    completeButton.addEventListener(
      "click",
      () => {

        task.completed =
          !task.completed;

        saveTasks();

        renderTasks();

      }
    );


    /*
    ========================
    EDITAR
    ========================
    */

    const editButton =
      li.querySelector(".edit-button");

    editButton.addEventListener(
      "click",
      () => {

        const newText =
          prompt(
            "Editar tarefa:",
            task.text
          );

        if (
          newText === null
        ) {
          return;
        }

        const trimmedText =
          newText.trim();

        if (
          trimmedText === ""
        ) {
          return;
        }

        task.text =
          trimmedText;

        saveTasks();

        renderTasks();

      }
    );


    /*
    ========================
    REMOVER
    ========================
    */

    const deleteButton =
      li.querySelector(".delete-button");

    deleteButton.addEventListener(
      "click",
      () => {

        tasks =
          tasks.filter(
            t => t.id !== task.id
          );

        saveTasks();

        renderTasks();

      }
    );

    taskList.appendChild(li);

  });

  updateCounter();

}


/*
========================
ADICIONAR TASK
========================
*/

function addTask() {

  const taskText =
    taskInput.value.trim();

  /*
  ========================
  VALIDAÇÃO
  ========================
  */

  if (taskText === "") {
    alert("Digite uma tarefa.");
    return;
  }


  /*
  ========================
  DUPLICADAS
  ========================
  */

  const alreadyExists =
    tasks.some(
      task =>
        task.text.toLowerCase()
        === taskText.toLowerCase()
    );

  if (alreadyExists) {

    alert(
      "Essa tarefa já existe."
    );

    return;
  }


  /*
  ========================
  NOVA TASK
  ========================
  */

  const newTask = {

    id: Date.now(),

    text: taskText,

    completed: false

  };

  tasks.push(newTask);

  saveTasks();

  renderTasks();

  taskInput.value = "";

  taskInput.focus();

}

/*
========================
EVENTOS
========================
*/

addTaskButton.addEventListener(
  "click",
  addTask
);

taskInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      addTask();
    }

  }
);


/*
========================
INICIAR APP
========================
*/

loadTasks();

const filterButtons =
  document.querySelectorAll(
    ".filter-button"
  );


filterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      /*
      ========================
      BOTÃO ATIVO
      ========================
      */

      filterButtons.forEach(
        btn =>
          btn.classList.remove("active")
      );

      button.classList.add("active");


      /*
      ========================
      FILTRO
      ========================
      */

      const text =
        button.textContent;

      if (text === "Pendentes") {
        currentFilter = "pending";
      }

      else if (
        text === "Concluídas"
      ) {
        currentFilter = "completed";
      }

      else {
        currentFilter = "all";
      }

      renderTasks();

    }
  );

});