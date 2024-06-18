class Task {
    constructor(id, title, date){
        this.id = id
        this.title = title
        this.date = date
    }
}

class Database{
    constructor(){
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
    }

    getTasks(){
        return this.tasks
    }

    saveToLocalstorage(){
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    addTask(title, date){
        let index = 1
        let task

        if(this.tasks.length <= 0){
            task = new Task(index, title, date)
        }else{
            index = this.tasks.length-1
            task = new Task(this.tasks[index].id+1, title, date)
        }

        this.tasks.push(task)
        this.saveToLocalstorage()
    }

    deleteTask(id){
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.saveToLocalstorage()
    }

    getTaskById(id){
        return this.tasks.filter(task => task.id === id)
    }

    updateTask(id, newTitle, newDate) {
        this.tasks.forEach(task => {
            if(task.id == id){
                task.title = newTitle
                task.date = newDate
                this.saveToLocalstorage()
            }
        })
    }
}

const db = new Database()
const submitButton = document.getElementById('submit-button') || false
let resultOfSaving = document.getElementById('warning')

if(submitButton){
    const title = document.getElementById('description-input')
    const date = document.getElementById('date-input')
    const urlParams = new URLSearchParams(window.location.search)
    const taskId = urlParams.get('id')

    if(taskId){
        const task = db.getTaskById(parseInt(taskId))
        title.value = task[0].title
        date.value = task[0].date
    }


    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        if(verifyFields(title.value, date.value)){
            if(taskId){
                db.updateTask(taskId, title.value, date.value)
            }else{
                db.addTask(title.value, date.value)
            }
            fieldsFull(title, date)
        }else{
            fieldsEmpty()
        }
    })
}

function verifyFields(title, date){
    if(title.length <= 0 || !date){
        return false
    }
    return true
}

function fieldsEmpty(){
    resultOfSaving.innerHTML = "Preencha todos os campos"
    resultOfSaving.id = "warning"
}

function fieldsFull(title, date){
    resultOfSaving.innerHTML = "Salvo com sucesso"
    resultOfSaving.id = "sucess"
    title.value = ""
    date.value = ""
}

function displayTask(){
    const tasks = db.getTasks()
    const taskContainer = document.getElementById("tasks-container") || false

    if(taskContainer){
        taskContainer.innerHTML = ""
    }
    
    for(let task in tasks){
        let taskItem = document.createElement('li')
        taskItem.id = `task-${tasks[task].id}`
        taskItem.className = "task"

        let taskInfo = document.createElement('div')
        taskInfo.id = "task-info"

        let taskTitle = document.createElement('p')
        taskTitle.id = "task-title"
        taskTitle.innerHTML = tasks[task].title

        let taskDueDate = document.createElement('span')
        taskDueDate.id = "task-due-date"
        taskDueDate.innerHTML = `DUE ${dateFormatter(tasks[task].date)}`

        taskInfo.appendChild(taskTitle)
        taskInfo.appendChild(taskDueDate)

        let icons = document.createElement('div')
        icons.id = "icons"

        let edit = document.createElement('img')
        edit.src = 'assets/edit-icon.svg'
        edit.alt = "ícone de editar"
        edit.addEventListener("click", (e) => {
            e.preventDefault()
            openEdit(tasks[task])
        })

        let trash = document.createElement('img')
        trash.src = 'assets/trash-icon.svg'
        trash.alt = "ícone de excluir"
        trash.addEventListener("click", (e) => {
            e.preventDefault()
            db.deleteTask(tasks[task].id)
            displayTask()
        })

        icons.appendChild(edit)
        icons.appendChild(trash)

        taskItem.appendChild(taskInfo)
        taskItem.appendChild(icons)

        if(taskContainer){
            taskContainer.appendChild(taskItem)
        }
    }
}

function dateFormatter(date){
    const dateSplited = date.split("-")
    return `${dateSplited[2]}/${dateSplited[1]}/${dateSplited[0]}`
}

function openEdit(task) {
    window.location.href = `../pages/new-task.html?id=${task.id}`
}

displayTask()