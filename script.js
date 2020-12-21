const listContainer = document.querySelector('.taskList');
const listPendingTasks = document.querySelector('.pendingTasks');
const listCompletedTasks = document.querySelector('.completedTasks');
const statusInput = document.querySelector('.statusInput');
const addInput = document.querySelector('.addInput');
const addForm = document.querySelector('.addForm');
const searchInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
var tasks = [];

function addTask() {
    if (addInput.value === '') {
        alert('Task input is empty');
        return;
    } else {
        let task = {
            status: false,
            text: addInput.value
        };
        savePendingTask(task);
    }
}

function selectTasks() {

    switch (statusInput.value) {
        case 'All':
            getAllTasks();
            break;
        case 'Pending':
            getPendingTasks();
            break;
        case 'Completed':
            getCompletedTasks();
            break;
    }
}

function getAllTasks() {
    listCompletedTasks.innerHTML = '';
    listPendingTasks.innerHTML = '';
    listPendingTasks.style.display = 'flex';
    listCompletedTasks.style.display = 'flex';

    let pendingTasks = JSON.parse(localStorage.getItem('pending'));
    let completedTasks = JSON.parse(localStorage.getItem('completed'));

    if (!pendingTasks) {
        tasks = completedTasks;
    } else if (!completedTasks) {
        tasks = pendingTasks;
    } else if (!pendingTasks && !completedTasks) {
        tasks = [];
    } else {
        tasks = pendingTasks.concat(completedTasks);
    }

    for (let i = 0; i < tasks.length; i++) {
        createTask(tasks[i]);
    }
}

function getPendingTasks() {
    tasks = [];
    listPendingTasks.innerHTML = '';
    listPendingTasks.style.display = 'flex';
    listCompletedTasks.style.display = 'none';

    if (localStorage.getItem('pending') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('pending'));
        for (let i = 0; i < tasks.length; i++) {
            createTask(tasks[i]);
        }
    }
}

function getCompletedTasks() {
    tasks = [];
    listCompletedTasks.innerHTML = '';
    listPendingTasks.style.display = 'none';
    listCompletedTasks.style.display = 'flex';

    if (localStorage.getItem('completed') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('completed'));
        for (let i = 0; i < tasks.length; i++) {
            createTask(tasks[i]);
        }
    }
}

function savePendingTask(task) {
    let tasks = [];

    if (localStorage.getItem('pending') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('pending'));
    }
    tasks.push(task);
    localStorage.setItem('pending', JSON.stringify(tasks));
}

function saveCompletedTask(task) {
    let tasks = [];

    if (localStorage.getItem('completed') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('completed'));
    }
    tasks.push(task);
    localStorage.setItem('completed', JSON.stringify(tasks));
}

function createTask(task) {
    const listItem = document.createElement('div');

    if (!task.status) {
        listItem.className = 'listItem pending';
        let innerContent = `
            <input class="itemStatus" type="checkbox">
            <input class="itemText" type="text" value="${task.text}" readonly>
            <button type="button" class="saveBtn" disabled></button>
            <button type="button" class="editBtn">
                <img src="assets/edit-icon.svg" alt="edit task" class="editIcon">
            </button>
            <button type="button" class="deleteBtn">
                <img src="assets/delete-icon.svg" alt="delete task" class="deleteIcon">
            </button>`;
        listItem.innerHTML = innerContent;
        listPendingTasks.appendChild(listItem);
    } else {
        listItem.className = 'listItem completed';
        let innerContent = `
            <input class="itemStatus" type="checkbox" checked>
            <input class="itemText" type="text" value="${task.text}" readonly>
            <button type="button" class="saveBtn" disabled></button>
            <button type="button" class="editBtn">
                <img src="assets/edit-icon.svg" alt="edit task" class="editIcon">
            </button>
            <button type="button" class="deleteBtn">
                <img src="assets/delete-icon.svg" alt="delete task" class="deleteIcon">
            </button>`;
        listItem.innerHTML = innerContent;
        listCompletedTasks.appendChild(listItem);
    }

}

function filterTasks() {
    let searchList = document.querySelectorAll('.itemText');

    if (searchInput.value === '') {
        for (let i = 0; i < searchList.length; i++) {
            searchList[i].parentElement.style.display = 'grid';
        }
    } else {
        for (let i = 0; i < searchList.length; i++) {
            if (searchList[i].value.toLowerCase().includes(searchInput.value.toLowerCase())) {
                searchList[i].parentElement.style.display = 'grid';
            } else {
                searchList[i].parentElement.style.display = 'none';
            }
        }
    }

}

function moveTaskToCompleted(e) {
    if (e.target.classList.contains('itemStatus') && e.target.checked) {
        let task = {
            status: true,
            text: e.target.parentElement.children[1].value
        };
        e.target.parentElement.remove();
        removePendingTask(task);
        saveCompletedTask(task);
        createTask(task);
    }
}

function moveTaskToPending(e) {
    if (e.target.classList.contains('itemStatus') && !e.target.checked) {
        let task = {
            status: false,
            text: e.target.parentElement.children[1].value
        };
        e.target.parentElement.remove();
        removeCompletedTask(task);
        savePendingTask(task);
        createTask(task);
    }
}

function deleteTask(e) {
    if (e.target.classList.contains('deleteIcon')) {
        if (confirm('Are you sure?')) {
            let task = {
                status: e.target.parentElement.parentElement.children[0].checked ? true : false,
                text: e.target.parentElement.parentElement.children[1].value
            }
            e.target.parentElement.parentElement.remove();
            task.status ? removeCompletedTask(task) : removePendingTask(task);
        }
    }

}

function removePendingTask(task) {
    let tasks = [];

    if (localStorage.getItem('pending') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('pending'));
    }


    for (let i = 0; i < tasks.length; i++) {
        if (task.text === tasks[i].text) {
            tasks.splice(i, 1);
        }
    }

    localStorage.setItem('pending', JSON.stringify(tasks));
}

function removeCompletedTask(task) {
    let tasks = [];

    if (localStorage.getItem('completed') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('completed'));
    }


    for (let i = 0; i < tasks.length; i++) {
        if (task.text === tasks[i].text) {
            tasks.splice(i, 1);
        }
    }

    localStorage.setItem('completed', JSON.stringify(tasks));
}

function editTask(e) {
    if (e.target.classList.contains('editIcon')) {
        let inputText = e.target.parentElement.parentElement.children[1];
        let inputStatus = e.target.parentElement.parentElement.children[0];
        let saveBtn = e.target.parentElement.parentElement.children[2];

        inputText.readOnly = false;
        inputText.focus();
        inputText.select();
        let prevText = inputText.value;
        saveBtn.disabled = false;

        if (!inputText.onkeydown) {
            inputText.onkeydown = function (e) {
                if (e.keyCode === 13) {
                    if (confirm('Do you want to save changes?')) {
                        let task = {
                            status: inputStatus.checked ? true : false,
                            text: this.value
                        };
                        saveEditedTask(task, prevText);
                    } else {
                        this.value = prevText;
                    }
                    this.readOnly = true;
                    saveBtn.disabled = true;
                    this.blur();
                }
            }
        }

        if (!saveBtn.onclick) {
            saveBtn.onclick = function () {
                if (confirm('Do you want to save changes?')) {
                    let task = {
                        status: inputStatus.checked ? true : false,
                        text: inputText.value
                    };
                    saveEditedTask(task, prevText);
                } else {
                    inputText.value = prevText;
                }
                inputText.readOnly = true;
                inputText.blur();
                this.disabled = true;
            }
        }
    }
}

function saveEditedTask(task, prevText) {
    let tasks = [];

    if (!task.status) {
        if (localStorage.getItem('pending') === null) {
            tasks = [];
        }
        else {
            tasks = JSON.parse(localStorage.getItem('pending'));
        }
    } else {
        if (localStorage.getItem('completed') === null) {
            tasks = [];
        }
        else {
            tasks = JSON.parse(localStorage.getItem('completed'));
        }
    }

    for (let i = 0; i < tasks.length; i++) {
        if (prevText === tasks[i].text) {
            tasks[i].text = task.text;
        }
    }

    if (!task.status) {
        localStorage.setItem('pending', JSON.stringify(tasks));
    } else {
        localStorage.setItem('completed', JSON.stringify(tasks));
    }
}

window.addEventListener('load', getAllTasks)
addForm.addEventListener('submit', addTask);
statusInput.addEventListener('change', selectTasks);
searchBtn.addEventListener('click', filterTasks);
searchInput.addEventListener('input', filterTasks);
listContainer.addEventListener('click', deleteTask);
listContainer.addEventListener('click', editTask);
listContainer.addEventListener('click', moveTaskToCompleted);
listContainer.addEventListener('click', moveTaskToPending);
