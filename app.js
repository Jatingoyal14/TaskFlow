// TaskFlow - MERN Stack Task Manager Application
class TaskManager {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.categories = ["Work", "Personal", "Learning", "Health", "Finance", "Other"];
        this.currentEditingTask = null;
        
        // Initialize immediately
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        // Wait for DOM to be ready if it's not already
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            // DOM is already ready
            this.setupApp();
        }
    }

    setupApp() {
        this.loadSampleData();
        this.bindEvents();
        this.checkAuthState();
    }

    // Load sample data if not exists
    loadSampleData() {
        if (!localStorage.getItem('taskflow_users')) {
            const sampleData = {
                users: [{
                    id: "user1",
                    name: "John Doe",
                    email: "john@example.com",
                    password: "password123",
                    createdAt: new Date().toISOString()
                }],
                tasks: [
                    {
                        id: "task1",
                        userId: "user1",
                        title: "Complete Project Proposal",
                        description: "Write and submit the project proposal for the new client",
                        category: "Work",
                        priority: "High",
                        status: "To Do",
                        dueDate: "2024-12-25",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: "task2",
                        userId: "user1",
                        title: "Learn React Hooks",
                        description: "Study useState, useEffect, and custom hooks",
                        category: "Learning",
                        priority: "Medium",
                        status: "In Progress",
                        dueDate: "2024-12-30",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: "task3",
                        userId: "user1",
                        title: "Grocery Shopping",
                        description: "Buy groceries for the week",
                        category: "Personal",
                        priority: "Low",
                        status: "Completed",
                        dueDate: "2024-12-20",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]
            };
            
            localStorage.setItem('taskflow_users', JSON.stringify(sampleData.users));
            localStorage.setItem('taskflow_tasks', JSON.stringify(sampleData.tasks));
        }
    }

    // Bind all event listeners
    bindEvents() {
        // Authentication events
        this.bindAuthEvents();
        // Task management events  
        this.bindTaskEvents();
        // Search and filter events
        this.bindFilterEvents();
    }

    bindAuthEvents() {
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login form submitted');
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleRegister();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    bindTaskEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskForm = document.getElementById('taskForm');
        const closeModal = document.getElementById('closeModal');
        const cancelTask = document.getElementById('cancelTask');
        const taskModal = document.getElementById('taskModal');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTaskModal();
            });
        }

        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeTaskModal();
            });
        }

        if (cancelTask) {
            cancelTask.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeTaskModal();
            });
        }

        // Modal close on backdrop click
        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target.id === 'taskModal') {
                    this.closeTaskModal();
                }
            });
        }
    }

    bindFilterEvents() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterTasks();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterTasks();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => {
                this.filterTasks();
            });
        }
    }

    // Check authentication state on load
    checkAuthState() {
        const token = localStorage.getItem('taskflow_token');
        const userData = localStorage.getItem('taskflow_user');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.showDashboard();
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.showAuthContainer();
            }
        } else {
            this.showAuthContainer();
        }
    }

    // Show loading overlay
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    // Hide loading overlay
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    // Simulate API delay
    async simulateApiDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Authentication methods
    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        this.clearFormErrors();
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (registerForm) registerForm.classList.remove('hidden');
        if (loginForm) loginForm.classList.add('hidden');
        this.clearFormErrors();
    }

    showAuthContainer() {
        const authContainer = document.getElementById('auth-container');
        const dashboard = document.getElementById('dashboard');
        
        if (authContainer) authContainer.classList.remove('hidden');
        if (dashboard) dashboard.classList.add('hidden');
    }

    showDashboard() {
        const authContainer = document.getElementById('auth-container');
        const dashboard = document.getElementById('dashboard');
        
        if (authContainer) authContainer.classList.add('hidden');
        if (dashboard) dashboard.classList.remove('hidden');
        
        this.loadUserData();
        this.populateCategoryFilters();
    }

    async handleLogin() {
        console.log('handleLogin called');
        this.showLoading();
        this.clearFormErrors();
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('Login inputs not found');
            this.hideLoading();
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        console.log('Login attempt with email:', email);
        
        // Simulate API delay
        await this.simulateApiDelay(500);
        
        // Validate input
        let hasErrors = false;
        
        if (!email) {
            this.showError('loginEmailError', 'Email is required');
            hasErrors = true;
        } else if (!this.isValidEmail(email)) {
            this.showError('loginEmailError', 'Please enter a valid email');
            hasErrors = true;
        }
        
        if (!password) {
            this.showError('loginPasswordError', 'Password is required');
            hasErrors = true;
        }
        
        if (hasErrors) {
            this.hideLoading();
            return;
        }
        
        try {
            // Check credentials
            const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('Login successful for user:', user.name);
                // Simulate JWT token
                const token = this.generateToken(user);
                localStorage.setItem('taskflow_token', token);
                localStorage.setItem('taskflow_user', JSON.stringify(user));
                
                this.currentUser = user;
                this.hideLoading();
                this.showDashboard();
            } else {
                console.log('Invalid credentials');
                this.showError('loginPasswordError', 'Invalid email or password');
                this.hideLoading();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('loginPasswordError', 'An error occurred during login');
            this.hideLoading();
        }
    }

    async handleRegister() {
        console.log('handleRegister called');
        this.showLoading();
        this.clearFormErrors();
        
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        
        if (!nameInput || !emailInput || !passwordInput) {
            this.hideLoading();
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Simulate API delay
        await this.simulateApiDelay(500);
        
        // Validate input
        let hasErrors = false;
        
        if (!name) {
            this.showError('registerNameError', 'Full name is required');
            hasErrors = true;
        } else if (name.length < 2) {
            this.showError('registerNameError', 'Name must be at least 2 characters');
            hasErrors = true;
        }
        
        if (!email) {
            this.showError('registerEmailError', 'Email is required');
            hasErrors = true;
        } else if (!this.isValidEmail(email)) {
            this.showError('registerEmailError', 'Please enter a valid email');
            hasErrors = true;
        }
        
        if (!password) {
            this.showError('registerPasswordError', 'Password is required');
            hasErrors = true;
        } else if (password.length < 6) {
            this.showError('registerPasswordError', 'Password must be at least 6 characters');
            hasErrors = true;
        }
        
        if (hasErrors) {
            this.hideLoading();
            return;
        }
        
        try {
            // Check if email exists
            const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                this.showError('registerEmailError', 'An account with this email already exists');
                this.hideLoading();
                return;
            }
            
            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('taskflow_users', JSON.stringify(users));
            
            // Auto login
            const token = this.generateToken(newUser);
            localStorage.setItem('taskflow_token', token);
            localStorage.setItem('taskflow_user', JSON.stringify(newUser));
            
            this.currentUser = newUser;
            this.hideLoading();
            this.showDashboard();
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('registerPasswordError', 'An error occurred during registration');
            this.hideLoading();
        }
    }

    handleLogout() {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        this.currentUser = null;
        this.tasks = [];
        this.showAuthContainer();
        this.clearForms();
    }

    // Load user data and tasks
    loadUserData() {
        const userNameElement = document.getElementById('userName');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
        this.loadTasks();
    }

    // Load tasks for current user
    loadTasks() {
        try {
            const allTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
            this.tasks = allTasks.filter(task => task.userId === this.currentUser.id);
            this.renderTasks();
            this.updateStatistics();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
            this.renderTasks();
            this.updateStatistics();
        }
    }

    // Render tasks in columns
    renderTasks() {
        const todoList = document.getElementById('todoList');
        const progressList = document.getElementById('progressList');
        const completedList = document.getElementById('completedList');
        
        if (!todoList || !progressList || !completedList) {
            return;
        }
        
        // Clear existing tasks
        todoList.innerHTML = '';
        progressList.innerHTML = '';
        completedList.innerHTML = '';
        
        // Filter tasks based on search and filters
        const filteredTasks = this.getFilteredTasks();
        
        // Group tasks by status
        const tasksByStatus = {
            'To Do': [],
            'In Progress': [],
            'Completed': []
        };
        
        filteredTasks.forEach(task => {
            if (tasksByStatus[task.status]) {
                tasksByStatus[task.status].push(task);
            }
        });
        
        // Render tasks in each column
        this.renderTasksInColumn(todoList, tasksByStatus['To Do'], 'todoCount');
        this.renderTasksInColumn(progressList, tasksByStatus['In Progress'], 'progressCount');
        this.renderTasksInColumn(completedList, tasksByStatus['Completed'], 'completedCount');
    }

    // Render tasks in a specific column
    renderTasksInColumn(container, tasks, counterId) {
        const countElement = document.getElementById(counterId);
        if (countElement) {
            countElement.textContent = tasks.length;
        }
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks</h3>
                    <p>Tasks will appear here</p>
                </div>
            `;
            return;
        }
        
        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    // Create task card element
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.taskId = task.id;
        
        const isOverdue = this.isTaskOverdue(task);
        if (isOverdue && task.status !== 'Completed') {
            card.classList.add('overdue');
        }
        
        const priorityClass = task.priority.toLowerCase();
        const dueDateClass = isOverdue && task.status !== 'Completed' ? 'overdue' : '';
        
        card.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                <div class="task-actions">
                    <button class="action-btn" onclick="taskManager.editTask('${task.id}')" title="Edit">✏️</button>
                    <button class="action-btn delete" onclick="taskManager.deleteTask('${task.id}')" title="Delete">🗑️</button>
                </div>
            </div>
            <p class="task-description">${this.escapeHtml(task.description || 'No description')}</p>
            <div class="task-meta">
                <span class="task-category">${task.category}</span>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
                <span class="task-due-date ${dueDateClass}">${this.formatDate(task.dueDate)}</span>
            </div>
            <div class="task-status-buttons">
                <button class="status-btn ${task.status === 'To Do' ? 'active' : ''}" 
                        onclick="taskManager.updateTaskStatus('${task.id}', 'To Do')">To Do</button>
                <button class="status-btn ${task.status === 'In Progress' ? 'active' : ''}" 
                        onclick="taskManager.updateTaskStatus('${task.id}', 'In Progress')">In Progress</button>
                <button class="status-btn ${task.status === 'Completed' ? 'active' : ''}" 
                        onclick="taskManager.updateTaskStatus('${task.id}', 'Completed')">Completed</button>
            </div>
        `;
        
        return card;
    }

    // Get filtered tasks based on search and filter inputs
    getFilteredTasks() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const categoryFilterValue = categoryFilter ? categoryFilter.value : '';
        const priorityFilterValue = priorityFilter ? priorityFilter.value : '';
        
        return this.tasks.filter(task => {
            const matchesSearch = !searchTerm || 
                task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !categoryFilterValue || task.category === categoryFilterValue;
            const matchesPriority = !priorityFilterValue || task.priority === priorityFilterValue;
            
            return matchesSearch && matchesCategory && matchesPriority;
        });
    }

    // Filter tasks and re-render
    filterTasks() {
        this.renderTasks();
    }

    // Update task status
    async updateTaskStatus(taskId, newStatus) {
        this.showLoading();
        await this.simulateApiDelay(300);
        
        try {
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex].status = newStatus;
                this.tasks[taskIndex].updatedAt = new Date().toISOString();
                
                // Update localStorage
                const allTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
                const globalTaskIndex = allTasks.findIndex(t => t.id === taskId);
                if (globalTaskIndex !== -1) {
                    allTasks[globalTaskIndex] = this.tasks[taskIndex];
                    localStorage.setItem('taskflow_tasks', JSON.stringify(allTasks));
                }
                
                this.renderTasks();
                this.updateStatistics();
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
        
        this.hideLoading();
    }

    // Open task modal for creating new task
    openTaskModal(task = null) {
        this.currentEditingTask = task;
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        if (!modal || !modalTitle || !form) {
            return;
        }
        
        if (task) {
            modalTitle.textContent = 'Edit Task';
            this.populateTaskForm(task);
        } else {
            modalTitle.textContent = 'Add New Task';
            form.reset();
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dueDateInput = document.getElementById('taskDueDate');
            if (dueDateInput) {
                dueDateInput.value = tomorrow.toISOString().split('T')[0];
            }
        }
        
        this.populateTaskCategories();
        modal.classList.remove('hidden');
        
        const titleInput = document.getElementById('taskTitle');
        if (titleInput) {
            setTimeout(() => titleInput.focus(), 100);
        }
    }

    // Close task modal
    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditingTask = null;
        this.clearFormErrors();
    }

    // Edit task
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.openTaskModal(task);
        }
    }

    // Delete task
    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        this.showLoading();
        await this.simulateApiDelay(300);
        
        try {
            // Remove from tasks array
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            
            // Update localStorage
            const allTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
            const updatedTasks = allTasks.filter(t => t.id !== taskId);
            localStorage.setItem('taskflow_tasks', JSON.stringify(updatedTasks));
            
            this.renderTasks();
            this.updateStatistics();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
        
        this.hideLoading();
    }

    // Save task (create or update)
    async saveTask() {
        this.showLoading();
        this.clearFormErrors();
        
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const categoryInput = document.getElementById('taskCategory');
        const priorityInput = document.getElementById('taskPriority');
        const dueDateInput = document.getElementById('taskDueDate');
        const statusInput = document.getElementById('taskStatus');
        
        if (!titleInput || !categoryInput || !priorityInput || !dueDateInput || !statusInput) {
            this.hideLoading();
            return;
        }
        
        const title = titleInput.value.trim();
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const category = categoryInput.value;
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const status = statusInput.value;
        
        // Simulate API delay
        await this.simulateApiDelay(500);
        
        // Validate input
        let hasErrors = false;
        
        if (!title) {
            this.showError('titleError', 'Title is required');
            hasErrors = true;
        } else if (title.length < 3) {
            this.showError('titleError', 'Title must be at least 3 characters');
            hasErrors = true;
        }
        
        if (!category) {
            hasErrors = true;
        }
        
        if (!priority) {
            hasErrors = true;
        }
        
        if (!dueDate) {
            hasErrors = true;
        }
        
        if (hasErrors) {
            this.hideLoading();
            return;
        }
        
        try {
            const taskData = {
                title,
                description,
                category,
                priority,
                status,
                dueDate,
                updatedAt: new Date().toISOString()
            };
            
            if (this.currentEditingTask) {
                // Update existing task
                const taskIndex = this.tasks.findIndex(t => t.id === this.currentEditingTask.id);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
                    
                    // Update localStorage
                    const allTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
                    const globalTaskIndex = allTasks.findIndex(t => t.id === this.currentEditingTask.id);
                    if (globalTaskIndex !== -1) {
                        allTasks[globalTaskIndex] = this.tasks[taskIndex];
                        localStorage.setItem('taskflow_tasks', JSON.stringify(allTasks));
                    }
                }
            } else {
                // Create new task
                const newTask = {
                    id: 'task_' + Date.now(),
                    userId: this.currentUser.id,
                    ...taskData,
                    createdAt: new Date().toISOString()
                };
                
                this.tasks.push(newTask);
                
                // Update localStorage
                const allTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
                allTasks.push(newTask);
                localStorage.setItem('taskflow_tasks', JSON.stringify(allTasks));
            }
            
            this.renderTasks();
            this.updateStatistics();
            this.closeTaskModal();
        } catch (error) {
            console.error('Error saving task:', error);
        }
        
        this.hideLoading();
    }

    // Populate task form with data
    populateTaskForm(task) {
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const categoryInput = document.getElementById('taskCategory');
        const priorityInput = document.getElementById('taskPriority');
        const statusInput = document.getElementById('taskStatus');
        const dueDateInput = document.getElementById('taskDueDate');
        
        if (titleInput) titleInput.value = task.title;
        if (descriptionInput) descriptionInput.value = task.description || '';
        if (categoryInput) categoryInput.value = task.category;
        if (priorityInput) priorityInput.value = task.priority;
        if (statusInput) statusInput.value = task.status;
        if (dueDateInput) dueDateInput.value = task.dueDate;
    }

    // Populate category options
    populateTaskCategories() {
        const categorySelect = document.getElementById('taskCategory');
        if (!categorySelect) return;
        
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Populate category filters
    populateCategoryFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;
        
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Update statistics
    updateStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'Completed').length;
        const pending = this.tasks.filter(t => t.status !== 'Completed').length;
        const overdue = this.tasks.filter(t => this.isTaskOverdue(t) && t.status !== 'Completed').length;
        
        const totalElement = document.getElementById('totalTasks');
        const completedElement = document.getElementById('completedTasks');
        const pendingElement = document.getElementById('pendingTasks');
        const overdueElement = document.getElementById('overdueTasks');
        
        if (totalElement) totalElement.textContent = total;
        if (completedElement) completedElement.textContent = completed;
        if (pendingElement) pendingElement.textContent = pending;
        if (overdueElement) overdueElement.textContent = overdue;
    }

    // Utility methods
    generateToken(user) {
        // Simple token simulation
        return btoa(JSON.stringify({
            userId: user.id,
            email: user.email,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isTaskOverdue(task) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFormErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
    }

    clearForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const taskForm = document.getElementById('taskForm');
        
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
        if (taskForm) taskForm.reset();
        
        this.clearFormErrors();
    }
}

// Initialize the application when script loads
const taskManager = new TaskManager();

// Make taskManager globally accessible for inline event handlers
window.taskManager = taskManager;