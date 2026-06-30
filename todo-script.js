// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.editingTaskId = null;
    }

    // Load tasks from localStorage
    loadTasks() {
        const stored = localStorage.getItem('tasks');
        return stored ? JSON.parse(stored) : [];
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Add new task
    addTask(text, category = 'otro', description = '') {
        const task = {
            id: Date.now(),
            text: text,
            category: category,
            description: description,
            completed: false,
            createdAt: new Date().toLocaleString('es-ES')
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    // Delete task
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    // Update task
    updateTask(id, text, category, description) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = text;
            task.category = category;
            task.description = description;
            this.saveTasks();
        }
    }

    // Clear completed tasks
    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
    }

    // Delete all tasks
    deleteAll() {
        this.tasks = [];
        this.saveTasks();
    }

    // Get filtered tasks
    getFilteredTasks() {
        let filtered = this.tasks;

        // Filter by status
        if (this.currentFilter === 'pending') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(task => task.category === this.currentCategory);
        }

        return filtered;
    }

    // Get stats
    getStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length
        };
    }

    // Export tasks as JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tareas-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
    }
}

// Initialize
const taskManager = new TaskManager();

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const categoryFilter = document.getElementById('categoryFilter');
const tabBtns = document.querySelectorAll('.tab-btn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const deleteAllBtn = document.getElementById('deleteAll');
const exportBtn = document.getElementById('exportBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.querySelector('.close-btn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const editTaskInput = document.getElementById('editTaskInput');
const editCategoryInput = document.getElementById('editCategoryInput');
const editDescriptionInput = document.getElementById('editDescriptionInput');

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

categoryFilter.addEventListener('change', (e) => {
    taskManager.currentCategory = e.target.value;
    renderTasks();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        taskManager.currentFilter = btn.dataset.tab;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);
deleteAllBtn.addEventListener('click', deleteAll);
exportBtn.addEventListener('click', () => taskManager.exportTasks());

closeModalBtn.addEventListener('click', closeModal);
cancelEditBtn.addEventListener('click', closeModal);
saveEditBtn.addEventListener('click', saveEdit);

// Functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Por favor escribe una tarea');
        return;
    }

    taskManager.addTask(text, 'otro');
    taskInput.value = '';
    taskInput.focus();
    renderTasks();
}

function deleteTask(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        taskManager.deleteTask(id);
        renderTasks();
    }
}

function toggleTask(id) {
    taskManager.toggleTask(id);
    renderTasks();
}

function editTask(id) {
    const task = taskManager.tasks.find(t => t.id === id);
    if (!task) return;

    taskManager.editingTaskId = id;
    editTaskInput.value = task.text;
    editCategoryInput.value = task.category;
    editDescriptionInput.value = task.description || '';
    editModal.style.display = 'block';
    editTaskInput.focus();
}

function closeModal() {
    editModal.style.display = 'none';
    taskManager.editingTaskId = null;
}

function saveEdit() {
    const id = taskManager.editingTaskId;
    const text = editTaskInput.value.trim();
    const category = editCategoryInput.value;
    const description = editDescriptionInput.value.trim();

    if (!text) {
        alert('Por favor escribe una tarea');
        return;
    }

    taskManager.updateTask(id, text, category, description);
    closeModal();
    renderTasks();
}

function clearCompleted() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las tareas completadas?')) {
        taskManager.clearCompleted();
        renderTasks();
    }
}

function deleteAll() {
    if (confirm('¿Estás seguro de que quieres eliminar TODAS las tareas?')) {
        taskManager.deleteAll();
        renderTasks();
    }
}

function renderTasks() {
    const filteredTasks = taskManager.getFilteredTasks();
    const stats = taskManager.getStats();

    // Update stats
    totalCount.textContent = stats.total;
    completedCount.textContent = stats.completed;
    pendingCount.textContent = stats.pending;

    // Render tasks list
    tasksList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    filteredTasks.forEach(task => {
        const taskEl = createTaskElement(task);
        tasksList.appendChild(taskEl);
    });
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.setAttribute('data-category', task.category);
    div.setAttribute('data-id', task.id);

    div.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${task.id})">
        <div class="task-content">
            <div class="task-header">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <span class="task-category ${task.category}">${task.category}</span>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-date">Creada: ${task.createdAt}</div>
        </div>
        <div class="task-actions">
            <button class="task-btn edit-btn" onclick="editTask(${task.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="task-btn delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;

    return div;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal();
    }
});

// Initial render
renderTasks();

console.log('✓ Todo App cargada correctamente');
