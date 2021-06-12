const selectOp = document.querySelector("select#task");
const text = document.querySelector(".modal div.details textarea");
const submitBtn = document.querySelector("button#sub");
const modal = document.querySelector("div.modal");
const addBtn = document.querySelector("button#addtask");
const removeBtn = document.querySelector("button#removetask");
const time = document.querySelector("div.time");
const main = document.querySelector("main.notes");
const removeTask = document.querySelector("button#removetask");
const editTaskModal = document.querySelector(".modal-edit-task");
let tasksList = [];
document.documentElement.style.setProperty(
  "--currentHeight",
  `${window.innerHeight}px`
);
const createEditTaskField = () => {
  const editField = document.createElement("div");
  editField.classList.add("edit-field");
  const h4 = document.createElement("h4");
  const editTextArea = document.createElement("textarea");

  editField.appendChild(h4);
  editField.appendChild(editTextArea);
  document.body.appendChild(editField);
};
createEditTaskField();
const editTaskField = document.querySelector(".edit-field");
const handleSubmitEditTask = (h4, singleNoteText, singleNotePicked) => {
  const submitButton = h4.querySelector("i");
  submitButton.addEventListener("click", (e) => {
    const newValue = e.currentTarget.parentElement.nextElementSibling.value;
    singleNoteText.textContent = newValue;

    [singleNotePicked, editTaskField].forEach((itm) =>
      itm.removeAttribute("style")
    );
    editTaskModal.classList.remove("active");
    const righIndex = tasksList.findIndex(
      (task) => task.id === singleNotePicked.dataset.id
    );
    tasksList[righIndex].textContent = newValue;
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  });
};

const editSingleNote = (event) => {
  const singleNotePicked = event.target.closest("div");
  const h4Field = editTaskField.querySelector("h4");
  const textAreaField = editTaskField.querySelector("textarea");
  h4Field.style.backgroundColor =
    singleNotePicked.firstElementChild.style.backgroundColor;
  h4Field.innerHTML = `${singleNotePicked.firstElementChild.textContent}<i class="fas fa-check"></i>`;
  const singleNoteText = singleNotePicked.querySelector("p");
  textAreaField.value = singleNoteText.textContent;
  singleNotePicked.style.display = "none";
  editTaskModal.classList.add("active");
  editTaskField.style.display = "flex";
  handleSubmitEditTask(h4Field, singleNoteText, singleNotePicked);
};
const removeSingleNote = (event) => {
  event.target.closest("div").remove();
  const eventId = event.target.closest("div").dataset.id;
  tasksList = tasksList.filter((task) => task.id !== eventId);
  localStorage.setItem("tasks", JSON.stringify(tasksList));
};
const checkIfLocalStorage = () => {
  if (localStorage.getItem("tasks")) {
    const localStorageArr = JSON.parse(localStorage.getItem("tasks"));
    tasksList = localStorageArr;
    tasksList.forEach(({ id, category, textContent, color }) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("singleNote");
      newDiv.dataset.id = id;
      newDiv.innerHTML = `<h4>${category}<span><i class="fas fa-edit edit"></i><i class="far fa-trash-alt remove"></i></span></h4><p>${textContent}</p>`;

      newDiv.firstElementChild.style.backgroundColor = color;
      main.appendChild(newDiv);
      const editButtons = [...document.querySelectorAll(".edit")];
      for (let itm of editButtons) {
        itm.addEventListener("click", editSingleNote);
      }
      const removeButtons = [...document.querySelectorAll(".remove")];
      removeButtons.forEach((itm) =>
        itm.addEventListener("click", removeSingleNote)
      );
    });
  }
  return;
};
checkIfLocalStorage();
const colorsArr = ["blue", "pink", "green", "yellow", "orange", "aqua"];
const randomColorFunc = () => {
  const singleColorIndex = Math.floor(Math.random() * colorsArr.length);

  return colorsArr[singleColorIndex];
};
handleAddDataToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
};
createDivFunc = (text, select) => {
  const newDiv = document.createElement("div");
  newDiv.classList.add("singleNote");
  newDiv.dataset.id = Math.floor(Math.random() * 1000);
  newDiv.innerHTML = `<h4>${select}<span><i class="fas fa-edit edit"></i><i class="far fa-trash-alt remove"></i></span></h4><p>${text}</p>`;
  const pickRightColor = randomColorFunc();
  newDiv.firstElementChild.style.backgroundColor = pickRightColor;
  main.appendChild(newDiv);
  tasksList.push({
    id: newDiv.dataset.id,
    category: select,
    textContent: text,
    color: pickRightColor,
  });
  handleAddDataToLocalStorage();
  const editButtons = [...document.querySelectorAll(".edit")];
  for (let itm of editButtons) {
    itm.addEventListener("click", editSingleNote);
  }
  const removeButtons = [...document.querySelectorAll(".remove")];
  removeButtons.forEach((itm) =>
    itm.addEventListener("click", removeSingleNote)
  );
};

const addTaskFunc = () => {
  let selectFilled = false;
  let textFilled = false;
  if (selectOp.value !== "default") {
    selectFilled = true;
  }
  if (text.value.length !== 0) {
    textFilled = true;
  }
  if (selectFilled && textFilled) {
    time.style.display = "flex";
    setTimeout(() => {
      time.style.display = "none";
      modal.style.display = "none";
      createDivFunc(text.value, selectOp.value);
    }, 3000);
  } else {
    alert("all input fields are required to be filled");
  }
};

const showModalFunc = () => {
  modal.style.display = "flex";
  text.value = "";
  selectOp.value = "default";
};
addBtn.addEventListener("click", showModalFunc);

const removeTaskFunc = () => {
  main.textContent = "";
  tasksList.length = 0;
  localStorage.clear();
};
submitBtn.addEventListener("click", addTaskFunc);
removeTask.addEventListener("click", removeTaskFunc);
