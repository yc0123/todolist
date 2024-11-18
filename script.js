// 從 localStorage 獲取任務
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentSort = 'none';
let editingIndex = -1;

// 渲染任務列表
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    // 先過濾任務
    let displayTasks = currentFilter === 'all' 
        ? [...tasks] 
        : tasks.filter(task => task.category === currentFilter);
    
    // 根據排序選項排序任務
    if (currentSort !== 'none') {
        displayTasks.sort((a, b) => {
            // 處理空日期的情況
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            
            return currentSort === 'asc' 
                ? dateA - dateB 
                : dateB - dateA;
        });
    }
    
    // 渲染排序後的任務
    displayTasks.forEach((task, index) => {
        const li = document.createElement('li');
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
        const taskIndex = tasks.indexOf(task);
        
        if (taskIndex === editingIndex) {
            // 編輯模式的 HTML
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} disabled>
                <div class="edit-container">
                    <input type="text" class="edit-input" value="${task.text}">
                    <select class="edit-category">
                        <option value="">選擇分類</option>
                        <option value="工作" ${task.category === '工作' ? 'selected' : ''}>工作</option>
                        <option value="生活" ${task.category === '生活' ? 'selected' : ''}>生活</option>
                        <option value="學習" ${task.category === '學習' ? 'selected' : ''}>學習</option>
                        <option value="其他" ${task.category === '其他' ? 'selected' : ''}>其他</option>
                    </select>
                    <input type="date" class="edit-date" value="${task.dueDate || ''}">
                    <div class="edit-buttons">
                        <button onclick="saveEdit(${taskIndex})" class="save-btn">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="cancelEdit()" class="cancel-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        } else {
            // 一般模式的 HTML
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onclick="toggleTask(${taskIndex})">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="category-tag ${task.category ? `category-${task.category}` : ''}">${task.category || ''}</span>
                <span class="task-date ${isOverdue ? 'task-overdue' : ''}">${task.dueDate ? formatDate(task.dueDate) : ''}</span>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="startEdit(${taskIndex})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${taskIndex})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        taskList.appendChild(li);
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

// 添加新任務
function addTask() {
    const input = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const categoryInput = document.getElementById('categoryInput');
    const text = input.value.trim();
    const dueDate = dateInput.value;
    const category = categoryInput.value;
    
    if (text) {
        tasks.push({
            text: text,
            completed: false,
            dueDate: dueDate || null,
            category: category || null
        });
        input.value = '';
        dateInput.value = '';
        categoryInput.value = '';
        renderTasks();
    }
}

// 切換任務狀態
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// 刪除任務
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// 監聽回車鍵
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 過濾任務
function filterTasks() {
    currentFilter = document.getElementById('categoryFilter').value;
    renderTasks();
}

// 排序任務
function sortTasks() {
    currentSort = document.getElementById('sortOrder').value;
    renderTasks();
}

// 開始編輯
function startEdit(index) {
    editingIndex = index;
    renderTasks();
}

// 取消編輯
function cancelEdit() {
    editingIndex = -1;
    renderTasks();
}

// 保存編輯
function saveEdit(index) {
    const editContainer = document.querySelector('.edit-container');
    const newText = editContainer.querySelector('.edit-input').value.trim();
    const newDate = editContainer.querySelector('.edit-date').value;
    const newCategory = editContainer.querySelector('.edit-category').value;
    
    if (newText) {
        tasks[index].text = newText;
        tasks[index].dueDate = newDate || null;
        tasks[index].category = newCategory || null;
        editingIndex = -1;
        renderTasks();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
}); 